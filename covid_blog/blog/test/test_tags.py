from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from core import models


TAGS = reverse('blogs:tag-list')


def get_tag(t_id):
    return reverse('blogs:tag-detail', args=[t_id])


class PublicTagTests(TestCase):

    def test_unauthorized_user_has_no_access_to_tags(self):
        '''Test unauthorized user cannot access comments'''
        api = APIClient()
        resp = api.get(TAGS)

        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user_has_no_access_to_tag(self):
        '''Test unauthorized user cannot access individual comment'''
        api = APIClient()
        resp = api.get(get_tag(1))

        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTagTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='username',
            email='email@gmail.com',
            password='password'
        )
        self.client.force_authenticate(self.user)

    def test_authorized_user_access_tags(self):
        '''Test authorized user has access to tags'''
        resp = self.client.get(TAGS)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_authorized_user_access_tag(self):
        '''Test authorized user can get individual tags'''
        tag = models.Tag.objects.create(name='tag1')
        resp = self.client.get(get_tag(tag.id))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_user_cannot_delete_tag(self):
        '''Test user cannot delete tags'''
        tag = models.Tag.objects.create(name='tag1')
        resp = self.client.delete(get_tag(tag.id))
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_user_cannot_update_tag(self):
        '''Test user cannot delete tags'''
        tag = models.Tag.objects.create(name='tag1')
        resp = self.client.patch(get_tag(tag.id), {'name': 'new_tag'})
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_user_cannot_create_tag(self):
        '''Test user cannot delete tags'''
        resp = self.client.post(TAGS, {'name': 'tag1'})
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
