from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfileSerializer, TradeSerializer, AddTradeSerializer
from dashboard.models import TradePosition

import datetime

from api import serializers

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
@permission_classes([IsAuthenticated])
def getTrades(request):
    profile = request.user.profile
    trades = profile.tradeposition_set.all()
    serializer = TradeSerializer(trades, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTrade(request, pk):
    profile = request.user.profile
    trades = profile.tradeposition_set.get(id=pk)
    serializer = TradeSerializer(trades, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
    serializer = AddTradeSerializer(data=trade, many=False)
    serializer.set_the_owner(request)

    if serializer.is_valid():
        serializer.save()
        return Response({"success": True})
    else : 
        return Response(serializer.errors)

