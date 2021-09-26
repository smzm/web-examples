from django import forms
import datetime
from django.core.exceptions import ValidationError
from django.forms.widgets import DateTimeInput, Input, RadioSelect, Select, TextInput, Widget
import pytz
from .models import Message, Strategy, TradePosition


class NewTradeForm(forms.Form):
    symbol = forms.CharField(
        label='Symbol', max_length=200, required=True, strip=True, widget=forms.widgets.TextInput(attrs={
            'name': 'symbol', 'id':'SYMBOL', 'oninput': 'let p=this.selectionStart;this.value=this.value.toUpperCase();this.setSelectionRange(p, p);', 'spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
            'hx-post' : "/trade/trade_check_symbol_hx/", 'hx-trigger' : 'keyup changed delay:1000ms', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'}))

    date = forms.DateField(label="Date", widget=forms.widgets.DateInput(attrs={
        'name': 'date', 'id':'DATE', 'type': 'date',  'spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker p-2 m-2 text-gray-400 text-sm border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
        'hx-post' : "/trade/trade_check_risk_hx/", 'hx-trigger' : 'change delay:500ms', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'}), initial=datetime.date.today())

    time = forms.TimeField(label="Time", widget=forms.widgets.TimeInput(attrs={
        'name': 'time', 'type': 'time',  'spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker p-2 m-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200'}), initial=datetime.datetime.now(tz=pytz.timezone('Asia/Tehran')).time().strftime("%H:%M"))

    strategy = forms.ModelChoiceField(queryset=Strategy.objects.all(), widget=forms.widgets.Select(attrs={'id':"STRATEGY"}))

    price = forms.FloatField(widget=forms.widgets.NumberInput(attrs={
        'name': 'price', 'type':'number', 'min':'0','spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
        'onfocus':"cursor_at_end(this)", 'hx-post' : "/trade/trade_check_risk_hx/", 'hx-trigger' : 'keyup changed delay:2000ms, change', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'
        }))

    size = forms.FloatField(widget=forms.widgets.NumberInput(attrs={
        'name': 'size', "type":"number", "id":"SIZE", 'min':'0','spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200',
         'onfocus':"cursor_at_end(this)", 'hx-post' : "/trade/trade_check_risk_hx/", 'hx-trigger' : 'keyup changed delay:2000ms, change', 'hx-target' : '#FORM_CAONTAINER','hx-swap' : 'outerHTML'
        }))


    side = forms.CharField(required=False, initial='Long', widget=forms.widgets.TextInput(attrs={
        'name': 'side', 'id': 'SIDE', 'onclick': 'ChangeValueSide()', 'readonly': "readonly", 'class': 'leading-5 tracking-wider cursor-pointer bg-green-700 w-20 p-2 rounded-3xl text-center text-gray-200 outline-none '}))


    # leverage = forms.IntegerField(initial=1, widget=forms.widgets.NumberInput(attrs={
    #     'id': "slider", 'type': 'range', 'min': '1', 'max': '500', 'step': '1', 'oninput': "sliderChangeGet(this.value)", 'spellcheck': 'False', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200'}))

    comment = forms.CharField(required=False, label="comment", widget=forms.widgets.TextInput(attrs={
        'name': 'comment', 'class': 'text-center w-36 bg-color-darker m-2 p-2 text-gray-400 border-2 focus:border-blue-800 border-gray-700 border-opacity-60 rounded-3xl outline-none transition-all duration-200'}))

    def clean_date(self):
        date = self.cleaned_data['date']
        if date > datetime.date.today():
            raise ValidationError('Date cannot be in the future.')
        return date

    # def __init__(self, *args, **kwargs):
    #     super(NewTradeForm,self).__init__(*args, **kwargs)
    #     # for field in self.fields : 
    #     field = self.fields['strategy']
    #     new_data = {
    #         'placeholder' : f'TradePosition {str(field)}' ,
    #         'class' : 'bg-gray-100',
    #         'hx-post' : "/trade/add_hx/",
    #         'hx-trigger' : 'keyup changed delay:500ms',
    #         'hx-target' : '#FORM_CAONTAINER',
    #         'hx-swap' : 'outerHTML'
    #         }
    #     self.fields[str(field)].widget.attrs.update(new_data)



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

        for name, field in self.fields.items():
            field.widget.attrs.update({'class': 'border border-gray-300'})




class StrategyForm(forms.ModelForm):
    class Meta:
        model = Strategy
        fields = ['name', 'balance', 'risk_on_balance']
        
    def __init__(self, *args, **kwargs):
        super(StrategyForm, self).__init__(*args, **kwargs)

        for name , field in self.fields.items():
            field.widget.attrs.update({'class': 'border border-gray-300'})