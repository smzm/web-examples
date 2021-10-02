from dashboard.models import Strategy
from django import forms
import datetime
from django.core.exceptions import ValidationError
from django.forms.widgets import DateTimeInput, Input, RadioSelect, Select, TextInput, Widget
import pytz
from .models import Message, Strategy, TradePosition

class NewTradeForm(forms.ModelForm): 
    class Meta : 
        model = TradePosition
        fields = ['symbol', 'date', 'time', 'side', 'strategy', 'price', 'size', 'leverage', 'takeprofit', 'stoploss', 'comment']


    symbol = forms.CharField(
        label='Symbol', max_length=200, required=True, strip=True, widget=forms.widgets.TextInput(attrs={
            'name': 'symbol', 'id':'SYMBOL', 'oninput': 'let p=this.selectionStart;this.value=this.value.toUpperCase();this.setSelectionRange(p, p);', 'spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
            'hx-post' : "/trade/trade_check_hx/", 'hx-trigger' : 'keyup changed delay:1000ms', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'}))


    date = forms.DateField(label="Date", widget=forms.widgets.DateInput(attrs={
        'name': 'date', 'id':'DATE', 'type': 'date',  'spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker p-2 m-2 text-gray-400 text-sm border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
        'hx-post' : "/trade/trade_check_hx/", 'hx-trigger' : 'change delay:500ms', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'}), initial=datetime.date.today())


    time = forms.TimeField(label="Time", widget=forms.widgets.TimeInput(attrs={
        'name': 'time', 'type': 'time', 'spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker p-2 m-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200'}), initial=datetime.datetime.now(tz=pytz.timezone('Asia/Tehran')).time().strftime("%H:%M"))


    # strategy = forms.ModelChoiceField(queryset=Strategy.objects.filter(owner=request.user.profile),required=False, widget=forms.widgets.Select(attrs={
    #     'id':"STRATEGY", 'hx-post' : "/trade/trade_check_hx/", 'hx-trigger' : 'change delay:500ms', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'}))

    price = forms.FloatField(widget=forms.widgets.NumberInput(attrs={
        'name': 'price', 'type':'number', 'min':'0','spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
        'onfocus':"cursor_at_end(this)", 'hx-post' : "/trade/trade_check_hx/", 'hx-trigger' : 'keyup changed delay:2000ms, change', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'
        }))


    size = forms.FloatField(widget=forms.widgets.NumberInput(attrs={
        'name': 'size', "type":"number", "id":"SIZE", 'min':'0','spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
        'onfocus':"cursor_at_end(this)", 'hx-post' : "/trade/trade_check_hx/", 'hx-trigger' : 'keyup changed delay:2000ms, change', 'hx-target' : '#FORM_CAONTAINER', 'hx-swap' : 'outerHTML'}))


    takeprofit = forms.FloatField(required=False, label="takeprofit",  widget=forms.widgets.NumberInput(attrs={
        'name': 'takeprofit', 'id':'TAKEPROFIT', 'type':'number', 'min':'0','spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
        'onfocus':"cursor_at_end(this)", 'hx-post' : "/trade/trade_check_hx/", 'hx-trigger' : 'keyup changed delay:2000ms, change', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'
        }))


    stoploss = forms.FloatField(required=False, widget=forms.widgets.NumberInput(attrs={
        'name': 'stoploss', 'id':'STOPLOSS', 'type':'number', 'min':'0','spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
        'onfocus':"cursor_at_end(this)", 'hx-post' : "/trade/trade_check_hx/", 'hx-trigger' : 'keyup changed delay:2000ms, change', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'
        }))    


    side = forms.CharField(required=False, initial='Long', widget=forms.widgets.TextInput(attrs={
        'hx-post' : "/trade/trade_check_hx/", 'hx-trigger' : 'click', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML', 'readonly': "readonly", 'name': 'side', 'id': 'SIDE', 'onclick': 'ChangeValueSide()', 'class': 'leading-5 tracking-wider cursor-pointer bg-green-700 w-20 p-2 rounded-3xl text-center text-gray-200 outline-none' }))


    leverage = forms.IntegerField(initial=1, widget=forms.widgets.NumberInput(attrs={
        'id': "leverage", 'type': 'number', 'min': '1', 'max': '1000', 'step': '1', 'spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
        # 'oninput': "sliderChangeGet(this.value)",
        }))


    comment = forms.CharField(required=False, label="comment", widget=forms.widgets.TextInput(attrs={
        'name': 'comment', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200'}))

    def __init__(self, *args, **kwargs):
        profile = kwargs.pop('profile','')
        super(NewTradeForm, self).__init__(*args, **kwargs)
        self.fields['strategy']=forms.ModelChoiceField(queryset=Strategy.objects.filter(owner=profile), required=False)
        strategy_data = {
            # 'placeholder' : f'TradePosition {str(strategy)}' ,
            'name': 'strategy',
            'id':'STRATEGY',
            'class' : "",
            'hx-post' : "/trade/trade_check_hx/",
            'hx-trigger' : 'change',
            'hx-target' : '#FORM_CAONTAINER',
            'hx-swap' : 'outerHTML'
            }
        self.fields['strategy'].widget.attrs.update(strategy_data)   


    def clean(self): 
        symbol = (self.cleaned_data.get('symbol') or '')
        date = self.cleaned_data.get('date')
        takeprofit = float(self.cleaned_data.get('takeprofit') or 0)
        stoploss = float(self.cleaned_data.get('stoploss') or 0)
        price = float(self.cleaned_data.get('price') or 0)
        side = self.cleaned_data.get('side')
        strategy = self.cleaned_data.get('strategy')

        if symbol.strip() == "" :
            self.add_error('symbol','Symbol cannot be empty.')

        if date > datetime.date.today():
            self.add_error('date', 'Date cannot be in the future.')    

        if strategy : 
            if takeprofit == 0 : 
                self.add_error('takeprofit','Takeprofit should input when you use strategy')
            if stoploss == 0 : 
                self.add_error('stoploss','Stoploss should input when you use strategy')

            if side == "Long" : 
                if takeprofit < price : 
                    self.add_error('takeprofit','Takeprofit should more than price in Long positions')
                elif stoploss > price :
                    self.add_error('stoploss','Stoploss should less than price in Long positions')

            elif side == "Short" : 
                if takeprofit > price :      
                    self.add_error('takeprofit', 'Takeprofit should less than price in Short positions')
                if stoploss < price :      
                    self.add_error('stoploss', 'Stoploss should more than price in Short positions')

        return self.cleaned_data




class ReviewForm(forms.Form):
    emotion_type = (('fear', 'Fear'),
                    ('hope', 'Hope'),
                    ('stress', 'Stress'),
                    ('calm', 'Calm'),
                    ('happy', 'Happy'),
                    ('sad','Sad'))

    emotion = forms.ChoiceField(
        label="Place your emotion about this trade", choices=emotion_type, widget=forms.widgets.RadioSelect(
            attrs={
                'id': 'EMOTION',
                'class':'border hover:text-red-500 inline'
                }))

    body = forms.CharField(required=False, label="Explain your Feelings : ",
                           widget=forms.widgets.TextInput(attrs={
                               'id': 'REVIEW_BODY',
                               'class': 'my-4 border-2 p-4'
                           }))




class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ['body']
        
    def __init__(self, *args, **kwargs):
        super(MessageForm, self).__init__(*args, **kwargs)

        for _ , field in self.fields.items():
            field.widget.attrs.update({'class': 'border border-gray-300'})




class StrategyForm(forms.ModelForm):
    class Meta:
        model = Strategy
        fields = ['name', 'balance', 'risk_balance', 'risk_position']
    
    risk_position = forms.FloatField(label="Risk Per Position",widget=forms.widgets.NumberInput(attrs={
        'name': 'risk_position', 'type':'number', 'min':'0', 'max': '100'}))    
        
    def __init__(self, *args, **kwargs):
        super(StrategyForm, self).__init__(*args, **kwargs)

        for _ , field in self.fields.items():
            field.widget.attrs.update({'class': 'border border-gray-300'})
        