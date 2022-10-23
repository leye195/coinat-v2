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

/**
 * 탐욕 지수 api
 * @returns
 */
export const getFearGreedIndex = () =>
  axios.get('https://api.alternative.me/fng/?limit=1');

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
 * 두나무 환율 정보
 */
export const getUpgitRateExchange = () =>
  axios.get(
    'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD',
  );

/**
 * symbol: xxxBTC
 *
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

export const postChat = (message: string) =>
  api.post('chat', {
    message,
  });
