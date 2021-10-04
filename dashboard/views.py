from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from .forms import NewTradeForm, ReviewForm, MessageForm, StrategyForm
from .models import (
    Analysis,
    ChartPatterns,
    FundamentalAnalysis,
    Message,
    TechnicalIndicators,
    TradePosition,
    Review,
    TrendAnalysis,
    HarmonicPatterns,
    WaveAnalysis,
    Strategy
)
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from users.models import Profile
from .utils import searchTrade, paginateTrades
import calendar
import datetime
from dateutil.relativedelta import relativedelta



sidebar = {
    "dashboard": '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zM4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z"></path></svg>',
    "strategy": '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="m2.295 12.707 8.978 9c.389.39 1.025.391 1.414.002l9.021-9a1 1 0 0 0 0-1.416l-9.021-9a.999.999 0 0 0-1.414.002l-8.978 9a.998.998 0 0 0 0 1.412zm6.707-2.706h5v-2l3 3-3 3v-2h-3v4h-2v-6z"></path></svg>',
    "history": '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path></svg>',
    "trades": '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M19 21c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14zM9.553 9.658l4 2 1.553-3.105 1.789.895-2.447 4.895-4-2-1.553 3.105-1.789-.895 2.447-4.895z"></path></svg>',
    "analysis": '<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" style="transform: ;msFilter:;"><path d="M6 21H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1z"></path></svg>',
}



@login_required(login_url="/login/")
def dashboard(request):
    profile = request.user.profile
    all_msg = profile.messages.all()
    unread_count = all_msg.filter(is_read=False).count()
    return render( request, "dashboard/dashboard.html", {"sidebar": sidebar, "profile": profile, 'unread_count': unread_count})


@login_required(login_url="/login/")
def order_trades_hx(request):
    if request.htmx:
        page = request.GET.get('page')
        username = request.GET.get('username')
        if username and page=="profile": 
            profile = Profile.objects.get(username=username)
            trades = profile.tradeposition_set.filter(ispublic=True).order_by('-date', '-time')[:3]
        else :
            profile = request.user.profile
            trades = profile.tradeposition_set.all().order_by('-date', '-time')[:3]

        # There is Hardlink with this names inside lates_trade and dashboard Pages. dont change these name and functions
        _orderBy_ = request.GET.get('order_by')
        _lastOrder_ = request.GET.get('last')
        _toggle_ = request.GET.get('toggle')
        if _toggle_ == 'False' : 
            _toggle_ = False  
        else :
            _toggle_ = True
        # Order Last 3 trades by Symbol
        if _orderBy_ == "symbol" and not _lastOrder_ == "symbol" :
            _toggle_ = True
            trades = sorted(trades, key=lambda trade : trade.symbol, reverse=not _toggle_)
        elif _orderBy_=="symbol" and _lastOrder_=="symbol" : 
            trades = sorted(trades, key=lambda trade : trade.symbol, reverse=not _toggle_) 
        # Order Last 3 trades by Date and Time
        if _orderBy_ == "datetime" and not _lastOrder_ == "datetime" :
            _toggle_ = True
            trades = sorted(trades, key=lambda trade : (trade.date, trade.time), reverse=_toggle_)
        elif _orderBy_ == "datetime" and _lastOrder_=="datetime"  : 
            trades = sorted(trades, key=lambda trade : (trade.date, trade.time), reverse=_toggle_)
        # Order Last 3 trades by Size
        if _orderBy_ == "size" and not _lastOrder_ == "size":
            _toggle_ = True
            trades = sorted(trades, key=lambda trade : trade.size, reverse=_toggle_)
        elif _orderBy_ == "size" and _lastOrder_ == "size":
            trades = sorted(trades, key=lambda trade : trade.size, reverse=_toggle_)
        _toggle_ = not _toggle_
    return render( request, "dashboard/trade/include/latest_trade.html", {'profile':profile, 'trades': trades, 'order_by':_orderBy_, 'toggle':_toggle_, 'page':page})





