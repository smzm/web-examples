from django.urls import path
from . import views


urlpatterns = [
    path('@<str:username>/', views.profile, name="profile"),
    path('register/', views.profile_register, name="register"),
    path('login/', views.profile_login, name="login"),
    path('logout/', views.profile_logout, name="logout"),
    path('edit-account/', views.profile_edit, name="profile_edit"),
]
