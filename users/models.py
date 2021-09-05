from django.db import models
from django.contrib.auth.models import User
import uuid


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(max_length=200, null=True, blank=True)
    username = models.CharField(max_length=200, blank=True, null=True)
    biography = models.TextField(max_length=500,blank=True, null=True)
    profile_image = models.ImageField(
        null=True, blank=True, upload_to='static/images/profiles/', default='images/profiles/default/default_profile.jpg')
    github_account = models.CharField(max_length=200, null=True, blank=True)
    twitter_account = models.CharField(max_length=200, null=True, blank=True)
    linkedin_account = models.CharField(max_length=200, null=True, blank=True)
    youtube_account = models.CharField(max_length=200, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    def __str__(self):
        return str(self.username)
