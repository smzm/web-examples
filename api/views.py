from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ProfileSerializer, TradeSerializer
from dashboard.models import TradePosition
from users.models import Profile
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import  authenticate
from rest_framework import exceptions
from .auth import generate_access_token, generate_refresh_token
from django.views.decorators.csrf import csrf_protect
import datetime
import jwt
from django.conf import settings


@api_view(['GET'])
def user(request):
    user = request.user
    serialized_user = ProfileSerializer(user).data
    return Response({'user': serialized_user })


@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    response = Response()
    if (username is None) or (password is None):
        raise exceptions.AuthenticationFailed(
            'username and password required')

    user = Profile.objects.get(username=username)
    # if(user is None):
    #     raise exceptions.AuthenticationFailed('user not found')
    # if (not user.check_password(password)):
    #     raise exceptions.AuthenticationFailed('wrong password')

    authenticated = authenticate(request, username=username, password=password)
    if authenticated : 
        serialized_user = ProfileSerializer(user, many=False).data
        access_token = generate_access_token(serialized_user)
        refresh_token = generate_refresh_token(serialized_user)

        response.set_cookie(key='refreshtoken', value=refresh_token, httponly=True)
        response.data = {
            'access_token': access_token,
            'user': serialized_user,
        }
        return response

    else :
        raise exceptions.AuthenticationFailed("username and password aren't correct")



@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_protect
def refresh_token_view(request):
    refresh_token = request.COOKIES.get('refreshtoken')
    if refresh_token is None:
        raise exceptions.AuthenticationFailed(
            'Authentication credentials were not provided.')
    try:
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed(
            'expired refresh token, please login again.')

    user = Profile.objects.get(id=payload.get('user_id'))
    if user is None:
        raise exceptions.AuthenticationFailed('User not found')

    # if not user.is_active:
    #     raise exceptions.AuthenticationFailed('user is inactive')

    access_token = generate_access_token(user)
    return Response({'access_token': access_token})



@api_view(['GET'])
def getRoutes(request):
    routes = [{
               'GET' : 'api/trades',
               'GET' : 'api/trade/id' ,
               'POST' : 'api/users/token',
               'POST' : 'api/users/token/refresh'
             }]
    return Response(routes)


@api_view(['GET'])
def getTrades(request):
    profile = request.user.profile
    trades = profile.tradeposition_set.all()
    serializer = TradeSerializer(trades, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def getTrade(request, pk):
    profile = request.user.profile
    trades = profile.tradeposition_set.get(id=pk)
    serializer = TradeSerializer(trades, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def addTrade(request):
    profile = request.user.profile
    data = request.data
    if 'date' not in data.keys():
        data['date'] = f'{datetime.datetime.now().date()}'
    if 'time' not in data.keys() :    
        data['time'] = f'{datetime.datetime.now().time()}'

    trade = {    
        "owner" : request.user.profile,
        "symbol" : data['symbol'],
        "price" : data['price'],
        "side" : data['side'],
        "size" : data['size'],
        "comment" : data['comment'],
        "date" : data['date'],
        "time" : data['time']
    }

    # trade.save()
    serializer = TradeSerializer(data=trade, many=False)
    serializer.set_the_owner(request)

    if serializer.is_valid():
        serializer.save()
        return Response({"success": True})
    else : 
        return Response(serializer.errors)

