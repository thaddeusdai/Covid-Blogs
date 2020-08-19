from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework import status

from core import models


class AdminTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.admin = get_user_model().objects.create_superuser(
            username='admin',
            email='admin@gmail.com',
            password='password'
        )
        self.user = get_user_model().objects.create_user(
            username='user',
            email='email@gmail.com',
            password='password'
        )
        self.client.force_login(self.admin)

    def test_admin_access_user_listed(self):
        '''Test admin can access users list'''
        url = reverse('admin:core_user_changelist')
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_admin_user_in_user_listed(self):
        '''Test user is in users list in admin'''
        url = reverse('admin:core_user_changelist')
        resp = self.client.get(url)

        self.assertContains(resp, self.user.username)

    def test_admin_access_user_detail(self):
        '''Test admin user can access specific users'''
        url = reverse('admin:core_user_change', args=[self.user.id])
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_admin_add_user(self):
        '''Test admin user can add new users'''
        url = reverse('admin:core_user_add')
        payload = {
            'username': 'user2',
            'password': 'password',
            'email': 'email@gmail.com'
        }
        resp = self.client.post(url, payload)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_admin_add_tag(self):
        '''Test admin user can add new tags'''
        url = reverse('admin:core_tag_add')
        payload = {
            'name': 'tag'
        }
        resp = self.client.post(url, payload)
        self.assertIsNotNone(models.Tag.objects.get(name='tag'))
