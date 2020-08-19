from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate


class UserSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(
        write_only=True, style={'input_type': 'password'})

    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'image',
                  'password', 'bio', 'old_password')
        extra_kwargs = {
            'password': {'write_only': True,
                         'style': {'input_type': 'password'}}}

    def update(self, instance, validated_data):
        new_password = validated_data.pop('password', None)
        old_password = validated_data.pop('old_password', None)
        user = super().update(instance, validated_data)
        if old_password:
            if user.check_password(old_password):
                if new_password:
                    print(new_password, old_password, 'password fjdasklfj')
                    user.set_password(new_password)
                    user.save()
            else:
                raise serializers.ValidationError(
                    f'{username} Authentication Failed', code='authentication')
        return user


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password':
                        {
                            'write_only': True,
                            'style': {'input_type': 'password'}
                        }
                        }

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(trim_whitespace=False, style={
        'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(request=self.context.get('request'),
                            username=username, password=password)
        if user:
            attrs['user'] = user
            return attrs

        raise serializers.ValidationError(
            f'{username} Authentication Failed', code='authentication')


class ForgotPasswordSerializer(serializers.Serializer):
    username = serializers.CharField()

    def validate(self, attrs):
        print(attrs)
        username = attrs.get('username')
        user = get_user_model().objects.filter(username=username)
        if user:
            attrs['user'] = user[0]
            return attrs
        raise serializers.ValidationError('This username does not exists')
