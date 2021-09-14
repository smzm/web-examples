from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('', views.getRoutes ),
    path('trades/', views.getTrades),
    path('trade/<str:pk>/', views.getTrade),
    path('add/trade/', views.addTrade),
    path('user/', views.user, name='user'),
    path('login/', views.login_view, name='login'),
    path('refresh/token/', views.refresh_token_view, name="refreshToken")
    # path('users/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
