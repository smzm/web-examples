from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from .models import Profile
from .forms import CustomUserCreationForm, ProfileForm
from django.contrib.auth.decorators import login_required

# Create your views here.


login_required(login_url="/login/")
def profile(request, username):
    profile = Profile.objects.get(username=username)   
    public_trades = profile.tradeposition_set.all().order_by('-date', '-time')
    context = {'profile': profile, 'public_trades': public_trades}
    return render(request, 'users/profiles.html', context)

def editProfile(request):
    profile = request.user.profile
    form = ProfileForm(instance=profile)
    
    if request.method == "POST" :     
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            return redirect(f'/@{profile.username}')

    context = {'form':form}
    return render(request, 'users/editProfile.html', context)


def registerUser(request):
    form = CustomUserCreationForm()
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            # commit=False : create user but dont create an instance of it
            user = form.save(commit=False)
            # make all username lowercase to don't dupplicate
            user.username = user.username.lower()
            user.save()

            messages.success(request, 'User account was created.')
            login(request, user)
            return redirect('/dashboard')
        else:
            messages.error(request, 'An error has occurred.')

    return render(request, 'users/login_register.html', {'page': 'register', 'form': form})


def loginUser(request):
    if request.user.is_authenticated:
        return redirect('/dashboard')

    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        try:
            user = User.objects.get(username=username)
        except:
            messages.error(request, 'Username does not exist.')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(request.GET['next'] if 'next' in request.GET else 'dashboard')
        else:
            messages.error(request, 'Username or password is incorrect.')

    return render(request, 'users/login_register.html', {'page': 'login'})


def logoutUser(request):
    logout(request)
    return redirect('login')


