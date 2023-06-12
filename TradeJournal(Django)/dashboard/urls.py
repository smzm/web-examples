from django.urls import path, include
from . import views


urlpatterns = [
    path('dashboard/', views.dashboard, name="dashboard"),
    path('dashboard/latest_trades', views.order_trades_hx, name="order_trades_hx"),
    path('history/', views.history, name="history"),
    path('history/change_month/<str:change>', views.change_month, name="change_month"),
    path('history/date/<str:date>/', views.filter_by_date, name="filter_by_date"),   # Hard Link in calendar. don't change path url unless update all urls in Calendar

    path('strategy/', views.strategy, name="strategy"),
    path('strategy/detail/<str:strategy_id>', views.strategy_edit, name="strategy_edit"),

    path('analysis/', views.dashboard, name="analysis"),

    path('trades/', views.trades, name="trades"),
    path('trade/detail/<str:trade_pk>/', views.trade_detail, name="trade_detail"),
    path('trade/add/', views.trade_add, name="trade_add"),
    path('trade/edit/<str:trade_pk>/', views.trade_edit, name="trade_edit"),
    path('trades/delete/<str:trade_pk>/', views.trade_delete, name="trade_delete"),

    path('trade/trade_check_hx/', views.trade_check_hx, name="trade_check_hx"),  # Hard Link in form for size and price and ... field. don't change it unless update all urls

    path('trade/review/add/<str:trade_pk>/', views.review_add_hx, name="review_add_hx"),
    path('trade/review/update/<str:review_pk>/', views.review_update_form_hx, name="review_update_form_hx"),
    path('trade/review/edit/<str:review_pk>/', views.review_update_sidebar_hx, name="review_update_sidebar_hx"),
    path('trade/review/delete/<str:review_pk>/', views.review_delete_hx, name="review_delete_hx"),
    
    path('trade/inbox/<str:msg_pk>/', views.trade_inbox, name="trade_inbox"),
    path('trades/inbox/', views.trades_inbox, name="trades_inbox"),
    path('@<str:username>/message/<str:trade_pk>/', views.trade_message, name="trade_message"),
    
    path('search/trade_hx/', views.search_trade_hx, name='search_trade_hx'),
    path('search/trade/', views.search_trade, name='search_trade'),

    ]
