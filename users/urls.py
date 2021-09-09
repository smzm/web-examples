from django.urls import path
from . import views


urlpatterns = [
    path('register/', views.registerUser, name="register"),
    path('login/', views.loginUser, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('@<str:username>', views.profile, name="profile"),
    path('edit-account', views.editProfile, name="editProfile"),
]
