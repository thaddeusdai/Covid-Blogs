from django.urls import path, include

from rest_framework.routers import DefaultRouter

from knox import views as knox_views

from user import views


router = DefaultRouter()
router.register('user', views.UserViewSet)

app_name = 'user'

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.Login.as_view(), name='login'),
    path('self/', views.SelfUser.as_view(), name='self'),
    path('register/', views.Register.as_view(), name='register'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('forgotpassword/', views.ForgotPassword.as_view(), name='forgotpassword')

]
