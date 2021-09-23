from django.http import request
from django.http import response
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from .forms import NewTradeForm, ReviewForm, MessageForm
from .models import Message, TradePosition, Review
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
def history(request):
    profile = request.user.profile
    return render(request, 'dashboard/history.html',  {'sidebar': sidebar, 'profile': profile})




# ================================================ Trade 
@login_required(login_url="/login/")
def trades(request):
    profile = request.user.profile   
    trades = profile.tradeposition_set.all().order_by('-date', '-time')
    trades, custumRange = paginateTrades(request, trades, 5)   

    context = {'sidebar': sidebar,
               'profile': profile,
               'trades': trades, 
               'customRange': custumRange}
    return render(request, 'dashboard/trades.html',  context)




@login_required(login_url="/login/")
def trade_detail(request, trade_pk):
    profile = request.user.profile
    trade = profile.tradeposition_set.get(id=trade_pk)
    trade_form = NewTradeForm({
            'symbol': trade.symbol,
            'price': trade.price,
            'date': trade.date,
            'time': trade.time,
            'size': trade.size,
            'side': trade.side,
            # 'leverage': trade.leverage,
            'comment': trade.comment}
    )
    review_form = ReviewForm()
    reviews = trade.review_set.all().order_by('-created')
    trade.calcualteEmotionRatio
    all_msg = trade.msg.all()
    msg_count = all_msg.count()
    latest_msg = all_msg.last()
    msg_details = {'all_msg': all_msg,
                   'msg_count': msg_count,
                   'latest_msg': latest_msg}
        
    context = {'sidebar': sidebar,
               'profile': profile,
               'trade': trade,
               'tradeForm' : trade_form,
               'reviews' : reviews,
               'reviewForm' : review_form,
               'msg_details': msg_details
               }
    return render(request, 'dashboard/trade/detail_trade.html', context)




@login_required(login_url="/login/")
def trade_add(request):
    trade_edit_state = 0
    profile = request.user.profile
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
            messages.success(request, 'Your trade position was updated.')

    context = {'sidebar':sidebar,
                'profile':profile,
                'tradeForm': trade_form,
                'trade_edit_state': trade_edit_state
        }


    return render(request, 'dashboard/trade/add_trade.html',context)




@login_required(login_url="/login/")
def trade_edit(request, trade_pk):
    trade_edit_state = 1
    profile = request.user.profile
    trade = profile.tradeposition_set.get(id=trade_pk)


    if request.method == 'POST':
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
                messages.success(request, 'Your trade position was updated.')
                return render(request, 'dashboard/trade/include/trade_info.html',{'trade' : trade} )
    return render(request, 'dashboard/trade/include/trade_form.html', {'tradeForm': trade_form, 'trade_edit_state': trade_edit_state})




@login_required(login_url="/login/")
def trade_delete(request, trade_pk):
    trade = TradePosition.objects.get(id=trade_pk)
    trade.delete()
    dynamicPath_newtrade = reverse('trades')
    return HttpResponseRedirect(dynamicPath_newtrade)



# ================================================ Trade -> Review
@login_required(login_url="/login/")
def review_add_hx(request, trade_pk):
    if request.htmx :
        review_edit_state = 0
        profile = request.user.profile
        trade = profile.tradeposition_set.get(id=trade_pk)
        reviews = trade.review_set.all().order_by('-created')
        review_form = ReviewForm()   
        if request.method == "POST": 
            review_form = ReviewForm(request.POST)
            if review_form.is_valid():
                review = Review(owner=profile,
                                trade=trade,
                                emotion=request.POST.get('emotion'),
                                body=review_form.cleaned_data['body']
                                )
                review.save()
                trade.calcualteEmotionRatio
                return render(request, 'dashboard/trade/review/review_sidebar.html', {"reviews": reviews, "trade": trade})

    return render(request, 'dashboard/trade/review/review_form.html', {'reviewForm': review_form, 'trade': trade, 'review_edit_state': review_edit_state})



@login_required(login_url="/login/")
def review_update_form_hx(request, review_pk):
    if request.htmx : 
        review_edit_state = 1
        profile = request.user.profile
        review = profile.review_set.get(id=review_pk) 
        review_form = ReviewForm({
            'emotion' : review.emotion ,
            'body' :    review.body
        })
        print(review_form.data['emotion'])
        trade_id = review.trade_id
        trade = profile.tradeposition_set.get(id=trade_id)
        reviews = trade.review_set.all().order_by('-created')
    return render(request, 'dashboard/trade/review/review_form.html', {'reviewForm': review_form, 'review': review, 'review_edit_state': review_edit_state, 'trade': trade})




