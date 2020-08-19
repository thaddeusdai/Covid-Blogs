from blog.permissions import OnlyAdminCanModify
from rest_framework import viewsets, permissions, mixins

from core.models import Blog, Tag, Comment
from blog.serializers import CommentSerializer, TagSerializer, ReadBlogSerializer, CreateBlogSerializer


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def params_get_ids(self, tags):
        return [int(i) for i in tags.split(',')]

    def get_queryset(self):
        queryset = self.queryset
        tag = self.request.query_params.get('tag', None)
        title = self.request.query_params.get('title', None)
        author = self.request.query_params.get('user', None)

        if author:
            queryset = queryset.filter(user__username=author)
        if tag:
            tag_id = self.params_get_ids(tag)
            queryset = queryset.filter(tags__id__in=tag_id)
        if title:
            queryset = queryset.filter(title=title)
        return queryset.order_by('-likes', '-id')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateBlogSerializer
        return ReadBlogSerializer


class TagViewSet(viewsets.GenericViewSet,
                 mixins.RetrieveModelMixin,
                 mixins.ListModelMixin):
    queryset = Tag.objects.all()
    permission_classes = (permissions.IsAuthenticated, OnlyAdminCanModify)
    serializer_class = TagSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = self.queryset
        parent = self.request.query_params.get("parent", None)
        blogcomment = self.request.query_params.get("blog", None)
        order = self.request.query_params.get('order', None)
        if parent:
            if parent == "-1":
                queryset = queryset.filter(replied__isnull=True)
            else:
                queryset = queryset.filter(
                    replied__id=parent)
        if blogcomment:
            queryset = queryset.filter(blog__id=blogcomment)

        if order:
            return queryset.order_by('-likes')
        return queryset.order_by('id')
