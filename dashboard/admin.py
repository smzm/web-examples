from django.contrib import admin
from .models import TradePosition, Review, Analysis, TrendAnalysis, HarmonicPatterns, ChartPatterns, TechnicalIndicators, WaveAnalysis


# Register your models here.
admin.site.register(TradePosition)
admin.site.register(Review)
admin.site.register(Analysis)
admin.site.register(TrendAnalysis)
admin.site.register(HarmonicPatterns)
admin.site.register(ChartPatterns)
admin.site.register(TechnicalIndicators)
admin.site.register(WaveAnalysis)