@login_required(login_url="/login/")
def review_update_sidebar_hx(request, review_pk):
    profile = request.user.profile
    review = profile.review_set.get(id=review_pk) 
    trade_id = review.trade_id
    trade = profile.tradeposition_set.get(id=trade_id)
    reviews = trade.review_set.all().order_by('-created')
    if request.htmx : 
        if request.method == "POST" :
            review_hx = ReviewForm(request.POST)
            if review_hx.is_valid():
                review.emotion = request.POST.get('emotion')
                review.body = review_hx.cleaned_data['body']
                review.save()
                reviews = trade.review_set.all().order_by('-created')
                trade.calcualteEmotionRatio
    return render(request, 'dashboard/trade/review/review_sidebar.html', {"reviews": reviews, "trade": trade})




@login_required(login_url="/login/")
def review_delete_hx(request, review_pk):
    if request.htmx:
        profile = request.user.profile
        review = profile.review_set.get(id=review_pk)
        trade_id = review.trade_id
        trade = profile.tradeposition_set.get(id=trade_id)
        reviews = trade.review_set.all().order_by('-created')
        review.delete()
        trade.calcualteEmotionRatio
        return render(request, 'dashboard/trade/review/review_sidebar.html', {"reviews": reviews, "trade": trade})


# # ================================================ Trade -> Message
@login_required(login_url="/login/")
def trade_inbox(request, msg_pk):
    profile = request.user.profile
    message = profile.messages.get(id=msg_pk)
    if message.is_read == False:
        message.is_read = True
        message.save()
    trade = message.trade

    all_msg = trade.msg.all()
    msg_count = all_msg.count()

    msg_details = {'all_msg': all_msg,
                   'msg_count': msg_count,
                   'message': message
                    }

    context = {'sidebar':sidebar, 'profile':profile, 'trade':trade, 'msg_details':msg_details}
    return render(request, 'dashboard/inbox.html', context)


@login_required(login_url="/login/")
def trades_inbox(request):
    profile = request.user.profile
    trades = profile.tradeposition_set.all()
    all_msg = profile.messages.all()
    msg_count = all_msg.count()
    # unread_msg = all_msg.filter(is_read=False)
    # unread_count = unread_msg.count() 
    # read_msg = all_msg.filter(is_read=True)
    # read_count = read_msg.count()
    msg_details = {'all_msg': all_msg,
                   'msg_count': msg_count,
                    }

    context = { 'sidebar':sidebar, 'profile':profile, 'trades':trades, 'msg_details':msg_details}
    return render(request, 'dashboard/inbox.html', context)



def trade_message(request, username, trade_pk):
    profile = Profile.objects.get(username=username) 
    trade = profile.tradeposition_set.get(id=trade_pk)
    form = MessageForm()
    if request.method == "POST":
        form = MessageForm(request.POST)
        if form.is_valid():
            msg = form.save(commit=False)
            msg.sender = request.user.profile
            msg.recipient = profile
            msg.trade = trade
            msg.save()
            return redirect('profile', username=username)

    context = {'profile':profile, 'trade':trade, "form":form}
    return render(request, 'dashboard/trade/message/message_form.html', context)



# ================================================ Trade -> Search
@login_required(login_url="/login/")
def search_trade_hx(request):
    profile = request.user.profile
    if request.htmx : 
        search_query = request.GET.get('search_query')
        continuous = False
        if search_query : 
            querysets = profile.tradeposition_set.all().filter(symbol__icontains=search_query).order_by('-date', '-time')
            if querysets.count() > 2 : 
                querysets = querysets[:2]
                continuous = True
        else : 
            querysets = None
            

        context = { 'querysets' : querysets, 'continuous':continuous  }
        template = 'search/results.html'

    return render(request, template, context)


@login_required(login_url="/login/")
def search_trade(request):
    profile = request.user.profile
    trades = profile.tradeposition_set.all().order_by('-date', '-time')
    search_query = ''
    if request.GET.get('search_query'):
        trades, search_query = searchTrade(request)

    trades, custumRange = paginateTrades(request, trades, 5)

    return render(request, 'dashboard/trades.html',  {'sidebar': sidebar, 'profile': profile, 'trades': trades, 'search_query': search_query, 'customRange': custumRange})
