import { AxiosResponse } from 'axios';
import type { BinanceCandlesParams, FearGreed, UpbitCandle, UpbitCandlesParams } from '@/types/Candle';
import type { Coin, CoinInfoResponse } from '@/types/Coin';
import type { Currency } from '@/types/Currency';
import { DailyVolumnResponse } from '@/types/DailyVolumn';
import type { MarketCap } from '@/types/Marketcap';
export declare const getCurrencyInfo: () => Promise<AxiosResponse<Currency>>;
export declare const getCoins: (type: "KRW" | "BTC") => Promise<AxiosResponse<Coin[]>>;
export declare const getUpbitCoinsV2: () => Promise<any>;
export declare const getUpbitCoins: () => Promise<AxiosResponse<any, any>>;
export declare const getBinanceCoinsV2: () => Promise<any>;
export declare const getBinanceCoins: () => Promise<AxiosResponse<any, any>>;
/**
 * news api
 */
export declare const getNews: (category?: string) => Promise<AxiosResponse<any, any>>;
export declare const getMarketcap: () => Promise<AxiosResponse<MarketCap[]>>;
/**
 * 탐욕 지수 api
 * @returns
 */
export declare const getFearGreedIndex: () => Promise<AxiosResponse<FearGreed>>;
export declare const getUpbitCandles: ({ market, to, candleType, count, minute, }: UpbitCandlesParams) => Promise<AxiosResponse<UpbitCandle[]>>;
/**
 * 두나무 환율 정보
 * https://crix-api-cdn.upbit.com/v1/forex/recent?codes=FRX.KRWUSD
 **/
export declare const getUpgitRateExchange: () => Promise<AxiosResponse<any, any>>;
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
export declare const getBinanceCandles: ({ symbol, interval, }: BinanceCandlesParams) => Promise<AxiosResponse<any, any>>;
export declare const postChat: (message: string) => Promise<AxiosResponse<any, any>>;
export declare const getCoinInfo: (coin: string) => Promise<AxiosResponse<CoinInfoResponse>>;
export declare const getDailyVolumnPower: (orderBy: string, count?: number) => Promise<DailyVolumnResponse>;
//# sourceMappingURL=index.d.ts.map