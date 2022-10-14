import axios, { AxiosResponse } from 'axios';
import type { Coin } from 'types/Coin';
import type { Currency } from 'types/Currency';
import {
  BinanceCandlesParams,
  UpbitCandle,
  UpbitCandlesParams,
} from 'types/Candle';

const UPBIT_API = `https://api.upbit.com/v1`;
const BINANCE_API = `https://api.binance.com`;

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: '/api/',
});

const upbitApi = axios.create({
  baseURL: UPBIT_API,
});

const binanceApi = axios.create({
  baseURL: BINANCE_API,
});

export const getCurrencyInfo = (): Promise<AxiosResponse<Currency>> =>
  api.get('currency');

export const getCoins = (type: 'KRW' | 'BTC'): Promise<AxiosResponse<Coin[]>> =>
  api.get(`coin?type=${type}`);

export const getUpbitCandles = ({
  market,
  candleType = 'months',
  count = 200,
  minute = 3,
}: UpbitCandlesParams): Promise<AxiosResponse<UpbitCandle[]>> => {
  if (candleType === 'minutes')
    return upbitApi.get(
      `/candles/minutes/${minute}?market=${market}&count=${count}`,
    );

  return upbitApi.get(`/candles/${candleType}?market=${market}&count=${count}`);
};

/**
 * symbol: xxxBTC
 * interval:
 * 1s
 * 1m
 * 3m
 * 5m
 * 15m
 * 30m
 * 1h
 * 2h
 * 4h
 * 6h
 * 8h
 * 12h
 * 1d
 * 3d
 * 1w
 * 1M
 */
export const getBinanceCandles = ({ symbol, interval }: BinanceCandlesParams) =>
  binanceApi.get(`/api/v3/uiKlines?symbol=${symbol}&interval=${interval}`);
