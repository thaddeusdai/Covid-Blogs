from rest_framework import viewsets, permissions

from core.models import ImageClassifier
from .serializers import ImageClassifierSerializer


class ImageClassifierViewSet(viewsets.ModelViewSet):
    queryset = ImageClassifier.objects.all()
    serializer_class = ImageClassifierSerializer
    permission_classes = (permissions.AllowAny,)
