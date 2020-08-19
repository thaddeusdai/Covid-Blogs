from rest_framework import serializers
from core.models import ImageClassifier


class ImageClassifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageClassifier
        fields = ('id', 'image', 'classification')
