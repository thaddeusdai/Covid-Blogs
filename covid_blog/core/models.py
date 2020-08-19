from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
import pandas as pd
import numpy as np
import keras
import tensorflow as tf
from keras.preprocessing.image import img_to_array
from django.conf import settings
from keras.preprocessing import image
from tensorflow.keras.models import load_model
from tensorflow.python import ops
from PIL import Image
import os


def upload_path_user(instance, filename):
    return os.path.join('user/', filename)


def upload_path_classifier(instance, filename):
    return os.path.join('classifier', filename)


def upload_path_blog(instance, filename):
    return os.path.join('blog', filename)


class UserManager(BaseUserManager):

    def create_user(self, email=None, username=None, password=None, *args, **kwargs):
        if username is None:
            raise ValueError('Username is required')
        elif password is None:
            raise ValueError('Password is required')
        elif email is None:
            raise ValueError('Email is required')

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
        )
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password, *args, **kwargs):
        user = self.create_user(email, username, password, *args, **kwargs)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    image = models.ImageField(null=True, upload_to=upload_path_user)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    bio = models.CharField(max_length=255, null=True, blank=True)

    objects = UserManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ('email', 'password')

    def __str__(self):
        return f'{self.username}'


class Blog(models.Model):

    user = models.ForeignKey('User', on_delete=models.CASCADE)
    likes = models.IntegerField(default=0)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=10000)
    tags = models.ManyToManyField('Tag', blank=True)
    uploaded = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(null=True, upload_to=upload_path_blog)

    REQUIRED_FIELDS = ('title', 'content')

    def __str__(self):
        return f'{self.title} by {self.user}: {self.likes} likes'


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.name}'


class Comment(models.Model):
    content = models.CharField(max_length=100)
    replied = models.ForeignKey(
        'self', blank=True, null=True, on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    uploaded = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    blog = models.ForeignKey(
        "Blog", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.content}'


class ImageClassifier(models.Model):
    image = models.ImageField(upload_to=upload_path_classifier)
    classification = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Classification of this image: {self.classification}"

    def save(self, *args, **kwargs):
        loaded_img = Image.open(self.image)
        img = Image.Image.resize(loaded_img, (224, 224))
        img_array = np.array(img)/255
        final_img = img_array.reshape(1, 224, 224, 3)
        file_model = os.path.join(
            settings.BASE_DIR, 'ml_model/facemask.h5')
        model = load_model(file_model)
        pred = np.argmax(model.predict(final_img), axis=-1)
        if pred[0] == 1:
            self.classification = "Not Wearing Standard Facemask"
        else:
            self.classification = "Wearing Standard Facemask"

        super().save(*args, **kwargs)
