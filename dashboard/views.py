from django.http import request
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from .forms import NewTradeForm
from .models import TradePosition
from django.urls import reverse
from django.forms import ModelForm
from django.contrib.auth.decorators import login_required


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
    return render(request, 'dashboard/trades.html',  {'sidebar': sidebar, 'profile': profile})


@login_required(login_url="/login/")
def newTrade(request):
    if request.method == 'POST':
        form = NewTradeForm(request.POST)
        if form.is_valid():
            obj = TradePosition()
            obj.symbol = form.cleaned_data['symbol']
            obj.date = form.cleaned_data['date']
            obj.time = form.cleaned_data['time']
            obj.price = form.cleaned_data['price']
            obj.size = form.cleaned_data['size']
            obj.side = form.cleaned_data['side']
            obj.leverage = form.cleaned_data['leverage']
            obj.comment = form.cleaned_data['comment']
            obj.save()
    else:
        form = NewTradeForm()
    profile = request.user.profile
    trades = TradePosition.objects.all().order_by('date', 'time').reverse()
    return render(request, 'dashboard/newTrade/newTrade.html', {'sidebar': sidebar, 'form': form, 'trades': trades, 'profile': profile})


@login_required(login_url="/login/")
def delete_trade(request, pk):
    trade = TradePosition.objects.get(id=pk)
    trade.delete()
    dynamicPath_newtrade = reverse('newtrade')
    return HttpResponseRedirect(dynamicPath_newtrade)


@login_required(login_url="/login/")
def update_trade(request, pk):
    trade = TradePosition.objects.get(id=pk)
    form = NewTradeForm({
        'symbol': trade.symbol,
        'price': trade.price,
        'date': trade.date,
        'time': trade.time,
        'size': trade.size,
        'side': trade.side,
        'leverage': trade.leverage,
        'comment': trade.comment})

    if request.method == 'POST':
        form = NewTradeForm(request.POST)
        if form.is_valid():
            trade.symbol = form.cleaned_data['symbol']
            trade.date = form.cleaned_data['date']
            trade.time = form.cleaned_data['time']
            trade.price = form.cleaned_data['price']
            trade.size = form.cleaned_data['size']
            trade.side = form.cleaned_data['side']
            trade.leverage = form.cleaned_data['leverage']
            trade.comment = form.cleaned_data['comment']
            trade.save()
            dynamicPath_newtrade = reverse('newtrade')
            return HttpResponseRedirect(dynamicPath_newtrade)
    profile = request.user.profile
    # trades = TradePosition.objects.all().order_by('date', 'time').reverse()
    return render(request, 'dashboard/newTrade/detailTrade.html', {'sidebar': sidebar, 'form': form, 'trade': trade, 'profile': profile})


@login_required(login_url="/login/")
def history(request):
    profile = request.user.profile
    return render(request, 'dashboard/history.html',  {'sidebar': sidebar, 'profile': profile})
