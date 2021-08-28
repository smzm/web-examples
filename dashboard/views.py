from django.http import request
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from .forms import NewTradeForm
from .models import TradePosition
from django.urls import reverse
from django.forms import ModelForm


def dashboard(request):
    return render(request, 'dashboard/dashboard.html')


def trades(request):
    return render(request, 'dashboard/trades.html')


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
    trades = TradePosition.objects.all().order_by('date', 'time').reverse()
    return render(request, 'dashboard/newTrade/newTrade.html', {'form': form, 'trades': trades})


def delete_trade(request, pk):
    trade = TradePosition.objects.get(id=pk)
    trade.delete()
    dynamicPath_newtrade = reverse('newtrade')
    return HttpResponseRedirect(dynamicPath_newtrade)


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
    # trades = TradePosition.objects.all().order_by('date', 'time').reverse()
    return render(request, 'dashboard/newTrade/detailTrade.html', {'form': form, 'trade': trade})


def history(request):
    return render(request, 'dashboard/history.html')
