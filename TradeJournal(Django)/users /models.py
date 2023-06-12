from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    email = models.EmailField(unique=True)



class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(max_length=200, null=True, blank=True)
    username = models.CharField(max_length=200, blank=True, null=True)
    biography = models.TextField(max_length=200,blank=True, null=True)
    profile_image = models.ImageField(
        null=True, blank=True, upload_to='static/images/profiles/', default='static/images/profiles/default/default_profile.jpg')
    github_account = models.CharField(max_length=200, null=True, blank=True)
    twitter_account = models.CharField(max_length=200, null=True, blank=True)
    youtube_account = models.CharField(max_length=200, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    MEMBERSHIP_CHOICES = [
        ('B' , 'Bronze'),
        ('S', 'Silver'),
        ('G', 'Gold')
    ]
    # membership = models.CharField(max_length=1, choices=MEMBERSHIP_CHOICES, default='B')
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    def __str__(self):
        return str(self.username)


