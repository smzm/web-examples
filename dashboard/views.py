from django.http import request
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from .forms import NewTradeForm, ReviewForm
from .models import TradePosition, Review
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from users.models import Profile
from .utils import searchTrade, paginateTrades


sidebar = {
    'dashboard': '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zM4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z"></path></svg>',
    'strategy': '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="m2.295 12.707 8.978 9c.389.39 1.025.391 1.414.002l9.021-9a1 1 0 0 0 0-1.416l-9.021-9a.999.999 0 0 0-1.414.002l-8.978 9a.998.998 0 0 0 0 1.412zm6.707-2.706h5v-2l3 3-3 3v-2h-3v4h-2v-6z"></path></svg>',
    'history': '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path></svg>',
    'trades': '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 21c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14zM9.553 9.658l4 2 1.553-3.105 1.789.895-2.447 4.895-4-2-1.553 3.105-1.789-.895 2.447-4.895z"></path></svg>',
    'analysis': '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M6 21H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1z"></path></svg>',
}


@login_required(login_url="/login/")
def dashboard(request):
    profile = request.user.profile
    return render(request, 'dashboard/dashboard.html', {'sidebar': sidebar, 'profile': profile})


@login_required(login_url="/login/")
def trades(request):
    profile = request.user.profile   
    trades = profile.tradeposition_set.all().order_by('-date', '-time')
    search_query = ''   
    if request.GET.get('search_query'):
        trades, search_query = searchTrade(request)

    trades, custumRange = paginateTrades(request, trades, 5)        
    return render(request, 'dashboard/trades.html',  {'sidebar': sidebar, 'profile': profile, 'trades':trades, 'search_query':search_query, 'customRange':custumRange})


@login_required(login_url="/login/")
def newTrade(request):
    profile = request.user.profile
    trades = profile.tradeposition_set.all().order_by('-date', '-time')
    trade_form = NewTradeForm()
    if request.method == 'POST':
        trade_form = NewTradeForm(request.POST)
        if trade_form.is_valid():
            obj = TradePosition(owner=request.user.profile)
            obj.symbol = trade_form.cleaned_data['symbol']
            obj.date = trade_form.cleaned_data['date']
            obj.time = trade_form.cleaned_data['time']
            obj.price = trade_form.cleaned_data['price']
            obj.size = trade_form.cleaned_data['size']
            obj.side = trade_form.cleaned_data['side']
            # obj.leverage = trade_form.cleaned_data['leverage']
            obj.comment = trade_form.cleaned_data['comment']
            obj.save()



    return render(request, 'dashboard/newTrade/newTrade.html', {'sidebar': sidebar, 'tradeForm': trade_form, 'trades': trades, 'profile': profile})


@login_required(login_url="/login/")
def delete_trade(request, pk):
    trade = TradePosition.objects.get(id=pk)
    trade.delete()
    dynamicPath_newtrade = reverse('newtrade')
    return HttpResponseRedirect(dynamicPath_newtrade)


@login_required(login_url="/login/")
def update_trade(request, pk):
    profile = request.user.profile
    trade = profile.tradeposition_set.get(id=pk)
    reviews = trade.review_set.all().order_by('-created')

    trade_form = NewTradeForm({
        'symbol': trade.symbol,
        'price': trade.price,
        'date': trade.date,
        'time': trade.time,
        'size': trade.size,
        'side': trade.side,
        # 'leverage': trade.leverage,
        'comment': trade.comment})
    review_form = ReviewForm()

    if request.method == 'POST':
        if 'tradeForm' in request.POST:
            trade_form = NewTradeForm(request.POST)
            if trade_form.is_valid():
                trade.symbol = trade_form.cleaned_data['symbol']
                trade.date = trade_form.cleaned_data['date']
                trade.time = trade_form.cleaned_data['time']
                trade.price = trade_form.cleaned_data['price']
                trade.size = trade_form.cleaned_data['size']
                trade.side = trade_form.cleaned_data['side']
                # trade.leverage = trade_form.cleaned_data['leverage']
                trade.comment = trade_form.cleaned_data['comment']
                trade.save()
                dynamicPath_newtrade = reverse('newtrade')
                messages.success(request, 'Your trade position was updated.')
                return HttpResponseRedirect(dynamicPath_newtrade)

        elif 'reviewForm' in request.POST :
            review_form = ReviewForm(request.POST)
            review = review_form.save(commit=False)
            review.trade = trade
            review.owner = profile
            review.save()
            
    trade.calcualteEmotionRatio
    return render(request, 'dashboard/newTrade/detailTrade.html', {'sidebar': sidebar, 
                                                                   'trade': trade,
                                                                   'profile': profile,
                                                                   'tradeForm': trade_form,
                                                                   'reviewForm': review_form, 
                                                                   'reviews': reviews})


@login_required(login_url="/login/")
def history(request):
    profile = request.user.profile
    return render(request, 'dashboard/history.html',  {'sidebar': sidebar, 'profile': profile})
