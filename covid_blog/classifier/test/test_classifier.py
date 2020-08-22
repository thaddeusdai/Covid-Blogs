from django.test import TestCase
from django.urls import reverse

import tempfile
import os

from PIL import Image

from rest_framework.test import APIClient
from rest_framework import status
from core import models


URL = reverse("classifier:imageclassifier-list")


def get_img(id):
    return reverse("classifier:imageclassifier-detail", args=[id])


class ClassifierTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        with tempfile.NamedTemporaryFile(suffix='.jpg') as ntf:
            img = Image.new('RGB', (10, 10))
            img.save(ntf, format='JPEG')
            ntf.seek(0)

            payload = {
                'image': ntf
            }

            self.resp = self.client.post(URL, payload)
        self.image = models.ImageClassifier.objects.all()[0]

    def test_any_user_can_access_list(self):
        '''Test any user can use'''
        resp = self.client.get(URL)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_posting_an_image(self):
        '''Test posting an image'''
        self.assertEqual(self.resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(os.path.exists(self.image.image.path))

    def test_retrieving_an_image(self):
        '''Test getting an image'''
        resp = self.client.get(get_img(id=self.image.id))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_getting_upload_path(self):
        '''Test uploaded image is at the right place'''
        self.assertTrue(os.path.exists(self.image.image.path))

    def test_getting_classification(self):
        '''Test uploading an image returns classification'''
        self.assertTrue(len(self.resp.data['classification']), 1)
        self.assertIsNotNone(
            models.ImageClassifier.objects.get(id=self.image.id).classification)

    def test_deleting_an_image(self):
        '''test deleting an image'''
        image = models.ImageClassifier.objects.get(id=self.image.id)
        resp = self.client.delete(get_img(id=image.id))
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
