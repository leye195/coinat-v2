import axios, { AxiosResponse } from 'axios';
import { queryStringify } from '@/lib/utils';
import type {
  BinanceCandlesParams,
  FearGreed,
  UpbitCandle,
  UpbitCandlesParams,
} from '@/types/Candle';
import type { Coin, CoinInfoResponse } from '@/types/Coin';
import type { Currency } from '@/types/Currency';
import { DailyVolumnResponse } from '@/types/DailyVolumn';
import type { MarketCap } from '@/types/Marketcap';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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
  api.get(`coin-v2?type=${type}`);

export const getUpbitCoinsV2 = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/upbit/market`, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // 응답 본문을 읽음
    return data; // 데이터 반환
  } catch (error) {
    console.error('Error fetching Upbit coins:', error);
    return []; // 또는 대체 데이터를 반환
  }
};

export const getUpbitCoins = () => api.get('market');

export const getBinanceCoinsV2 = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/binance/market`, //'https://api.binance.com/api/v3/exchangeInfo',
      {
        cache: 'no-cache',
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Binance coins:', error);
    return []; // 또는 대체 데이터를 반환
  }
};

export const getBinanceCoins = () =>
  axios.get('https://api.binance.com/api/v3/exchangeInfo');

/**
 * news api
 */
export const getNews = (category?: string) =>
  api.get(
    `news?${queryStringify({
      category,
    })}`,
  );

export const getMarketcap = (): Promise<AxiosResponse<MarketCap[]>> =>
  axios.get('https://crix-api-cdn.upbit.com/v1/crix/marketcap?currency=KRW');

/**
 * 탐욕 지수 api
 * @returns
 */
export const getFearGreedIndex = (): Promise<AxiosResponse<FearGreed>> =>
  axios.get('https://api.alternative.me/fng/?limit=1');

export const getUpbitCandles = async ({
  market,
  to,
  candleType = 'months',
  count = 200,
  minute = 3,
}: UpbitCandlesParams): Promise<AxiosResponse<UpbitCandle[]>> => {
  const params = {
    market,
    count,
    to,
  };

  try {
    if (candleType === 'minutes') {
      const response = await upbitApi.get(`/candles/minutes/${minute}`, {
        params,
      });

      return response;
    }

    const response = await upbitApi.get(`/candles/${candleType}`, {
      params,
    });

    return response;
  } catch {
    const response = await api.get(`upbit/candles`, {
      params: {
        candleType,
        ...params,
      },
    });

    return response;
  }
};
/**
 * 두나무 환율 정보
 * https://crix-api-cdn.upbit.com/v1/forex/recent?codes=FRX.KRWUSD
 **/
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
export const getBinanceCandles = ({
  symbol,
  interval,
}: BinanceCandlesParams) => {
  const intervalValue = {
    minutes: '1m',
    days: '1d',
    weeks: '1w',
    months: '1M',
  };

  return binanceApi.get(
    `/api/v3/uiKlines?symbol=${symbol}&interval=${intervalValue[interval]}`,
  );
};

export const postChat = (message: string) =>
  api.post('chat', {
    message,
  });

export const getCoinInfo = (
  coin: string,
): Promise<AxiosResponse<CoinInfoResponse>> =>
  api.get(`coin-info?code=${coin.toUpperCase()}`);

export const getDailyVolumnPower = async (
  orderBy: string,
  count: number = 220,
): Promise<DailyVolumnResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/upbit/daily_volume_power?count=${count}&orderBy=${orderBy}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Upbit coins:', error);
    return {
      lastUpdated: 0,
      markets: [],
    }; // 또는 대체 데이터를 반환
  }
};
