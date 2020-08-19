import tempfile
import os

from PIL import Image

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from core import models

BLOGS = reverse('blogs:blog-list')


def get_blog(blog_id):
    return reverse('blogs:blog-detail', args=[blog_id])


class PublicBlogTest(TestCase):

    def test_unauthorized_user_has_no_access_to_blogs(self):
        '''Test unauthorized user cannot access blogs'''
        api = APIClient()
        resp = api.get(BLOGS)

        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user_has_no_access_to_blog(self):
        '''Test unauthorized user cannot access individual blog'''
        api = APIClient()
        resp = api.get(get_blog(1))

        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateBlogTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='username',
            email='email@gmail.com',
            password='password'
        )
        self.client.force_authenticate(self.user)

    def test_user_can_access_all_blogs(self):
        '''Test authorized users can access the blogs list'''
        resp = self.client.get(BLOGS)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_blog_can_take_in_image(self):
        '''Test users can upload images into their blogs'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf
            }

            resp = self.client.post(BLOGS, payload)

            self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        blog = models.Blog.objects.get(title='Title')
        self.assertEqual(payload['title'], resp.data['title'])
        self.assertEqual(payload['content'], resp.data['content'])
        self.assertIsNotNone(resp.data['image'])
        self.assertTrue(os.path.exists(blog.image.path))

    def test_created_blog_is_in_db(self):
        '''Test that the newly created blogs are in the database'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf
            }

            resp = self.client.post(BLOGS, payload)

        blog = models.Blog.objects.filter(title=payload['title']).exists()
        self.assertTrue(blog)

    def test_user_is_assigned_to_blog(self):
        '''Test that users are automatically assigned to proper blog'''
        user2 = get_user_model().objects.create_user(
            username='user2',
            password='password',
            email='email@gmail.com'
        )
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf
            }

            resp = self.client.post(BLOGS, payload)
            self.assertEqual(resp.status_code, 201)
        blog = models.Blog.objects.get(title='Title')
        self.assertEqual(blog.user, self.user)

    def test_user_can_access_individual_blogs(self):
        '''Test users can access blog detail'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf
            }

            resp = self.client.post(BLOGS, payload)
        resp = self.client.get(get_blog(1))

        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_user_can_update_own_blog(self):
        '''Test users can update their own blog'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf
            }

            resp = self.client.post(BLOGS, payload)

        new = {
            'title': 'new_title'
        }
        resp = self.client.patch(get_blog(1), new)

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['title'], new['title'])

    def test_user_can_delete_own_blog(self):
        '''Test users can delete their own blog'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf
            }

            resp1 = self.client.post(BLOGS, payload)
            self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)
        blog = models.Blog.objects.all().filter(title='Title').first()
        resp = self.client.delete(get_blog(blog.id))

        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_blog_requires_title(self):
        '''Test blog needs a title when it gets created'''
        payload = {
            'content': 'Content'
        }

        resp = self.client.post(BLOGS, payload)

        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_blog_requires_content(self):
        '''Test blog needs content when it gets created'''
        payload = {
            'title': 'Title'
        }

        resp = self.client.post(BLOGS, payload)

        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_blog_requires_image(self):
        '''Test blog needs image when it gets created'''
        payload = {
            'title': 'Title',
            'content': 'Content'
        }

        resp = self.client.post(BLOGS, payload)

        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_other_serializer_class(self):
        '''Test serializer class for retrieve and list is ReadBlogSerializer'''

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
        blog = models.Blog.objects.get(title='Title')
        resp = self.client.get(get_blog(blog.id))
        self.assertIn('title', resp.data)
        self.assertIn('content', resp.data)
        self.assertIn('tags', resp.data)
        self.assertIn('likes', resp.data)
        self.assertIn('uploaded', resp.data)
        self.assertIn('user', resp.data)
        self.assertIn('image', resp.data)

    def test_create_serializer_class(self):
        '''Test serializer class is CreateBlogSerializer for commands that aren't retrieve and list'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf
            }
            resp = self.client.post(BLOGS, payload)
        blog = models.Blog.objects.get(title='Title')
        self.assertIn('title', resp.data)
        self.assertIn('content', resp.data)
        self.assertIn('image', resp.data)

    def test_adding_tag_to_blog(self):
        '''Test adding tag to blog'''
        tag = models.Tag.objects.create(name='tag1')
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
        blog = models.Blog.objects.get(title='Title')
        blog.tags.add(tag)
        self.assertIsNotNone(blog.tags.get(name='tag1'))

    def test_uploading_blogs_with_tags(self):
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf,
                'tags': ['tag1']
            }
            resp = self.client.post(BLOGS, payload)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_blog_filtering_tags(self):
        '''Test filtering blogs with tags'''
        tag = models.Tag.objects.create(name='tag1')
        tag2 = models.Tag.objects.create(name='tag2')
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf,
                'tags': ['tag1']
            }
            self.client.post(BLOGS, payload)
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload2 = {
                'content': 'Content2',
                'title': 'Title2',
                'image': ntf,
                'tags': ['tag2']
            }
            self.client.post(BLOGS, payload2)
        resp = self.client.get(BLOGS, {'tag': 1})
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['title'], 'Title')

    def test_ordering_of_blogs_time(self):
        '''Test to ensure blogs are ordered by upload time'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf,
            }
            self.client.post(BLOGS, payload)
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload2 = {
                'content': 'Content2',
                'title': 'Title2',
                'image': ntf,
            }
            self.client.post(BLOGS, payload2)
        resp = self.client.get(BLOGS)
        self.assertEqual(resp.data[0]['title'], 'Title2')
        self.assertEqual(resp.data[1]['title'], 'Title')

    def test_ordering_of_blogs_likes(self):
        '''Test to ensure blogs are ordered by upload time'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload = {
                'content': 'Content',
                'title': 'Title',
                'image': ntf,
            }
            self.client.post(BLOGS, payload)
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload2 = {
                'content': 'Content2',
                'title': 'Title2',
                'image': ntf,
            }
            self.client.post(BLOGS, payload2)
        blog = models.Blog.objects.get(title='Title')
        self.client.patch(get_blog(blog.id), {'likes': 5})
        resp = self.client.get(BLOGS)
        self.assertEqual(resp.data[0]['title'], 'Title')
        self.assertEqual(resp.data[1]['title'], 'Title2')
