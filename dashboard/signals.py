from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import TradePosition, Analysis, HarmonicPatterns, TrendAnalysis

def auto_delete_trend_analysis(sender, instance, **kwargs):
    trend_analysis = instance.Trend_Analysis
    trend_analysis.delete()


def auto_delete_harmonic_pattern(sender, instance, **kwargs):
    trend_analysis = instance.Harmonic_Patterns
    trend_analysis.delete()


post_delete.connect(auto_delete_trend_analysis, sender=Analysis)
post_delete.connect(auto_delete_harmonic_pattern, sender=Analysis)
