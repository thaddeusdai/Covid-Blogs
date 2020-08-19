from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import ImageClassifierViewSet


router = DefaultRouter()
router.register('classifier', ImageClassifierViewSet)

app_name = 'classifier'

urlpatterns = [
    path('', include(router.urls)),
]