# ================================================ Strategy
@login_required(login_url="/login/")
def strategy(request):
    profile = request.user.profile
    strategies = profile.strategy_set.all()
    strategy_form = StrategyForm()
    context = {"sidebar": sidebar, "profile": profile, "strategies":strategies ,"strategyForm": strategy_form}       
    if request.method == "POST" : 
        strategy_form = StrategyForm(request.POST)
        if strategy_form.is_valid():
            strategy = strategy_form.save(commit=False)
            strategy.owner = profile
            strategy.save()        
    return render(request, "dashboard/strategy/strategy.html", context)





@login_required(login_url="/login/")
def strategy_edit(request, strategy_id):
    profile = request.user.profile
    strategies = profile.strategy_set.all()
    strategy = profile.strategy_set.get(id=strategy_id)
    context = { "sidebar": sidebar, "profile": profile, "strategies":strategies, 'strategy' : strategy }
    return render(request, 'dashboard/strategy/strategy_edit.html', context)


# ================================================ History
@login_required(login_url="/login/")
def history(request):   
    profile = request.user.profile
    today = datetime.date.today()
    year = today.year                   # Year of today
    month_num = today.month             # Month of today
    month_str = today.strftime('%B')    # Month of today in letters
    next_month_str = (datetime.date.today() + relativedelta(months=1)).strftime('%B')
    previous_month_str = (datetime.date.today() - relativedelta(months=1)).strftime('%B')
    day_num = today.day                 # Day of Today

    days_of_month = calendar.monthcalendar(year, month_num)

    weekdays_list = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    weekdays_list = weekdays_list * len(days_of_month)

    weekday = {}
    for i in range(0,len(days_of_month)):  
        weekday[f'date.weekday_{i+1}'] = zip([ j for j in days_of_month[i] if days_of_month[i]], weekdays_list)


    date = {'year': year,
            'month': month_str,
            'month_num': month_num,
            'day_num' : day_num,
            'today': today,
            'weeks' : weekday,
            'number_of_weeks' : len(days_of_month),
            'next_month_str' : next_month_str, 
            'previous_month_str': previous_month_str
            }


    filters = {'trades': True}
    trades_inforamtion = None
    if request.htmx : 
        if request.POST : 
            enable_filter = request.POST.get('filters')
            filters = {'enable_filter': enable_filter}
            if enable_filter == 'trades' : 
                monthly_trades = profile.tradeposition_set.filter(date__year=year, date__month=month_num).order_by("-date",'-time').values_list('id','date','symbol')        # Get all trade of this month
                trades_days = []
                trades_id = []
                trades_symbol = []
                for index in range(0,len(monthly_trades)) : 
                    trade = monthly_trades[index]
                    trade_id = trade[0]
                    trade_day = trade[1].day
                    trade_symbol = trade[2]
                    trades_id.append(trade_id)          # All trade id for this month
                    trades_days.append(trade_day)       # All days user has trade 
                    trades_symbol.append(trade_symbol)  # All symbol trades in this month
                trades_inforamtion = {'days': trades_days, 'id': trades_id, 'symbol':trades_symbol}   

    time = range(0,24)
    return render(request, "dashboard//history/history.html", { "sidebar": sidebar,
                                                                "profile": profile,
                                                                "date": date,
                                                                "trades_info": trades_inforamtion,
                                                                'time' : time,
                                                                'filters': filters 
                                                               })


