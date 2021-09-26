from django.contrib import admin
from .models import (TradePosition,
                    Review,
                    Message,
                    Analysis,
                    TrendAnalysis,
                    HarmonicPatterns,
                    ChartPatterns,
                    TechnicalIndicators,
                    WaveAnalysis,
                    FundamentalAnalysis
                    )


class ClassInline(admin.TabularInline):
   model = Analysis
@admin.register(TradePosition)
class TradePositionAdmin(admin.ModelAdmin):
    inlines = [ClassInline,]


admin.site.register(Review)
admin.site.register(Message)
admin.site.register(Analysis)
admin.site.register(TrendAnalysis)
admin.site.register(HarmonicPatterns)
admin.site.register(ChartPatterns)
admin.site.register(TechnicalIndicators)
admin.site.register(WaveAnalysis)
admin.site.register(FundamentalAnalysis)
