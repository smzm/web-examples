import uuid
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from users.models import Profile
from datetime import date


class TradePosition(models.Model):
    owner = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.SET_NULL)
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    symbol = models.CharField(max_length=200)
    price = models.FloatField(validators=[MinValueValidator(0)])
    size = models.FloatField(validators=[MinValueValidator(0)])
    side = models.CharField(max_length=200)
    # leverage = models.IntegerField(
    #     default=1, validators=[MinValueValidator(1), MaxValueValidator(500)])
    comment = models.TextField(max_length=1000, null=True, blank=True)
    strategy = models.ForeignKey('Strategy',null=True,blank=True, on_delete=models.SET_NULL, related_name="trade")

    date = models.DateField()    #validators=[MaxValueValidator(limit_value=date.today)]
    time = models.TimeField()

    def __str__(self):
        return self.symbol
    
    @property
    def calcualteEmotionRatio(self):
        reviews = self.review_set.all()
        total_reviews = reviews.count()
        self.total_reviews = total_reviews
        try :
            number_of_happy = reviews.filter(emotion='happy').count()
            self.happy_ratio = round((number_of_happy / (total_reviews)) * 100, 1)
            number_of_sad = reviews.filter(emotion='sad').count()
            self.sad_ratio = round((number_of_sad / (total_reviews)) * 100, 1)
            number_of_hope = reviews.filter(emotion='hope').count()
            self.hope_ratio = round((number_of_hope / (total_reviews)) * 100, 1)
            number_of_stress = reviews.filter(emotion='stress').count()
            self.stress_ratio = round((number_of_stress / (total_reviews)) * 100, 1)
            number_of_calm = reviews.filter(emotion='calm').count()
            self.calm_ratio = round((number_of_calm / (total_reviews)) * 100, 1)
            number_of_fear = reviews.filter(emotion='fear').count()
            self.fear_ratio = round((number_of_fear / (total_reviews)) * 100, 1)
            self.save()
        except ZeroDivisionError:
            self.happy_ratio = 0
            self.sad_ratio = 0
            self.hope_ratio = 0
            self.stress_ratio = 0
            self.calm_ratio = 0
            self.fear_ratio = 0
            self.save()