@login_required(login_url="/login/")
def change_month(request, change):
    profile = request.user.profile
    if request.htmx : 
        data_year = int(request.POST.get('data-year'))
        data_month = int(request.POST.get('data-month'))
        data_day = int(request.POST.get('data-day'))

        today = datetime.date.today()
        if change == "Next" :
            new_date = datetime.date(data_year, data_month, data_day) + relativedelta(months=1)
        elif change == "Previous" :
            new_date = datetime.date(data_year, data_month, data_day) - relativedelta(months=1)     

        year = new_date.year
        month_num = new_date.month
        month_str = new_date.strftime('%B')
        day_num = new_date.day

        next_month_str = (datetime.date(year, month_num, day_num) + relativedelta(months=1)).strftime('%B')
        previous_month_str = (datetime.date(year, month_num, day_num) - relativedelta(months=1)).strftime('%B')

        days_of_month = calendar.monthcalendar(year, month_num)

        weekdays_list = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
        weekdays_list = weekdays_list * len(days_of_month)

        weekday = {}
        for i in range(0,len(days_of_month)):  
            weekday[f'date.weekday_{i+1}'] = zip([ j for j in days_of_month[i] if days_of_month[i]], weekdays_list)

        # day_of_week, month_range = calendar.monthrange(year, month_num)      # day_of_week : after many day month begins     month_range: how many days month have
        

        date = {'year': year,
            'month': month_str,
            'month_num': month_num,
            'day_num' : day_num,
            'today': today,
            'weeks' : weekday,
            'number_of_weeks' : len(days_of_month),
            'next_month_str' : next_month_str, 
            'previous_month_str': previous_month_str
        }

        monthly_trades = profile.tradeposition_set.filter(date__year=year, 
                                                      date__month=month_num).order_by("-date",'-time').values_list('id','date','symbol')
        trades_days = []
        trades_id = []
        trades_symbol = []
        for index in range(0,len(monthly_trades)) : 
            trade = monthly_trades[index]
            trade_id = trade[0]
            trade_day = trade[1].day
            trade_symbol = trade[2]
            trades_id.append(trade_id)
            trades_days.append(trade_day)
            trades_symbol.append(trade_symbol)
        trades_inforamtion = {'days': trades_days, 'id': trades_id, 'symbol':trades_symbol}   
        return render(request, 'dashboard/history/calendar.html', {'date':date, "trades_info": trades_inforamtion} )




@login_required(login_url="/login/")
def filter_by_date(request, date):
    profile = request.user.profile
    time = range(0,24)
    day, month, year = date.split('-')
    trades = profile.tradeposition_set.filter(date__year=year, 
                                              date__month=month,
                                              date__day=day).order_by("-date",'-time')

    event=[]
    trades_hour=[]
    trades_minutes=[]
    trades_symbol=[]
    trades_price=[]
    trades_side=[]
    for trade in trades : 
        event.append(trade.time.hour)
        trades_hour.append(trade.time.hour)
        trades_minutes.append(trade.time.minute)
        trades_symbol.append(trade.symbol)
        trades_price.append(trade.price)
        trades_side.append(trade.side)
    
    trades_timeline = zip(trades_hour, trades_minutes,trades_symbol, trades_price, trades_side)
    return render(request, 'dashboard/history/history_timeline.html', {'time':time, 'event': event,'trades':trades, 'trades_timeline':trades_timeline, 'day':day, 'month':month, 'year':year})




# ================================================ Trade
@login_required(login_url="/login/")
def trades(request):
    profile = request.user.profile
    trades = profile.tradeposition_set.all().order_by("-date", "-time")
    trades, customRange = paginateTrades(request, trades, 5)
    context = {
        "sidebar": sidebar,
        "profile": profile,
        "trades": trades,
        "customRange": customRange,
    }
    return render(request, "dashboard/trade/trades.html", context)





@login_required(login_url="/login/")
def trade_detail(request, trade_pk):
    profile = request.user.profile
    trade_edit_state = 1
    trade = profile.tradeposition_set.get(id=trade_pk)
    trade_form = NewTradeForm(instance=trade, profile=profile)
    review_form = ReviewForm()
    reviews = trade.review_set.all().order_by("-created")
    trade.calcualteEmotionRatio
    all_msg = trade.msg.all()
    msg_count = all_msg.count()
    latest_msg = all_msg.last()
    msg_details = {"all_msg": all_msg,
                   "msg_count": msg_count, "latest_msg": latest_msg}
    context = {
        "sidebar": sidebar,
        "profile": profile,
        "trade": trade,
        "tradeForm": trade_form,
        "reviews": reviews,
        "reviewForm": review_form,
        "msg_details": msg_details,
        'trade_edit_state' : trade_edit_state 
    }
    return render(request, "dashboard/trade/detail_trade.html", context)

     


