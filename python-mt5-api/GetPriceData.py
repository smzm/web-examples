# Get the price Data

import pandas as pd
import datetime
import ccxt

binance = ccxt.binance()


def fetch_data(coin, timeframe):
    trading_pair = f'{coin}/USDT'
    # Fetch Data from Binance 
    candles = binance.fetch_ohlcv(trading_pair, timeframe=timeframe, limit=1000)
    return candles


def get_chart(coin, timeframe):
    candles = fetch_data(coin, timeframe)
    dates = []
    open_data = []
    high_data = []
    low_data = []
    close_data = []
    volume_data = []
    # append data
    for candle in candles:
        dates.append(datetime.datetime.fromtimestamp(candle[0] / 1000.0).strftime('%Y-%m-%d %H:%M:%S.%f'))
        open_data.append(candle[1])
        high_data.append(candle[2])
        low_data.append(candle[3])
        close_data.append(candle[4])
        volume_data.append(candle[5])
    # Create DataFrame with pandas
    df = pd.DataFrame({ 'datetime':dates,
                        'high':high_data,
                        'low':low_data,
                        'open':open_data,
                        'close': close_data,
                        'volume': volume_data })

    df['pct'] = np.round(df['close'].pct_change()*100, 1)
    return df

# valid intervals - 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
chart = get_chart('BTC', timeframe='5m')
