from django.urls import path, include
from . import views


urlpatterns = [
    path('dashboard/', views.dashboard, name="dashboard"),
    path('history/', views.history, name="history"),
    path('trades/', views.trades, name="trades"),
    path('strategy/', views.dashboard, name="strategy"),
    path('analysis/', views.dashboard, name="analysis"),

    path('trade/detail/<str:trade_pk>/', views.trade_detail, name="trade_detail"),
    path('trade/add/', views.trade_add, name="trade_add"),
    path('trade/edit/<str:trade_pk>/', views.trade_edit, name="trade_edit"),
    path('trades/delete/<str:trade_pk>/', views.trade_delete, name="trade_delete"),
    
    path('trade/review/add/<str:trade_pk>/', views.review_add_hx, name="review_add_hx"),
    path('trade/review/update/<str:review_pk>/', views.review_update_form_hx, name="review_update_form_hx"),
    path('trade/review/edit/<str:review_pk>/', views.review_update_sidebar_hx, name="review_update_sidebar_hx"),
    path('trade/review/delete/<str:review_pk>/', views.review_delete_hx, name="review_delete_hx"),
    
    path('trade/inbox/<str:msg_pk>/', views.trade_inbox, name="trade_inbox"),
    path('trades/inbox/', views.trades_inbox, name="trades_inbox"),
    path('@<str:username>/message/<str:trade_pk>/', views.trade_message, name="trade_message"),
    
    path('search/trade_hx/', views.search_trade_hx, name='search_trade_hx'),
    path('search/trade/', views.search_trade, name='search_trade')

    ]
