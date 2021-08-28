from django.urls import path, include
from . import views


urlpatterns = [
    path('dashboard/', views.dashboard, name="dashboard"),
    path('newtrade/', views.newTrade, name="newtrade"),
    path('history/', views.history, name="history"),
    path('trades/', views.trades, name="trades"),
    path('trades/delete/<str:pk>/', views.delete_trade, name="delete_trade"),
    path('trade/<str:pk>/', views.update_trade, name="update_trade"),

]
