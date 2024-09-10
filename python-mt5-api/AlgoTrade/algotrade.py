import MetaTrader5 as mt5 
from datetime import datetime 
import numpy as np
import pandas as pd
import plotly.graph_objs as go
import time 
from rich.console import Console
console = Console()
from rich import print as rprint
from rich.table import Table
from rich.live import Live
from rich import box

if not mt5.initialize():
    print("initialize() failed, error code =",mt5.last_error())
    quit()
else : 
    ACCOUNT = mt5.account_info()
    LEVERAGE = mt5.account_info().leverage
    BALANCE = mt5.account_info().balance
    EQUITY = mt5.account_info().equity
    PROFIT = mt5.account_info().profit
    MARGIN = mt5.account_info().margin
    MARGIN_FREE = mt5.account_info().margin_free
    MARGIN_LEVEL = mt5.account_info().margin_level
    ME = mt5.account_info().name


class Symbol:
    
    def __init__(self, symbol:str):
        self.name = f'{symbol}'
        self.info = mt5.symbol_info(f'{symbol}')
        self.price = {'ask': mt5.symbol_info_tick(f'{symbol}').ask,
                      'bid': mt5.symbol_info_tick(f'{symbol}').bid} 
        self.orderN = mt5.orders_total()
        self.positionsN = mt5.positions_total()
        # self.EURUSD = mt5.symbol_info("EURUSD")
        # self.EURJPY = mt5.symbol_info("EURJPY")
        # self.EURGBP = mt5.symbol_info("EURGBP")
        # self.EURCHF = mt5.symbol_info("EURCHF")
        # self.EURCAD = mt5.symbol_info("EURCAD")
        # self.EURAUD = mt5.symbol_info("EURAUD")
        # self.GBPUSD = mt5.symbol_info("GBPUSD")
        # self.GBPJPY = mt5.symbol_info("GBPJPY")
        # self.GBPCHF = mt5.symbol_info("GBPCHF")
        # self.GBPCAD = mt5.symbol_info("GBPCAD")
        # self.GBPAUD = mt5.symbol_info("GBPAUD")
        # self.USDJPY = mt5.symbol_info("USDJPY")
        # self.USDCHF = mt5.symbol_info("USDCHF")
        # self.USDCAD = mt5.symbol_info("USDCAD")
        # self.AUDUSD = mt5.symbol_info("AUDUSD")
        # self.AUDJPY = mt5.symbol_info("AUDJPY")
        # self.AUDCAD = mt5.symbol_info("AUDCAD")
        # self.AUDCHF = mt5.symbol_info("AUDCHF")
        # self.AUDNZD = mt5.symbol_info("AUDNZD")
        # self.NZDJPY = mt5.symbol_info("NZDJPY")
        # self.NZDUSD = mt5.symbol_info("NZDUSD")
        # self.NZDCAD = mt5.symbol_info("NZDCAD")
        # self.NZDCHF = mt5.symbol_info("NZDCHF")
        # self.CHFJPY = mt5.symbol_info("CHFJPY")
        # self.CADJPY = mt5.symbol_info("CADJPY")
    
    def rates(self, from_date, to_date=datetime.now(), time_frame='H4'):
        match time_frame:
            case 'MN1' :
                timeframe = mt5.TIMEFRAME_MN1
            case 'W1':
                timeframe = mt5.TIMEFRAME_W1
            case 'D1':
                timeframe = mt5.TIMEFRAME_D1
            case 'M1':
                timeframe = mt5.TIMEFRAME_M1
            case 'H12' : 
                timeframe = mt5.TIMEFRAME_H12
            case 'H8' :
                timeframe = mt5.TIMEFRAME_H8
            case 'H6' : 
                timeframe = mt5.TIMEFRAME_H6
            case 'H4':
                timeframe = mt5.TIMEFRAME_H4
            case 'H3' : 
                timeframe = mt5.TIMEFRAME_H3
            case 'H2' : 
                timeframe = mt5.TIMEFRAME_H2
            case 'H1':
                timeframe = mt5.TIMEFRAME_H1
            case 'M30':
                timeframe = mt5.TIMEFRAME_M30
            case 'M20': 
                timeframe = mt5.TIMEFRAME_M20
            case 'M15':
                timeframe = mt5.TIMEFRAME_M15
            case 'M12': 
                timeframe = mt5.TIMEFRAME_M12
            case 'M10':
                timeframe = mt5.TIMEFRAME_M10
            case 'M6':
                timeframe = mt5.TIMEFRAME_M6
            case 'M5':
                timeframe = mt5.TIMEFRAME_M5
            case 'M4':
                timeframe = mt5.TIMEFRAME_M4
            case 'M3':
                timeframe = mt5.TIMEFRAME_M3
            case 'M2':
                timeframe = mt5.TIMEFRAME_M2
            case 'M1':
                timeframe = mt5.TIMEFRAME_M1
            case _ : 
                print("× : Invalid Time Frame")

        from_date = pd.to_datetime(f'{from_date}')
        to_date = pd.to_datetime(f'{to_date}')
        bars = mt5.copy_rates_range(self.name, timeframe, from_date, to_date) 
        rates = pd.DataFrame(bars)
        rates['time'] = pd.to_datetime(rates['time'], unit='s')

        return rates

    def chart(self, from_date, to_date=datetime.now(), time_frame='H4'):
        rates = self.rates(from_date, to_date, time_frame)
        fig = go.Figure(data=[go.Candlestick(x=rates['time'],
                                            open=rates['open'],
                                            high=rates['high'],
                                            low=rates['low'],
                                            close=rates['close'],
                                            increasing_line_color= 'white',
                                            decreasing_line_color= 'brown',
                        )],
                        layout=go.Layout(
                            title=f"{self.name} - {time_frame}",
                            xaxis_rangeslider_visible=False,
                            xaxis_tickangle = 45,
                            template='plotly_dark',
                        )
        )

        fig.show()
    


    def positions(self):
        symbol_positions = mt5.positions_get(symbol=f'{self.name}')
        if symbol_positions :
            return self._make_df_positions_(symbol_positions)
        else :
            raise Exception("There is No Position")

    def _make_df_positions_(self, symbol_orders):
        positions = pd.DataFrame(columns=['ticket', 'time', 'type', 'volume', 'Open Price', 'Current Price', 'SL', 'TP', 'Profit'])
        for idx, o in enumerate(symbol_orders) :
            time = pd.to_datetime(o.time,  unit='s')
            if o.type == 0 : position_type = 'buy'
            elif o.type == 1 : position_type = 'sell'
            positions.loc[idx+1] = [o.ticket, time, position_type, o.volume, o.price_open, o.price_current, o.sl, o.tp, o.profit]

        return positions
        
        
        
    def orders(self):
        symbol_orders = mt5.orders_get(symbol=f'{self.name}')
        if symbol_orders :
            return self._make_df_orders_(symbol_orders)
        else :
            raise Exception("There is No Order")

    def _make_df_orders_(self, symbol_orders):
        orders = pd.DataFrame(columns=['ticket', 'time', 'type', 'volume', 'Open Price', 'SL', 'TP'])
        for idx, o in enumerate(symbol_orders) :
            time = pd.to_datetime(o.time_setup,  unit='s')
            if o.type == 2 : order_type = 'buy limit'
            elif o.type == 3 : order_type = 'sell limit'
            elif o.type == 4 : order_type = 'buy stop'
            elif o.type == 5 : order_type = 'sell stop'
            orders.loc[idx+1] = [o.ticket, time, order_type, o.volume_current, o.price_open, o.sl, o.tp]

        return orders



    def allSymbolsPositions(self):
        all_orders = mt5.positions_get()
        all_symbols = np.unique([i.symbol for i in all_orders])
        return print(*all_symbols, sep='\n')
        



    
    def sendOrder(self, order_type, volume:float, tp:float=None, sl:float=None, deviation=10):
        ask = mt5.symbol_info_tick(f'{self.name}').ask
        bid = mt5.symbol_info_tick(f'{self.name}').bid

        match order_type:
            case 'buy':
                type = mt5.ORDER_TYPE_BUY
                action = mt5.TRADE_ACTION_DEAL
                position="BUY"
                price = self.price['ask']
            case 'sell':
                type = mt5.ORDER_TYPE_SELL
                action = mt5.TRADE_ACTION_DEAL
                position="SELL"
                price = self.price['bid']

        request = {
            "action" : action,
            "type_filling" : mt5.ORDER_FILLING_FOK,
            "type_time" : mt5.ORDER_TIME_GTC,
            "symbol" : f'{self.name}',
            "type" : type,
            "volume" : float(volume),
            "deviation": deviation,   
        }

        if tp :
            tp = float(tp)
            if order_type=='buy' and tp > bid :     # reverse the condition for sell : bid
                request['tp'] = tp
            elif order_type=='buy' and tp < bid :   # reverse the condition for sell : bid
                return rprint(f':thumbs_down: [red1 bold underline] In BUY positions TP must set HIGHER than current price. \n Price : {ask} \n TP    : {tp}')

            if order_type=='sell' and tp < ask :    # reverse the condition for buy : ask
                request['tp'] = tp
            elif order_type=='sell' and tp > ask :  # reverse the condition for buy : ask
                return rprint(f':thumbs_down: [red1 bold underline] In SELL positions TP must set LOWER than current price. \n Price : {bid} \n TP    : {tp}')

        if sl :
            sl = float(sl)
            if order_type=='buy' and sl < bid :     # reverse the condition for sell : bid
                request['sl'] = sl
            elif order_type=='buy' and sl > bid :   # reverse the condition for sell : bid
                return rprint(f':thumbs_down: [red1 bold underline] In BUY positions SL must set LOWER than current price. \n Price : {ask} \n SL    : {sl}')
            
            if order_type=='sell' and sl > ask :    # reverse the condition for buy : ask
                request['sl'] = sl
            elif order_type=='sell' and sl < ask :  # reverse the condition for buy : ask
                return print(f':thumbs_down: [red1 bold underline] In SELL positions SL must set HIGHER than current price. \n Price : {bid} \n SL    : {sl}')

        
        # Send the request
        result = mt5.order_send(request)
        
        # PIP VALUE OF ORDER in USD
        base = self.info.currency_base
        quote = self.info.currency_profit
        if quote == 'USD' : pip_value = np.round(price * (self.info.point) * (volume*100000), decimals=2)
        elif base == 'USD' : pip_value = np.round(1/price * (self.info.point) * (volume*100000), decimals=2)
        else : pip_value = np.round(((mt5.symbol_info(f'{quote}USD').ask + mt5.symbol_info(f'{quote}USD').bid) / 2 )* (self.info.point) * (volume*100000), decimals=2)
        
        # Show result of order
        if result is not None :
            if result.comment == 'Request executed':
                if result.request.tp : profit = (np.abs(result.price - result.request.tp)*(10**self.info.digits))*pip_value
                if result.request.sl : loss = (np.abs(result.price - result.request.sl)*(10**self.info.digits))*pip_value
                table = Table(title=f" :thumbs_up: [green bold underline]{self.name} Order Executed",
                              row_styles=['', 'dim'],
                              pad_edge=False,
                              title_justify='center',
                              box=box.MINIMAL_DOUBLE_HEAD,
                              show_lines=True,
                              min_width=30,
                              show_header=False,
                              )
                table.add_column(f'', justify="center", style="bold cyan", vertical="middle")
                table.add_column('', style="cyan", justify="center", vertical="middle") 
                table.add_row('Position', f'{position}') 
                table.add_row('Price', f'{result.price:0.05f}')         
                table.add_row('Volume', f'{result.volume}')
                table.add_row('TP', f'{result.request.tp}', f'Profit : {profit:0.2f} $ \nReward : {(profit/EQUITY)*100:0.2f} %') if result.request.tp else table.add_row('TP', 'UNSET')
                table.add_row('SL', f'{result.request.sl}', f'Loss : -{loss:0.2f} $ \nRisk :  {(loss/EQUITY)*100:0.02f} %') if result.request.sl else table.add_row('SL', 'UNSET')
                console.print(table)
                
            else : 
                rprint(f':thumbs_down: [red1 bold underline] {result.comment}')
        # return result





    def sl(self, order, sl:float=None, risk=None, _live_=False):
        ask = mt5.symbol_info_tick(f'{self.name}').ask
        bid = mt5.symbol_info_tick(f'{self.name}').bid
        

        # PIP VALUE OF ORDER in USD
        base = self.info.currency_base
        quote = self.info.currency_profit
        if quote == 'USD' : pip_value = np.round((order['Open Price'] * (self.info.point) * (order.volume*100000)), decimals=2)
        elif base == 'USD' : pip_value = np.round((1/order['Open Price'] * (self.info.point) * (order.volume*100000)), decimals=2)
        else : pip_value = np.round((((mt5.symbol_info(f'{quote}USD').ask + mt5.symbol_info(f'{quote}USD').bid) / 2 )* (self.info.point) * (order.volume*100000)), decimals=2)
 


        if sl :
            if sl == order.SL:
                return rprint('[yellow bold underline] This Value for SL already set.')
            elif order.type=='buy' and sl > bid :
                return rprint(f':thumbs_down: [red1 bold underline] In BUY positions SL must set LOWER than current price. \n Price : {bid} \n SL    : {sl}')
            elif order.type=='sell' and sl < ask :
                return rprint(f':thumbs_down: [red1 bold underline] In SELL positions SL must set HIGHER than current price. \n Price : {ask} \n SL    : {sl}')
            else : 
                request = {
                    'action' : mt5.TRADE_ACTION_SLTP,
                    'position': int(order.ticket),
                    'tp' : order.TP,
                    'sl' : sl,
                    } 
                    
                result = mt5.order_send(request)

                if result is not None :
                    if result.comment == 'Request executed':
                        if result.request.tp : profit = (np.abs(order["Open Price"] - result.request.tp)*(10**self.info.digits))*pip_value
                        if result.request.sl : loss = (np.abs(order["Open Price"] - result.request.sl)*(10**self.info.digits))*pip_value

                        if _live_ :
                            if order['type']== 'buy':
                                if result.request.sl >= order['Open Price'] : 
                                    print("\033[1m", "\033[0;32m", f'New SL is  {result.request.sl:0.05f}', end="\r")
                                elif result.request.sl < order['Open Price'] :
                                    print("\033[1m", "\033[0;31m", f'New SL is  {result.request.sl:0.05f}', end="\r")
                            if order['type']== 'sell':
                                if result.request.sl <= order['Open Price'] : 
                                    print("\033[1m", "\033[0;32m", f'New SL is  {result.request.sl:0.05f}', end="\r")
                                elif result.request.sl > order['Open Price'] :
                                    print("\033[1m", "\033[0;31m", f'New SL is  {result.request.sl:0.05f}', end="\r")

                        elif not _live_ : 
                            table = Table(title=f" :thumbs_up: [green bold underline]{self.name} SL SET",
                                                    row_styles=['', 'dim'],
                                                    pad_edge=False,
                                                    title_justify='center',
                                                    box=box.MINIMAL_DOUBLE_HEAD,
                                                    show_lines=True,
                                                    min_width=30,
                                                    show_header=False,
                                                    )
                            table.add_column(f'', justify="center", style="bold cyan", vertical="middle")
                            table.add_column('', style="cyan", justify="center", vertical="middle") 
                            table.add_row('Position', f'{order.type.upper()}') 
                            table.add_row('Price', f'{order["Open Price"]}')         
                            table.add_row('Volume', f'{order.volume}')
                            table.add_row('TP', f'{result.request.tp:0.05f}', f'Profit : {profit:0.2f} $ \nReward : {(profit/EQUITY)*100:0.2f} %') if result.request.tp else table.add_row('TP', 'UNSET')
                            table.add_row('SL', f'{result.request.sl:0.05f}', f'Loss : -{loss:0.2f} $ \nRisk :  {(loss/EQUITY)*100:0.02f} %') if result.request.sl else table.add_row('SL', 'UNSET')
                            console.print(table)

        elif risk : 
            nb_decimal = self.info.digits
            sl_percentage = (risk/100) / LEVERAGE
            if str(order.type) == 'buy':
                price = order['Open Price']
                sl_price = sl_percentage * price
                sl = np.round(price - sl_price, nb_decimal)
            elif str(order.type) == 'sell':
                price = order['Open Price']
                sl_price = sl_percentage * price
                sl = np.round(price + sl_price, nb_decimal)

            # rprint(f'{order.type.upper()} Position \n {self.name} \n Volume        : {order.volume} \n Open Price    : {order["Open Price"]} \n Current Price : {order["Current Price"]} \n -----------')
            rprint('[magenta] RISK : ', risk, '%')
            rprint('[magenta] SL   : ', sl)
            return self.sl(order, sl=sl)






    def tp(self, order, tp:float=None, reward=None):
        ask = mt5.symbol_info_tick(f'{self.name}').ask
        bid = mt5.symbol_info_tick(f'{self.name}').bid

        # PIP VALUE OF ORDER in USD
        base = self.info.currency_base
        quote = self.info.currency_profit
        if quote == 'USD' : pip_value = np.round((order['Open Price'] * (self.info.point) * (order.volume*100000)), decimals=2)
        elif base == 'USD' : pip_value = np.round((1/order['Open Price'] * (self.info.point) * (order.volume*100000)), decimals=2)
        else : pip_value = np.round((((mt5.symbol_info(f'{quote}USD').ask + mt5.symbol_info(f'{quote}USD').bid) / 2 )* (self.info.point) * (order.volume*100000)), decimals=2)


        if tp : 
            if tp == order.TP : 
                return rprint('[yellow bold underline] This Value for TP already set.')
            elif order.type=='buy' and tp < bid :
                return rprint(f':thumbs_down: [red1 bold underline]In BUY positions TP must set HIGHER than current price. \n Price : {bid} \n TP    : {tp}')
            elif order.type=='sell' and tp > ask :
                return rprint(f':thumbs_down: [red1 bold underline]In SELL positions TP must set LOWER than current price. \n Price : {ask} \n TP    : {tp}')
            else:
                request = {
                    'action' : mt5.TRADE_ACTION_SLTP,
                    'position': int(order.ticket),
                    'deviation': 0,
                    'sl' : order.SL,
                    'tp' : tp} 
                result = mt5.order_send(request)
                if result is not None :
                    if result.comment == 'Request executed':
                        if result.request.tp : profit = (np.abs(order["Open Price"] - result.request.tp)*(10**self.info.digits))*pip_value
                        if result.request.sl : loss = (np.abs(order["Open Price"] - result.request.sl)*(10**self.info.digits))*pip_value

                        table = Table(title=f" :thumbs_up: [green bold underline]{self.name} TP SET",
                                    row_styles=['', 'dim'],
                                    pad_edge=False,
                                    title_justify='center',
                                    box=box.MINIMAL_DOUBLE_HEAD,
                                    show_lines=True,
                                    min_width=30,
                                    show_header=False,
                                    )
                        table.add_column(f'', justify="center", style="bold cyan", vertical="middle")
                        table.add_column('', style="cyan", justify="center", vertical="middle") 
                        table.add_row('Position', f'{order.type.upper()}') 
                        table.add_row('Price', f'{order["Open Price"]}')         
                        table.add_row('Volume', f'{order.volume}')
                        table.add_row('TP', f'{result.request.tp}', f'Profit : {profit:0.2f} $ \nReward : {(profit/EQUITY)*100:0.2f} %') if result.request.tp else table.add_row('TP', 'UNSET')
                        table.add_row('SL', f'{result.request.sl}', f'Loss : -{loss:0.2f} $ \nRisk :  {(loss/EQUITY)*100:0.02f} %') if result.request.sl else table.add_row('SL', 'UNSET')
                        console.print(table)
                                     
                                
        elif reward : 
            nb_decimal = self.info.digits
            tp_percentage = (reward/100) / LEVERAGE
            if str(order.type) == 'buy':
                price = order['Open Price']
                tp_price = tp_percentage * price
                tp_reward = np.round(price + tp_price, nb_decimal)
            elif str(order.type) == 'sell':
                price = order['Open Price']
                tp_price = tp_percentage * order['Open Price']
                tp_reward = np.round(price - tp_price, nb_decimal)

            # rprint(f'{order.type.upper()} Position \n {self.name} \n Volume        : {order.volume} \n Open Price    : {order["Open Price"]} \n Current Price : {order["Current Price"]} \n -----------')
            rprint('REWARD : ', reward, '%')
            rprint('TP     : ', tp_reward)
            return self.tp(order, tp=tp_reward)
        
        




    def closeOrder(self, order, volume=None):
        if mt5.positions_get(ticket=int(order.ticket)): 
            if volume is None : 
                volume = float(order.volume)

            if order.type == 'buy' : type = mt5.ORDER_TYPE_SELL
            elif order.type == 'sell' : type = mt5.ORDER_TYPE_BUY

            ticket = int(order.ticket)
            ordertype = str(order.type)

            result = mt5.order_send(
                {
                    'action':  mt5.TRADE_ACTION_DEAL,
                    'volume': volume,
                    'type' : type,
                    'type_time' : mt5.ORDER_TIME_GTC,
                    'type_filling': mt5.ORDER_FILLING_FOK,
                    'symbol': self.name,
                    'deviation': 10,
                    'position': int(order.ticket)
                })

            deal_hist = mt5.history_deals_get(position=ticket)

            table = Table(title=f" :triangular_flag: [green bold underline]{self.name} Order Closed",
                        row_styles=['', 'dim'],
                        pad_edge=False,
                        title_justify='center',
                        box=box.MINIMAL_DOUBLE_HEAD,
                        show_lines=True,
                        min_width=30,
                        show_header=False,
                        )
            table.add_column(f'', justify="center", style="bold cyan", vertical="middle")
            table.add_column('', style="cyan", justify="center", vertical="middle") 
            table.add_row('Position', f'{ordertype.upper()}') 
            table.add_row('Open Price', f'{deal_hist[0].price}')         
            table.add_row('Close Price', f'{deal_hist[1].price}')         
            table.add_row('Volume', f'{deal_hist[1].volume}')
            table.add_row('Profit', f'{deal_hist[1].profit} $')
            console.print(table)
        else : 
            rprint('[bold underline red1] Order does not exist anymore.')



    
    

    def sendPending(self, pending_type, price, volume, tp=None, sl=None, deviation=10):
        ask = mt5.symbol_info_tick(f'{self.name}').ask
        bid = mt5.symbol_info_tick(f'{self.name}').bid
        action = mt5.TRADE_ACTION_PENDING

        match pending_type:
            case 'buy':
                if price > ask :
                    order_type = mt5.ORDER_TYPE_BUY_STOP
                    position = "Buy Stop"
                elif price < ask :
                    order_type = mt5.ORDER_TYPE_BUY_LIMIT
                    position = "Buy Limit"
            case 'sell':
                if price > bid : 
                    order_type = mt5.ORDER_TYPE_SELL_LIMIT
                    position = "Sell Limit"
                elif price < bid : 
                    order_type = mt5.ORDER_TYPE_SELL_STOP
                    position = "Sell Stop"
            case 'buy stop limit':
                order_type = mt5.ORDER_TYPE_BUY_STOP_LIMIT
                position = "Buy Stop Limit"
            case 'sell stop limit':
                order_type = mt5.ORDER_TYPE_SELL_STOP_LIMIT
                position = "Sell Stop Limit"

        # Make a request 
        request = {
            "action" : action,
            "type" : order_type,
            "type_filling" : mt5.ORDER_FILLING_FOK,
            "type_time" : mt5.ORDER_TIME_GTC,
            "price" : price,
            "symbol" : self.name,
            "volume" : volume,
            "deviation" : deviation 
        }
        
        if tp : 
            tp = float(tp) 
            if 'buy' in pending_type :
                if tp > bid :
                    request['tp'] = tp
                elif tp < bid : 
                    rprint(f':thumbs_down: [bold underline red1] In BUY positions TP must set HIGHER than current price. \n Price : {bid} \n TP    : {tp}')
            if 'sell' in pending_type :
                if tp < ask :
                    request['tp'] = tp
                elif tp > ask : 
                    rprint(f':thumbs_down: [bold underline red1]  In SELL positions TP must set LOWER than current price. \n Price : {ask} \n TP    : {tp}')

        if sl : 
            sl = float(sl)
            if 'buy' in pending_type :
                if sl < bid :
                    request['sl'] = sl
                elif sl > bid : 
                    rprint(f':thumbs_down: [bold underline red1] In BUY positions SL must set LOWER than current price. \n Price : {bid} \n TP    : {tp}')
            if 'sell' in pending_type :
                if sl > ask :
                    request['sl'] = tp
                elif sl < ask : 
                    rprint(f':thumbs_down: [bold underline red1] In SELL positions SL must set HIGHER than current price. \n Price : {ask} \n TP    : {tp}')

        # Send the request
        result = mt5.order_send(request)
        # Show result of order
        if result is not None :
            if result.comment == 'Request executed':
                # PIP VALUE OF ORDER in USD
                base = self.info.currency_base
                quote = self.info.currency_profit
                if quote == 'USD' : pip_value = np.round(result.request.price * (self.info.point) * (result.request.volume*100000), decimals=2)
                elif base == 'USD' : pip_value = np.round(1/result.request.price * (self.info.point) * (result.request.volume*100000), decimals=2)
                else : pip_value = np.round(((mt5.symbol_info(f'{quote}USD').ask + mt5.symbol_info(f'{quote}USD').bid) / 2 )* (self.info.point) * (volume*100000), decimals=2)

                # Profit and Loss in USD
                if result.request.tp : profit = (np.abs(result.request.price - result.request.tp)*(10**self.info.digits))*pip_value
                if result.request.sl : loss = (np.abs(result.request.price - result.request.sl)*(10**self.info.digits))*pip_value

                table = Table(title=f" :triangular_flag: [deep_sky_blue1 bold underline]{self.name} Pending Order Set",
                              row_styles=['', 'dim'],
                              pad_edge=False,
                              title_justify='center',
                              box=box.MINIMAL_DOUBLE_HEAD,
                              show_lines=True,
                              min_width=30,
                              show_header=False,
                            )
                table.add_column(f'', justify="center", style="bold cyan", vertical="middle")
                table.add_column('', style="cyan", justify="center", vertical="middle") 
                table.add_row('Position', f'{position}') 
                table.add_row('Price', f'{result.request.price}')         
                table.add_row('Volume', f'{result.request.volume}')
                table.add_row('TP', f'{result.request.tp}', f'Profit : {profit:0.2f} $ \nReward : {(profit/EQUITY)*100:0.2f} %') if result.request.tp else table.add_row('TP', 'UNSET')
                table.add_row('SL', f'{result.request.sl}', f'Loss : -{loss:0.2f} $ \nRisk :  {(loss/EQUITY)*100:0.02f} %') if result.request.sl else table.add_row('SL', 'UNSET')
                console.print(table)

            else : 
                rprint(f':thumbs_down: [bold red1 underline] {result.comment}')




    def removePending(self, order):
        request = {
            "action" : mt5.TRADE_ACTION_REMOVE,
            "order" : int(order.ticket),
        }
            
        # Send the request
        result = mt5.order_send(request)

        # Show result of order
        if result is not None :
            if result.comment == 'Request executed' :
                rprint(':thumbs_up: [green bold] Order Removed')
            else : 
                rprint(f':thumbs_down: [red1 bold underline] {result.comment}')

            




    def trailingSL(self, order, threshold, sl=None):
        p = self.info.point
        
        # Update order information 
        mt5_order = mt5.positions_get(ticket=int(order.ticket))
        order = self._make_df_positions_(mt5_order).iloc[0]
        
        if sl is not None: 
            sl = sl
        elif sl is None and order.SL : 
            sl = order.SL
        else :
            return rprint(f':thumbs_down: [red1 bold underline] SL is UNSET')
      
        # Update order information 
        mt5_order = mt5.positions_get(ticket=int(order.ticket))
        order = self._make_df_positions_(mt5_order).iloc[0]

        difference_price_sl = [order['Current Price'] - order.SL]
        difference_threshold_price = []
        
        while True : 
            time.sleep(1)

            # If position is closed (by tp or sl) break the loop
            if not mt5.positions_get(ticket=int(order.ticket)): 
                deal_hist = mt5.history_deals_get(position=int(order.ticket))
                table = Table(
                    title=f" :triangular_flag: [green bold underline]{self.name} Order Closed",
                    row_styles=['', 'dim'],
                    pad_edge=False,
                    title_justify='center',
                    box=box.MINIMAL_DOUBLE_HEAD,
                    show_lines=True,
                    min_width=30,
                    show_header=False,
                )
                table.add_column(f'', justify="center", style="bold cyan", vertical="middle")
                table.add_column('', style="cyan", justify="center", vertical="middle") 
                table.add_row('Position', f'{order.type.upper()}') 
                table.add_row('Volume', f'{deal_hist[1].volume}') 
                table.add_row('Open Price', f'{deal_hist[0].price}')
                table.add_row('Close Price', f'{deal_hist[1].price}')
                table.add_row('Profit', f'{deal_hist[1].profit}')
                console.print(table)
                break


            current_sl = mt5.positions_get(ticket=int(order.ticket))[0].sl
            if order.type=='buy' :
                c_price = mt5.symbol_info_tick(f'{self.name}').bid      # Current price for selling bought position
                threshold_price = current_sl + threshold*p*10
                difference_price_sl.append(c_price - order.SL)
                difference_threshold_price.append(c_price - threshold_price)
                if difference_threshold_price[-1] > 0.0 :
                    print(f'difference :  {difference_price_sl[-1]*10000}', end='\x1b[1K\r')
                elif difference_threshold_price[-1] <= 0.0 :
                    if difference_price_sl[-1] > difference_price_sl[-2] and ((current_sl)+(difference_price_sl[-1] - difference_price_sl[-2])) < c_price :
                        self.sl(order, sl=(current_sl)+(difference_price_sl[-1] - difference_price_sl[-2]), _live_=True)

            elif order.type=='sell' :
                c_price = mt5.symbol_info_tick(f'{self.name}').ask      # Current price for buying sold position
                threshold_price = sl - threshold*p*10
                difference_price_sl.append(order.SL - c_price)
                difference_threshold_price.append(threshold_price - c_price)
                if difference_threshold_price[-1] > 0.0 :  # When difference is bigger than 0 it's mean that the THRESHOLD is not reached
                    print(f'threshold : {threshold*p*10}  and difference :  {difference_price_sl[-1]:0.5f}', end='\x1b[1K\r')
                elif difference_threshold_price[-1] <= 0.0 : # When difference is smaller than 0 it's mean that the THRESHOLD is reached
                    if difference_price_sl[-1] > difference_price_sl[-2] and ((current_sl)-(difference_price_sl[-1] - difference_price_sl[-2])) > c_price :    # When difference is bigger than the previous one it's mean price is going far away from the SL
                        self.sl(order, sl=(current_sl)-(difference_price_sl[-1] - difference_price_sl[-2]), _live_=True)

    
                        
                

            

    

    def trailingTP(self, order, points, tp=None):
        p = self.info.point
        # Update order information 
        mt5_order = mt5.positions_get(ticket=int(order.ticket))
        order = self._make_df_positions_(mt5_order).iloc[0]
      
        if tp is not None: 
            tp = tp
        elif tp is None and order.TP : 
            tp = order.TP
        else :
            return rprint(f':thumbs_down: [red1 bold underline] TP is UNSET')

        # remove TP
        mt5.order_send({
            'action' : mt5.TRADE_ACTION_SLTP,
            'position': int(order.ticket),
        })

        # Update order information 
        mt5_order = mt5.positions_get(ticket=int(order.ticket))
        order = self._make_df_positions_(mt5_order).iloc[0]


        # For live updating
        def generate_table(tp, c_price, order_type) -> Table:
            table = Table(
                row_styles=['', 'dim'],
                pad_edge=False,
                title_justify='center',
                box=box.MINIMAL_DOUBLE_HEAD,
                show_lines=True,
                min_width=30,
                show_header=False,
            ) 
            table.add_column('', justify='center', vertical='middle')
            if order_type == 'buy' :
                table.add_row(
                    '[bold italic] difference between \n Price and TP',  f'[blue3 bold]{(tp-c_price)*10000:0.1f} PIP' if ((tp-c_price)*10000 > 1) else f'[green bold] {(tp-c_price)*10000:0.1f} PIP'
                )
            elif  order_type == 'sell' : 
                table.add_row(
                    '[bold italic] difference between \n Price and TP',  f'[blue3 bold]{(c_price-tp)*10000:0.1f} PIP' if ((c_price-tp)*10000 > 1) else f'[green bold] {(c_price-tp)*10000:0.1f} PIP'
                )
                
            return table

        with Live('Trailing TP Market Watch', refresh_per_second=1) as live:
            while True : 
                time.sleep(1)

                # If position is closed (by tp or sl) break the loop
                if not mt5.positions_get(ticket=int(order.ticket)): 
                    deal_hist = mt5.history_deals_get(position=int(order.ticket))
                    table = Table(title=f" :triangular_flag: [green bold underline]{self.name} Order Closed",
                                row_styles=['', 'dim'],
                                pad_edge=False,
                                title_justify='center',
                                box=box.MINIMAL_DOUBLE_HEAD,
                                show_lines=True,
                                min_width=30,
                                show_header=False,
                                )
                    table.add_column(f'', justify="center", style="bold cyan", vertical="middle")
                    table.add_column('', style="cyan", justify="center", vertical="middle") 
                    table.add_row('Position', f'{order.type.upper()}') 
                    table.add_row('Volume', f'{deal_hist[1].volume}') 
                    table.add_row('Open Price', f'{deal_hist[0].price}')
                    table.add_row('Close Price', f'{deal_hist[1].price}')
                    table.add_row('Profit', f'{deal_hist[1].profit}')
                    console.print(table)
                    break
        
                if order.type=='buy' :
                    c_price = mt5.symbol_info_tick(f'{self.name}').bid      # Current price for selling bought position
                    if c_price < tp :
                        live.update(generate_table(tp, c_price, 'buy'))

                        # print(f'difference between Price and TP (PIP):  {(tp-c_price)*10000:04f}', end='\x1b[1K\r')
                    elif c_price >= tp : 
                        self.sl(order, sl=tp-(points*p))
                        tp = tp + (points*p)
                        rprint(f'[green bold underline] :thumbs_up: New Target : {tp}')
                        

                if order.type =='sell' :
                    c_price = mt5.symbol_info_tick(f'{self.name}').ask      # Current price for selling bought position
                    if c_price > tp :
                        live.update(generate_table(tp, c_price, 'sell'))
                    elif c_price <= tp : 
                        self.sl(order, sl=tp+(points*p) )
                        tp = tp - (points*p)
                        rprint(f'[green bold underline] :thumbs_up: New Target : {tp}')
                    
        
        

EURUSD = Symbol('EURUSD')

# Number of orders 
# EURUSD.orderN

# Number of positions 
# EURUSD.positionsN

# all symbols has open positions
# EURUSD.allSymbolsPositions()


# send an order to the market
# EURUSD.sendOrder('sell', volume=0.01)

# get order number 1
o1 = EURUSD.positions().loc[1]

# Modifing order
EURUSD.sl(order=o1, sl=1.03380)
# EURUSD.tp(order=o1, tp=1.01999)
EURUSD.trailingSL(o1, threshold=60)
# EURUSD.trailingTP(o1, points=60)
# EURUSD.closeOrder(o1)


# Create and remove pending order
# EURUSD.sendPending('buy', price=1.01700, volume=0.01)
# op1 = EURUSD.orders()
# EURUSD.removePending(op1)
