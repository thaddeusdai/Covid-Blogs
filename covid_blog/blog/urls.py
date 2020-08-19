from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import BlogViewSet, TagViewSet, CommentViewSet


router = DefaultRouter()
router.register('blog', BlogViewSet)
router.register('comment', CommentViewSet)
router.register('tag', TagViewSet)

app_name = 'blogs'

urlpatterns = [
    path('', include(router.urls)),
]
