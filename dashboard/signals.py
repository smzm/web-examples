from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Strategy, TradePosition, Analysis, HarmonicPatterns, TrendAnalysis


def auto_delete_trend_analysis(sender, instance, **kwargs):
    if instance.Trend_Analysis:
        trend_analysis = instance.Trend_Analysis
        trend_analysis.delete()

def auto_delete_harmonic_pattern(sender, instance, **kwargs):
    if instance.Harmonic_Patterns : 
        trend_analysis = instance.Harmonic_Patterns
        trend_analysis.delete()

def auto_delete_chart_patterns(sender, instance, **kwargs):
    if instance.Chart_Patterns : 
        chart_patterns = instance.Chart_Patterns
        chart_patterns.delete()

def auto_delete_technical_indicators(sender, instance, **kwargs):
    if instance.Technical_Indicators : 
        technical_indicators = instance.Technical_Indicators
        technical_indicators.delete()        

def auto_delete_wave_analysis(sender, instance, **kwargs):
    if instance.Wave_Analysis : 
        wave_analysis = instance.Wave_Analysis
        wave_analysis.delete()

def auto_delete_fundamental_analysis(sender, instance, **kwargs):
    if instance.Fundamental_Analysis : 
        fundamental_analysis = instance.Fundamental_Analysis
        fundamental_analysis.delete()


post_delete.connect(auto_delete_trend_analysis, sender=Analysis)
post_delete.connect(auto_delete_harmonic_pattern, sender=Analysis)
post_delete.connect(auto_delete_chart_patterns, sender=Analysis)
post_delete.connect(auto_delete_technical_indicators, sender=Analysis)
post_delete.connect(auto_delete_wave_analysis, sender=Analysis)
post_delete.connect(auto_delete_fundamental_analysis, sender=Analysis)
