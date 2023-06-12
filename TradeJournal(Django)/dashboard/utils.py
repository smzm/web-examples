# --------- Search
from django.db.models import Q
from .models import TradePosition
def searchTrade(request):
    profile = request.user.profile
    search_query = request.GET.get('search_query')
    trades = profile.tradeposition_set.filter(symbol__icontains=search_query).order_by('-date', '-time')
    return trades, search_query


# --------- Pagination
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
def paginateTrades(request, trades, result):
    paginator = Paginator(trades, result)

    page = request.GET.get('page')
    try:
        trades = paginator.page(page)
    except PageNotAnInteger:
        page = 1
        trades = paginator.page(page)
    except EmptyPage:
        page = paginator.num_pages
        trades = paginator.page(page)
    
    leftIndex = (int(page) - 5)
    if leftIndex < 1 :
        leftIndex = 1
    
    rightIndex = (int(page) + 5)
    if rightIndex > paginator.num_pages : 
        rightIndex = paginator.num_pages + 1
  
    customRange = range(leftIndex, rightIndex)

    return trades, customRange   
