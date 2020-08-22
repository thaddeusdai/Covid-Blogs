from rest_framework import serializers

from core.models import Blog, Tag, Comment, ImageClassifier, User


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')


class CommentBlogSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = Blog
        fields = ('id',)


class RepliedSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(default=None)

    class Meta:
        model = Comment
        fields = ('id',)


class CommentSerializer(serializers.ModelSerializer):
    user = AuthorSerializer(read_only=True)
    blog = CommentBlogSerializer()
    replied = RepliedSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'content', 'replied', 'uploaded',
                  'likes', 'user', 'blog')
        extra_kwargs = {'uploaded': {'read_only': True}, }

    def create(self, validated_data):
        blog_id = validated_data['blog']['id']
        validated_data['blog'] = Blog.objects.get(
            id=blog_id)
        replied_id = validated_data['replied']['id']
        if replied_id and replied_id != -1:
            validated_data['replied'] = Comment.objects.get(id=replied_id)
        else:
            validated_data['replied'] = None
        comment = Comment.objects.create(**validated_data)
        return comment


class BlogSerializer(serializers.ModelSerializer):
    user = AuthorSerializer(read_only=True)

    class Meta:
        model = Blog
        fields = ('id', 'title', 'content',
                  'tags', 'likes',  'uploaded', 'user', 'image')
        read_only_fields = ('uploaded', 'user')


class CreateBlogSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=100)
    content = serializers.CharField(max_length=10000)
    tags = serializers.ListField(write_only=True, required=False, default=[])
    image = serializers.ImageField(required=False)

    def create(self, validated_data):
        print(validated_data)
        if len(validated_data['tags']) > 0 and validated_data['tags'] != [',']:
            tags = validated_data['tags'][0].split(',')
        else:
            tags = []
        validated_data.pop('tags')
        blog = Blog.objects.create(**validated_data)
        for i in tags:
            tag = Tag.objects.filter(name=i).first()
            blog.tags.add(tag)
        print(blog)
        return blog


class ReadBlogSerializer(BlogSerializer):
    tags = TagSerializer(many=True, read_only=True)
