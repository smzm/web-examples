from django.urls import path, include
from . import views


urlpatterns = [
    path('dashboard/', views.dashboard, name="dashboard"),
    path('newtrade/', views.newTrade, name="newtrade"),
    path('history/', views.history, name="history"),
    path('trades/', views.trades, name="trades"),
    path('strategy/', views.dashboard, name="strategy"),
    path('analysis/', views.dashboard, name="analysis"),
    path('trades/delete/<str:pk>/', views.delete_trade, name="delete_trade"),
    path('trade/<str:pk>/', views.update_trade, name="update_trade"),
    path('trade/review/<str:pk>/', views.edit_delete_review, name="edit_delete_review"),
    path('trade/inbox/<str:pk>/', views.inbox, name="inbox")

]