@login_required(login_url="/login/")
def trade_add(request):
    trade_edit_state = 0
    profile = request.user.profile
    trade_form = NewTradeForm(profile=profile)
    context = {
        "sidebar": sidebar,
        "profile": profile,
        "tradeForm": trade_form,
        "trade_edit_state": trade_edit_state,
    }
    if request.method == "POST":
        selected_trend_analysis = request.POST.getlist("trend_analysis")
        selected_harmonic_patterns = request.POST.getlist("harmonic_patterns")
        selected_chart_patterns = request.POST.getlist("chart_patterns")
        selected_technical_indicators = request.POST.getlist("technical_indicators")
        selected_wave_analysis = request.POST.getlist("wave_analysis")
        selected_fundamental_analysis = request.POST.getlist("fundamental_analysis")

        trade_form = NewTradeForm(request.POST, profile=profile)
        if trade_form.is_valid():
            new_trade = trade_form.save(commit=False)
            new_trade.owner = request.user.profile
            new_trade.save() 
            analysis = Analysis(
                owner=profile,
                trade=new_trade,
            )
            if selected_trend_analysis :
                trend_analysis = TrendAnalysis(value=selected_trend_analysis)
                trend_analysis.save()
                analysis.Trend_Analysis = trend_analysis
            if selected_harmonic_patterns :
                harmonic_patterns = HarmonicPatterns(value=selected_harmonic_patterns)
                harmonic_patterns.save()
                analysis.Harmonic_Patterns = harmonic_patterns
            if selected_chart_patterns :
                chart_patterns = ChartPatterns(value=selected_chart_patterns)
                chart_patterns.save()
                analysis.Chart_Patterns = chart_patterns
            if selected_technical_indicators :
                technical_indicators = TechnicalIndicators(value=selected_technical_indicators)
                technical_indicators.save()
                analysis.Technical_Indicators = technical_indicators
            if selected_wave_analysis :
                wave_analysis = WaveAnalysis(value=selected_wave_analysis)
                wave_analysis.save()
                analysis.Wave_Analysis = wave_analysis
            if selected_fundamental_analysis :
                fundamental_analysis = FundamentalAnalysis(value=selected_fundamental_analysis)
                fundamental_analysis.save()
                analysis.Fundamental_Analysis = fundamental_analysis
            analysis.save()
            new_trade.analysis = analysis

            trades = TradePosition.objects.filter(strategy=new_trade.strategy)
            if new_trade.strategy : 
                new_trade.strategy_calculation(trades)

            messages.success(request, "Your trade position was updated.")            
            return redirect("trade_detail", new_trade.id)
        else : 
            return render(request, "dashboard/trade/add_trade.html", context)        

    return render(request, "dashboard/trade/add_trade.html", context)






@login_required(login_url="/login/")
def trade_edit(request, trade_pk):
    trade_edit_state = 1
    profile = request.user.profile
    trade = profile.tradeposition_set.get(id=trade_pk)
    if request.method == "POST":
        trade_form = NewTradeForm(request.POST, profile=profile, instance=trade)
        selected_trend_analysis = request.POST.getlist("trend_analysis")
        selected_harmonic_patterns = request.POST.getlist("harmonic_patterns")
        selected_chart_patterns = request.POST.getlist("chart_patterns")
        selected_technical_indicators = request.POST.getlist("technical_indicators")
        selected_wave_analysis = request.POST.getlist("wave_analysis")
        selected_fundamental_analysis = request.POST.getlist("fundamental_analysis")
        if trade_form.is_valid():
            trade_form.save()
            trade.analysis.delete()
            analysis = Analysis(
                owner=profile,
                trade=trade,
            )

            if selected_trend_analysis :
                trend_analysis = TrendAnalysis(value=selected_trend_analysis)
                trend_analysis.save()
                analysis.Trend_Analysis = trend_analysis
            if selected_harmonic_patterns :
                harmonic_patterns = HarmonicPatterns(value=selected_harmonic_patterns)
                harmonic_patterns.save()
                analysis.Harmonic_Patterns = harmonic_patterns
            if selected_chart_patterns :
                chart_patterns = ChartPatterns(value=selected_chart_patterns)
                chart_patterns.save()
                analysis.Chart_Patterns = chart_patterns
            if selected_technical_indicators :
                technical_indicators = TechnicalIndicators(value=selected_technical_indicators)
                technical_indicators.save()
                analysis.Technical_Indicators = technical_indicators
            if selected_wave_analysis :
                wave_analysis = WaveAnalysis(value=selected_wave_analysis)
                wave_analysis.save()
                analysis.Wave_Analysis = wave_analysis
            if selected_fundamental_analysis :
                fundamental_analysis = FundamentalAnalysis(value=selected_fundamental_analysis)
                fundamental_analysis.save()
                analysis.Fundamental_Analysis = fundamental_analysis
            
            analysis.save()
            trade.analysis = analysis
            
            if trade.strategy : 
                trades = TradePosition.objects.filter(strategy=trade.strategy)
                trade.strategy_calculation(trades)

            messages.success(request, "Your trade position was updated.")
            return render(request, "dashboard/trade/include/trade_info.html", {"trade": trade})
    return render(request, "dashboard/trade/include/trade_form.html", {"tradeForm": trade_form, "trade_edit_state": trade_edit_state})