class TrendAnalysis(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    # Trend_Analysis = (("Support_And_Resistance", "Support And Resistance"),
    #                   ("Supply_and_Demand", "Supply and Demand"),
    #                   ("Pivot_Points", "Pivot Points"),
    #                   ("Fibonacci", "Fibonacci"),
    #                   ("Trend_Lines", "Trend Lines"),
    #                   ("Candlestick_Analysis", "Candlestick Analysis"),
    #                   ("Multiple_Time_Frame_Analysis", "Multiple_Time_Frame_Analysis"),
    #                   ("Fractals", "Fractals"),
    #                   ("Cycles", "Cycles")
    #                   )

    value = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.value




class HarmonicPatterns(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    # Harmonic_Patterns = (
    #     ("ABCD", "ABCD"),
    #     ("Three_Drives", "Three Drives"),
    #     ("Gartley", "Gartley"),
    #     ("Bat", "Bat"),
    #     ("Butterfly", "Butterfly"),
    #     ("Crab", "Crab"),
    #     ("Cypher", "Cypher"),
    #     ("Five_Zero", "Five_Zero"),
    #     ("Shark", "Shark"),
    # )
    value = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.value




class ChartPatterns(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    # Chart_Patterns = (
    #     ("Double_Top_or_Bottom", "Double Top or Bottom"),
    #     ("Head_and_Shoulders", "Head and Shoulders"),
    #     ("Cup_and_Handle", "Cup and Handle"),
    #     ("Flag", "Flag"),
    #     ("Rectangle", "Rectangle"),
    #     ("Parallel_Channel", "Parallel Channel"),
    #     ("Pitchforks", "Pitchforks"),
    #     ("Triangle", "Triangle"),
    #     ("Gan", "Gan"),
    # )
    value = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.value




class TechnicalIndicators(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    # Technical_Indicators = (
    #     ("Oscilators", "Oscilators"),
    #     ("Volatility", "Volatility"),
    #     ("Volume", "Volume"),
    #     ("Moving_Average", "Moving Average"),
    #     ("Bill_Wiliams", "Bill Wiliams"),
    # )
    value = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.value




class WaveAnalysis(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    # Wave_Analysis = (
    #     ("Neo_Wave", "Neo Wave"),
    #     ("Sine_Wave", "Sine Wave"),
    #     ("Wolfe_Wave", "Wolfe Wave"),
    # )
    value = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.value





class FundamentalAnalysis(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    value = models.CharField(max_length=1000, null=True, blank=True)
    
    def __str__(self):
        return self.value




class Analysis(models.Model):
    owner = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.SET_NULL)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)
    trade = models.OneToOneField(TradePosition, on_delete=models.CASCADE, related_name="analysis")
    Trend_Analysis = models.OneToOneField(TrendAnalysis, on_delete=models.SET_NULL, null=True, blank=True, related_name="trend_analysis")
    Harmonic_Patterns = models.OneToOneField(HarmonicPatterns, on_delete=models.SET_NULL, null=True, blank=True, related_name="harmonic_patterns")
    Chart_Patterns = models.OneToOneField("ChartPatterns",on_delete=models.SET_NULL, null=True, blank=True, related_name="chart_patterns")
    Technical_Indicators = models.OneToOneField("TechnicalIndicators", on_delete=models.SET_NULL, null=True, blank=True, related_name="technical_indicators")
    Wave_Analysis = models.OneToOneField("WaveAnalysis", on_delete=models.SET_NULL, null=True, blank=True, related_name="wave_analysis")
    Fundamental_Analysis = models.OneToOneField("FundamentalAnalysis", on_delete=models.SET_NULL, null=True, blank=True, related_name="fundamental_analysis")

    def __str__(self):
        analysis_list = []
        if self.Trend_Analysis :
            analysis_list.append('Trend_Analysis') 
        if self.Harmonic_Patterns:
            analysis_list.append('Harmonic_Patterns')
        if self.Chart_Patterns:
            analysis_list.append('Chart_Patterns')
        if self.Technical_Indicators:
            analysis_list.append('Technical_Indicators')
        if self.Wave_Analysis:
            analysis_list.append('Wave_Analysis')            
        if self.Fundamental_Analysis:
            analysis_list.append('Fundamental_Analysis')            

        return f'{analysis_list}'




class Review(models.Model):
    emotion_type = (('fear', 'Fear'),
                    ('hope', 'Hope'),
                    ('stress', 'Stress'),
                    ('calm', 'Calm'),
                    ('happy', 'Happy'),
                    ('sad', 'Sad'))
    emotion = models.CharField(max_length=200, choices=emotion_type)
    trade = models.ForeignKey(TradePosition, null=True,
                              blank=True, on_delete=models.CASCADE)
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    body = models.TextField(max_length=1000, null=True)
    created = models.DateTimeField(auto_now_add=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    def __str__(self):
        return self.body



class Message(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE)
    recipient = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='messages')
    trade = models.ForeignKey(TradePosition, on_delete=models.CASCADE, related_name="msg")
    body = models.TextField(max_length=1000)
    is_read = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)
    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.sender.name



class Strategy(models.Model):
    owner = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.SET_NULL)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    balance = models.FloatField(validators=[MinValueValidator(0)], null=True)
    risk_on_balance = models.PositiveIntegerField(validators=[MaxValueValidator(100)], null=True)
    value_risk = models.FloatField(null=True)

    def value_risk_on_balance(self):
        value_risk_on_balance = float((self.risk_on_balance / 100) * self.balance)
        return value_risk_on_balance

    def save(self, *args, **kwargs):
        self.value_risk = self.value_risk_on_balance()
        super(Strategy, self).save(*args, **kwargs)

    def __str__(self):
        return self.name