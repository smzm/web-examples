from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from django.conf import settings
from .models import Profile


def createProfile(sender, instance, created, **kwargs):
    if created:
        user = instance
        profile = Profile.objects.create(
            user=user,
            username=user.username,
            email=user.email,
            name=user.first_name
        )


def deleteUser(sender, instance, **kwargs):
    user = instance.user
    user.delete()


def updateUser(sender, instance, created, **kwargs):
    profile = instance
    user = profile.user
    if not created : 
        user.first_name = profile.name
        user.username = profile.username
        user.email = profile.email
        user.save()
        

post_save.connect(createProfile, sender=settings.AUTH_USER_MODEL)
post_delete.connect(deleteUser, sender=Profile)
post_save.connect(updateUser, sender=Profile)