@login_required(login_url="/login/")
def trade_delete(request, trade_pk):
    trade = TradePosition.objects.get(id=trade_pk)
    trade.delete()
    if trade.strategy : 
        trades = TradePosition.objects.filter(strategy=trade.strategy)
        trade.strategy_calculation(trades or None)
    dynamicPath_newtrade = reverse("trades")
    return HttpResponseRedirect(dynamicPath_newtrade)




@login_required(login_url="/login/")
def trade_check_hx(request):
    profile = request.user.profile
    trade_form = NewTradeForm(request.POST, profile=profile)
    trade_edit_state = int(request.POST['trade_edit_state'])
    context = {
        "tradeForm": trade_form,
        "trade_edit_state" : trade_edit_state
    }
    if request.htmx : 
        price = float(request.POST.get('price') or 0)
        strategy_id = request.POST.get('strategy')
        try : 
            strategy = Strategy.objects.get(id=(strategy_id or None))
            strategy.calculate_value_risk_balance              
        except Strategy.DoesNotExist :             
            strategy = False
        size = float(request.POST.get('size') or 0)
        stoploss = float(request.POST.get('stoploss') or 0)

        if trade_edit_state : 
            trade_id = request.POST['trade_id'] 
            trade = profile.tradeposition_set.get(id=trade_id)
            trade.strategyAlert = []
            context['trade'] = trade

        # Check Strategy Risk On Balance
        if strategy and price:
            if size :
                if (price * size) > strategy.value_risk_balance:
                    context['risk_balance_alert'] = "Risk on balance is over"
                    if trade_edit_state :
                        trade.strategyAlert.append('risk_on_balance')
                else : 
                    if trade_edit_state and ('risk_on_balance' in trade.strategyAlert) :
                        trade.strategyAlert.remove('risk_on_balance')

            # Check Strategy Risk On position
            if stoploss:
                if abs(price - stoploss) >= strategy.new_position_risk :
                    context['risk_position_alert'] = "Risk on position is over"
                    if trade_edit_state :
                        trade.strategyAlert.append('risk_on_position')
                else : 
                    if trade_edit_state and ('risk_on_position' in trade.strategyAlert) :
                        trade.strategyAlert = trade.strategyAlert.remove('risk_on_position')


            if trade_edit_state : 
                trade.save()          

    return render(request, "dashboard/trade/include/trade_form.html", context)





# ================================================ Trade -> Review
@login_required(login_url="/login/")
def review_add_hx(request, trade_pk):
    if request.htmx:
        review_edit_state = 0
        profile = request.user.profile
        trade = profile.tradeposition_set.get(id=trade_pk)
        reviews = trade.review_set.all().order_by("-created")
        review_form = ReviewForm()
        if request.method == "POST":
            review_form = ReviewForm(request.POST)
            if review_form.is_valid():
                review = Review(
                    owner=profile,
                    trade=trade,
                    emotion=request.POST.get("emotion"),
                    body=review_form.cleaned_data["body"],
                )
                review.save()
                trade.calcualteEmotionRatio
                return render(
                    request,
                    "dashboard/trade/review/review_sidebar.html",
                    {"reviews": reviews, "trade": trade},
                )
            else : 
                return HttpResponse("Wrong data")    
    return render(
        request,
        "dashboard/trade/review/review_form.html",
        {
            "reviewForm": review_form,
            "trade": trade,
            "review_edit_state": review_edit_state,
        },
    )





