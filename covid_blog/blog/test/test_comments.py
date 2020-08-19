from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient
from rest_framework import status

from core import models

import tempfile

from PIL import Image


COMMENTS = reverse('blogs:comment-list')
BLOGS = reverse('blogs:blog-list')


def get_comment(c_id):
    return reverse('blogs:comment-detail', args=[c_id])


class PublicCommentTests(TestCase):

    def test_unauthorized_user_has_no_access_to_comments(self):
        '''Test unauthorized user cannot access comments'''
        api = APIClient()
        resp = api.get(COMMENTS)

        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user_has_no_access_to_comment(self):
        '''Test unauthorized user cannot access individual comment'''
        api = APIClient()
        resp = api.get(get_comment(1))

        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateCommentTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='username',
            email='email@gmail.com',
            password='password'
        )
        self.client.force_authenticate(self.user)
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf
            }

            self.client.post(BLOGS, payload)
        self.blog = models.Blog.objects.get(title='Title')

    def test_getting_comments(self):
        '''Test getting comments'''
        resp = self.client.get(COMMENTS)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 0)

    def test_creating_a_comment(self):
        '''Test creating a comment'''
        resp = self.client.post(
            COMMENTS, {'content': 'content', 'blog': {'id': self.blog.id}, 'replied': {'id': -1}}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_creating_a_comment_in_database(self):
        '''Test creating a comment appears in database'''
        resp = self.client.post(
            COMMENTS, {'content': 'content', 'blog': {'id': self.blog.id}, 'replied': {'id': -1}}, format='json')
        self.assertTrue(models.Comment.objects.get(content='content'))

    def test_creating_a_reply_to_a_comment(self):
        '''Test creating a comment with a reply'''
        comment1 = models.Comment.objects.create(
            content='content1', user=self.user)
        resp = self.client.post(
            COMMENTS, {'content': 'content', 'blog': {'id': self.blog.id}, 'replied': {'id': comment1.id}}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['replied']['id'], comment1.id)

    def test_updating_comment(self):
        '''Test updating comment'''
        comment1 = models.Comment.objects.create(
            content='content1', user=self.user)
        resp = self.client.patch(get_comment(comment1.id), {
                                 'content': 'new content'})
        self.assertEqual(resp.data['content'], 'new content')

    def test_updating_a_comment_in_database(self):
        '''Test updating a comment appears in database'''
        comment1 = models.Comment.objects.create(
            content='content1', user=self.user)
        resp = self.client.patch(get_comment(comment1.id), {
                                 'content': 'new content'})
        comment = models.Comment.objects.get(id=comment1.id)
        self.assertEqual(comment.content, 'new content')

    def test_deleting_comment(self):
        '''Test deleting a comment'''
        comment1 = models.Comment.objects.create(
            content='content1', user=self.user)
        resp = self.client.delete(get_comment(comment1.id))
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_deleting_a_comment_in_database(self):
        '''Test deleting a comment appears in database'''
        comment1 = models.Comment.objects.create(
            content='content1', user=self.user)
        resp = self.client.delete(get_comment(comment1.id))
        comment = models.Comment.objects.filter(id=comment1.id).exists()
        self.assertFalse(comment)

    def test_blog_filtering_comments(self):
        '''Test filtering comments for ones without reply'''
        comment1 = models.Comment.objects.create(
            content='content1', user=self.user)
        comment2 = models.Comment.objects.create(
            content='content2', user=self.user, replied=comment1)

        resp = self.client.get(COMMENTS, {'parent': -1})
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['content'], 'content1')

    def test_ordering_comment(self):
        '''Test comments are ordered by likes then upload time'''
        comment1 = models.Comment.objects.create(
            content='content1', user=self.user, likes=10)
        comment2 = models.Comment.objects.create(
            content='content2', user=self.user, likes=1)
        comment3 = models.Comment.objects.create(
            content='content3', user=self.user, likes=5)
        comment4 = models.Comment.objects.create(
            content='content4', user=self.user, likes=3)
        resp = self.client.get(COMMENTS, {'order': 1})
        self.assertEqual(resp.data[0]['content'], 'content1')
        self.assertEqual(resp.data[1]['content'], 'content3')
        self.assertEqual(resp.data[2]['content'], 'content4')
        self.assertEqual(resp.data[3]['content'], 'content2')
