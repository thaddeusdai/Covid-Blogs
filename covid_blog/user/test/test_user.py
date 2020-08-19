from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

import tempfile
import os

from core import models

from PIL import Image

USER_CREATE = reverse('user:register')
USER_TOKEN = reverse('user:login')
USER_SELF = reverse('user:self')
USERS = reverse('user:user-list')
LOGOUT = reverse('user:logout')


def get_user(id):
    return reverse('user:user-detail', args=[id])


class UserTest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_login_failed_user_and_token(self):
        '''Test to make sure users can't login in with invalid credentials'''
        resp = self.client.post(USER_TOKEN, {
            'username': 'test',
            'password': 'password',
        })

        self.assertTrue(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_failed_user_and_token(self):
        '''Test to make sure token and user isn't in response in failed login'''
        resp = self.client.post(USER_TOKEN, {
            'username': 'test',
            'password': 'password',
        })

        self.assertNotIn('token', resp.data)
        self.assertNotIn('user', resp.data)

    def test_creating_valid_user(self):
        '''Tests API returns the user and token when registering'''
        resp = self.client.post(USER_CREATE, {
            'username': 'test',
            'email': 'email@gmail.com',
            'password': 'password',
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['user']['username'], 'test')
        self.assertEqual(resp.data['user']['email'], 'email@gmail.com')
        self.assertEqual(resp.data['user']['image'], None)
        self.assertIn('token', resp.data)

    def test_creating_valid_user_in_db(self):
        resp = self.client.post(USER_CREATE, {
            'username': 'test',
            'email': 'email@gmail.com',
            'password': 'password',
        })
        user = get_user_model().objects.get(username='test')
        self.assertTrue(user)

    def test_creating_multiple_users_with_same_username(self):
        '''Test creating multiple users with the same username is prevented'''

        user = get_user_model().objects.create_user(
            username='username',
            password='testpassword',
            email='test@gmail.com'
        )

        resp = self.client.post(USER_CREATE, {
            'username': 'username',
            'password': 'password',
            'email': 'test1@gmail.com'
        })

        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_creating_multiple_users_with_same_email(self):
        '''Test creating multiple users with the same email is ok'''

        user = get_user_model().objects.create_user(
            username='username1',
            password='testpassword1',
            email='test@gmail.com'
        )

        resp = self.client.post(USER_CREATE, {
            'username': 'username',
            'password': 'password',
            'email': 'test@gmail.com'
        })

        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_creating_multiple_users_with_same_password(self):
        '''Test creating multiple users with the same password works'''

        user = get_user_model().objects.create_user(
            username='username',
            password='testpassword',
            email='test@gmail.com'
        )

        resp = self.client.post(USER_CREATE, {
            'username': 'username1',
            'password': 'password',
            'email': 'test@gmail.com'
        })

        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_self_page(self):
        '''Test unauthenticated user can't access 'self' page'''
        resp = self.client.get(USER_SELF)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_user_user_page(self):
        '''Test unauthenticated user can't access 'user' page'''
        resp = self.client.get(USERS)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_user_specific_user_page(self):
        '''Test unauthenticated users can't access 'user' detail page'''
        url = get_user(1)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateUserTest(TestCase):
    '''Write login tests and test the authorization'''

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='username',
            password='testpassword',
            email='test@gmail.com'
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_authenticated_user_access_self(self):
        '''Test that user can access self page'''
        url = USER_SELF
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual('username', resp.data['username'])

    def test_authenticated_user_access_user(self):
        'Test that user can access other users page'
        user2 = get_user_model().objects.create_user(
            username='username2',
            email='email',
            password='pass'
        )

        url = get_user(user2.id)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_authenticated_user_partial_update_self(self):
        '''Test that user can partial update self'''
        resp = self.client.patch(USER_SELF, {'username': 'new_user'})

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['username'], 'new_user')
        self.assertEqual(self.user.username, 'new_user')

    def test_authenticated_user_adding_bio(self):
        '''Test user can add bio'''
        payload = {'bio': "this is my bio"}
        resp = self.client.patch(USER_SELF, payload)

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['bio'], payload['bio'])

    def test_user_cannot_create_in_self(self):
        '''Test user cannot create a new user in self'''
        payload = {
            'username': 'username2',
            'email': 'email@gmail.com',
            'password': 'password',

        }
        resp = self.client.post(USER_SELF, payload, format='multipart')

        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_user_can_delete_self(self):
        '''Test user can delete itself'''
        resp = self.client.delete(USER_SELF)

        user = get_user_model().objects.filter(username=self.user.username).exists()
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(user)

    def test_user_can_add_profile_img(self):
        '''Test user can add profile image'''
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'image': ntf
            }

            resp = self.client.patch(USER_SELF, payload)
        self.assertTrue(os.path.exists(self.user.image.path))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_user_cannot_modify_other_users_profile(self):
        '''Test user cannot partially modify other user profile'''
        user2 = get_user_model().objects.create_user(
            username='username2',
            email='email',
            password='pass'
        )
        resp = self.client.patch(get_user(user2.id), {'username': 'username'})
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_fully_modify_other_users_profile(self):
        '''Test user cannot fully modify other user profile'''
        user2 = get_user_model().objects.create_user(
            username='username2',
            email='email',
            password='pass'
        )

        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)
            payload = {
                'username': 'new_username',
                'password': 'new_password',
                'email': 'new_email@gmail.com',
                'image': ntf
            }
            resp = self.client.put(
                get_user(user2.id), payload, format='multipart')

        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_delete_other_users_profile(self):
        '''Test user cannot delete other user profiles'''
        user2 = get_user_model().objects.create_user(
            username='username2',
            email='email',
            password='pass'
        )

        resp = self.client.delete(get_user(user2.id))
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_username_filter(self):
        '''Test specific users can be retrieved using username filter'''
        user2 = get_user_model().objects.create_user(
            username='username2',
            email='email',
            password='pass'
        )
        resp = self.client.get(USERS, {'username': user2.username})

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data[0]['username'], user2.username)
