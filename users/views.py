from django.http import request
from django.shortcuts import render
from .models import Profile

# Create your views here.


def profiles(request):
    # profile = Profile.objects.get(id=pk)
    # context = {'profile': profile}
    return render(request, 'users/profiles.html')
