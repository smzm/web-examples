from django.contrib import admin
from .models import (TradePosition,
                    Review,
                    Message,
                    Analysis,
                    TrendAnalysis,
                    HarmonicPatterns,
                    # ChartPatterns,
                    # TechnicalIndicators,
                    # WaveAnalysis
                    )


class ClassInline(admin.TabularInline):
   model = Analysis
@admin.register(TradePosition)
class TradePositionAdmin(admin.ModelAdmin):
    inlines = [ClassInline,]

# @admin.register(HarmonicPatterns)
# class HarmonicPatternAdmin(admin.ModelAdmin):
#     form = HarmonicPatternsForm

admin.site.register(Review)
admin.site.register(Message)
admin.site.register(Analysis)
admin.site.register(TrendAnalysis)
admin.site.register(HarmonicPatterns)
# admin.site.register(ChartPatterns)
# admin.site.register(TechnicalIndicators)
# admin.site.register(WaveAnalysis)