@login_required(login_url="/login/")
def review_update_form_hx(request, review_pk):
    if request.htmx:
        review_edit_state = 1
        profile = request.user.profile
        review = profile.review_set.get(id=review_pk)
        review_form = ReviewForm(
            {"emotion": review.emotion, "body": review.body})
        trade_id = review.trade_id
        trade = profile.tradeposition_set.get(id=trade_id)
        reviews = trade.review_set.all().order_by("-created")
    return render(
        request,
        "dashboard/trade/review/review_form.html",
        {
            "reviewForm": review_form,
            "review": review,
            "review_edit_state": review_edit_state,
            "trade": trade,
        },
    )





@login_required(login_url="/login/")
def review_update_sidebar_hx(request, review_pk):
    profile = request.user.profile
    review = profile.review_set.get(id=review_pk)
    trade_id = review.trade_id
    trade = profile.tradeposition_set.get(id=trade_id)
    reviews = trade.review_set.all().order_by("-created")
    if request.htmx:
        if request.method == "POST":
            review_hx = ReviewForm(request.POST)
            if review_hx.is_valid():
                review.emotion = request.POST.get("emotion")
                review.body = review_hx.cleaned_data["body"]
                review.save()
                reviews = trade.review_set.all().order_by("-created")
                trade.calcualteEmotionRatio
    return render(
        request,
        "dashboard/trade/review/review_sidebar.html",
        {"reviews": reviews, "trade": trade},
    )




@login_required(login_url="/login/")
def review_delete_hx(request, review_pk):
    if request.htmx:
        profile = request.user.profile
        review = profile.review_set.get(id=review_pk)
        trade_id = review.trade_id
        trade = profile.tradeposition_set.get(id=trade_id)
        reviews = trade.review_set.all().order_by("-created")
        review.delete()
        trade.calcualteEmotionRatio
        return render(
            request,
            "dashboard/trade/review/review_sidebar.html",
            {"reviews": reviews, "trade": trade},
        )




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
    msg_details = {"all_msg": all_msg,
                   "msg_count": msg_count, "message": message
                   }
    context = {
        "sidebar": sidebar,
        "profile": profile,
        "trade": trade,
        "msg_details": msg_details,
    }
    return render(request, "dashboard/trade/inbox.html", context)




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
    msg_details = {
        "all_msg": all_msg,
        "msg_count": msg_count,
    }
    context = {
        "sidebar": sidebar,
        "profile": profile,
        "trades": trades,
        "msg_details": msg_details,
    }
    return render(request, "dashboard/trade/inbox.html", context)




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
            return redirect("profile", username=username)
    context = {"profile": profile, "trade": trade, "form": form}
    return render(request, "dashboard/trade/message/message_form.html", context)





# ================================================ Trade -> Search
@login_required(login_url="/login/")
def search_trade_hx(request):
    profile = request.user.profile
    if request.htmx:
        search_query = request.GET.get("search_query")
        continuous = False
        if search_query:
            querysets = (
                profile.tradeposition_set.all()
                .filter(symbol__icontains=search_query)
                .order_by("-date", "-time")
            )
            if querysets.count() > 2:
                querysets = querysets[:2]
                continuous = True
        else:
            querysets = None

        context = {"querysets": querysets, "continuous": continuous}
        template = "search/results.html"
    return render(request, template, context)





@login_required(login_url="/login/")
def search_trade(request):
    profile = request.user.profile
    trades = profile.tradeposition_set.all().order_by("-date", "-time")
    search_query = ""
    if request.GET.get("search_query"):
        trades, search_query = searchTrade(request)
    trades, custumRange = paginateTrades(request, trades, 5)
    return render(request, "dashboard/trade/trades.html",
        {
            "sidebar": sidebar,
            "profile": profile,
            "trades": trades,
            "search_query": search_query,
            "customRange": custumRange,
        },
    )