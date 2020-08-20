from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication

from django.contrib.auth import get_user_model
from django.core.mail import send_mail

from knox.models import AuthToken

from user import serializers
from user.permissions import UpdateOwnStatus

import random


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer
    queryset = get_user_model().objects.all()
    permission_classes = (permissions.IsAuthenticated,
                          UpdateOwnStatus)

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        queryset = self.queryset
        if username:
            queryset = queryset.filter(username=username)
        return queryset


class SelfUser(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user


class Register(generics.GenericAPIView):
    serializer_class = serializers.RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user)[1]
        })


class Login(generics.GenericAPIView):
    serializer_class = serializers.LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        return Response({
            'user': serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user)[1]
        })


class ForgotPassword(generics.GenericAPIView):
    serializer_class = serializers.ForgotPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        temp_password = chr(random.randint(97, 123)) + chr(random.randint(97, 123))+chr(
            random.randint(97, 123))+chr(random.randint(97, 123)) + str(random.randint(1000, 1000000))
        user.set_password(temp_password)
        print(user)
        user.save()
        send_mail(f'Password for {user.username}', f'The new password for your account is {temp_password}. Please change your password once logged in to a password you can remember.',
                  'todoproject1234@gmail.com', [f'{user.email}'], fail_silently=False)
        return Response({'message': 'Email has been sent'})
