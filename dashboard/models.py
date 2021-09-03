import uuid
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from users.models import Profile

# Create your models here.


class TradePosition(models.Model):
    owner = models.ForeignKey(Profile, null=True, blank=True, on_delete=models.SET_NULL)
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    symbol = models.CharField(max_length=200)
    price = models.FloatField(validators=[MinValueValidator(0)])
    side = models.CharField(max_length=200)
    size = models.FloatField(validators=[MinValueValidator(0)])
    # leverage = models.IntegerField(
    #     default=1, validators=[MinValueValidator(1), MaxValueValidator(500)])
    comment = models.TextField(max_length=1000, null=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    # analysis = models.ForeignKey(
    # "Analysis", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.symbol


class Analysis(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    Trend_Analysis = models.ManyToManyField("TrendAnalysis", blank=True)
    Harmonic_Patterns = models.ManyToManyField("HarmonicPatterns", blank=True)
    Chart_Patterns = models.ManyToManyField("ChartPatterns", blank=True)
    Technical_Indicators = models.ManyToManyField(
        "TechnicalIndicators", blank=True)
    WaveAnalysis = models.ManyToManyField("WaveAnalysis", blank=True)

    # Fundamental_Analysis = models.ManyToManyField("FundamentalAnalysis",
    #                                               blank=True,
    #                                               null=True)


class TrendAnalysis(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    Trend_Analysis = (("Support_And_Resistance", "Support And Resistance"),
                      ("Supply_and_Demand", "Supply and Demand"),
                      ("Pivot_Points", "Pivot Points"),
                      ("Fibonacci", "Fibonacci"),
                      ("Trend_Lines", "Trend Lines"),
                      ("Candlestick_Analysis", "Candlestick Analysis"),
                      ("Multiple_Time_Frame_Analysis",
                       "Multiple Time Frame Analysis"),
                      ("Fractals", "Fractals"),
                      ("Cycles", "Cycles"),
                      )

    value = models.CharField(max_length=200, choices=Trend_Analysis)

    def __str__(self):
        return self.value


class HarmonicPatterns(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    Harmonic_Patterns = (
        ("ABCD", "ABCD"),
        ("Three_Drives", "Three Drives"),
        ("Gartley", "Gartley"),
        ("Bat", "Bat"),
        ("Butterfly", "Butterfly"),
        ("Crab", "Crab"),
        ("Cypher", "Cypher"),
        ("Five_Zero", "Five_Zero"),
        ("Shark", "Shark"),
    )
    value = models.CharField(max_length=200, choices=Harmonic_Patterns)

    def __str__(self):
        return self.value


class ChartPatterns(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    Chart_Patterns = (
        ("Double_Top_or_Bottom", "Double Top or Bottom"),
        ("Head_and_Shoulders", "Head and Shoulders"),
        ("Cup_and_Handle", "Cup and Handle"),
        ("Flag", "Flag"),
        ("Rectangle", "Rectangle"),
        ("Parallel_Channel", "Parallel Channel"),
        ("Pitchforks", "Pitchforks"),
        ("Triangle", "Triangle"),
        ("Gan", "Gan"),
    )
    value = models.CharField(max_length=200, choices=Chart_Patterns)

    def __str__(self):
        return self.value


class TechnicalIndicators(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    Technical_Indicators = (
        ("Oscilators", "Oscilators"),
        ("Volatility", "Volatility"),
        ("Volume", "Volume"),
        ("Moving_Average", "Moving Average"),
        ("Bill_Wiliams", "Bill Wiliams"),
    )
    value = models.CharField(max_length=200, choices=Technical_Indicators)

    def __str__(self):
        return self.value


class WaveAnalysis(models.Model):
    id = models.UUIDField(default=uuid.uuid4,
                          unique=True,
                          primary_key=True,
                          editable=False)
    Wave_Analysis = (
        ("Neo_Wave", "Neo Wave"),
        ("Sine_Wave", "Sine Wave"),
        ("Wolfe_Wave", "Wolfe Wave"),
    )
    value = models.CharField(max_length=200, choices=Wave_Analysis)

    def __str__(self):
        return self.value

# class FundamentalAnalysis(models.Model):
#     id = models.UUIDField(default=uuid.uuid4,
#                           unique=True,
#                           primary_key=True,
#                           editable=False)
#     Fundamental = models.CharField(blank=True, null=True)


# class User(models.Model):
# id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
# first_name =
# last_name =
# username =
# email =
# is_active =
# def __str__(self):
#     return self.
