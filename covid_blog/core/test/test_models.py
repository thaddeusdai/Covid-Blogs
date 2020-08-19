from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


class UserModelTest(TestCase):

    def test_creating_user_in_db(self):
        '''Tests created user is added to database'''
        user = get_user_model().objects.create(
            email='test@gmail.com',
            username='test_username',
            password='testpassword'
        )
        created = get_user_model().objects.get(username='test_username')
        self.assertTrue(created)

    def test_creating_user_successful(self):
        ''' Test creating an user is successful with proper attributes'''
        user = get_user_model().objects.create_user(
            email='test@gmail.com',
            username='test_username',
            password='testpassword'
        )

        self.assertEqual(user.email, 'test@gmail.com')
        self.assertTrue(user.check_password('testpassword'))
        self.assertEqual(user.username, 'test_username')

    def test_creating_user_normalize_email(self):
        ''' Test user email is normalized when created '''
        user = get_user_model().objects.create_user(
            email='test@GMAIL.com',
            username='test_username',
            password='testpassword'
        )
        self.assertEqual(user.email, 'test@gmail.com')

    def test_creating_user_with_missing_email_error(self):
        '''Test creating user with no email raises an error'''

        with self.assertRaises(ValueError):
            user = get_user_model().objects.create_user(
                username='test_username',
                password='testpassword',
                email=None
            )

    def test_creating_user_with_missing_username_error(self):
        '''Test creating user with no username raises an error'''
        with self.assertRaises(ValueError):
            user = get_user_model().objects.create_user(
                username=None,
                password='testpassword',
                email='test@gmail.com'
            )

    def test_creating_user_with_missing_password_error(self):
        '''Test creating user with no password raises an error'''
        with self.assertRaises(ValueError):
            user = get_user_model().objects.create_user(
                username='username',
                email='email@gmail.com',
                password=None
            )

    def test_creating_admin_user(self):
        '''Test creating admin user'''
        admin = get_user_model().objects.create_superuser(
            username='username',
            email='email@gmail.com',
            password='password'
        )
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)

    def test_creating_admin_user_missing_password(self):
        '''Test creating admin user with no password raises an error'''

        with self.assertRaises(ValueError):
            admin = get_user_model().objects.create_superuser(
                username='username',
                email='email@gmail.com',
                password=None
            )

    def test_creating_admin_user_missing_username(self):
        '''Test creating admin user with no username raises an error'''
        with self.assertRaises(ValueError):
            admin = get_user_model().objects.create_superuser(
                username=None,
                email='test@gmail.com',
                password='password'
            )

    def test_creating_admin_user_missing_email(self):
        '''Test creating admin user with no email raises an error'''
        with self.assertRaises(ValueError):
            admin = get_user_model().objects.create_superuser(
                username='username',
                email=None,
                password='password'
            )
