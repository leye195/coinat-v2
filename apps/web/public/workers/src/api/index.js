var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { queryStringify } from '@/lib/utils';
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
export const getCurrencyInfo = () => api.get('currency');
export const getCoins = (type) => api.get(`coin-v2?type=${type}`);
export const getUpbitCoinsV2 = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${BASE_URL}/api/upbit/market`, {
            cache: 'force-cache',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json(); // 응답 본문을 읽음
        return data; // 데이터 반환
    }
    catch (error) {
        console.error('Error fetching Upbit coins:', error);
        return []; // 또는 대체 데이터를 반환
    }
});
export const getUpbitCoins = () => api.get('market');
export const getBinanceCoinsV2 = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${BASE_URL}/api/binance/market`, //'https://api.binance.com/api/v3/exchangeInfo',
        {
            cache: 'no-cache',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching Binance coins:', error);
        return []; // 또는 대체 데이터를 반환
    }
});
export const getBinanceCoins = () => axios.get('https://api.binance.com/api/v3/exchangeInfo');
/**
 * news api
 */
export const getNews = (category) => api.get(`news?${queryStringify({
    category,
})}`);
export const getMarketcap = () => axios.get('https://crix-api-cdn.upbit.com/v1/crix/marketcap?currency=KRW');
/**
 * 탐욕 지수 api
 * @returns
 */
export const getFearGreedIndex = () => axios.get('https://api.alternative.me/fng/?limit=1');
export const getUpbitCandles = (_a) => __awaiter(void 0, [_a], void 0, function* ({ market, to, candleType = 'months', count = 200, minute = 3, }) {
    const params = {
        market,
        count,
        to,
    };
    try {
        if (candleType === 'minutes') {
            const response = yield upbitApi.get(`/candles/minutes/${minute}`, {
                params,
            });
            return response;
        }
        const response = yield upbitApi.get(`/candles/${candleType}`, {
            params,
        });
        return response;
    }
    catch (_b) {
        const response = yield api.get(`upbit/candles`, {
            params: Object.assign({ type: candleType }, params),
        });
        return response;
    }
});
/**
 * 두나무 환율 정보
 * https://crix-api-cdn.upbit.com/v1/forex/recent?codes=FRX.KRWUSD
 **/
export const getUpgitRateExchange = () => axios.get('https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD');
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
export const getBinanceCandles = ({ symbol, interval, }) => {
    const intervalValue = {
        minutes: '1m',
        days: '1d',
        weeks: '1w',
        months: '1M',
    };
    return binanceApi.get(`/api/v3/uiKlines?symbol=${symbol}&interval=${intervalValue[interval]}`);
};
export const postChat = (message) => api.post('chat', {
    message,
});
export const getCoinInfo = (coin) => api.get(`coin-info?code=${coin.toUpperCase()}`);
export const getDailyVolumnPower = (orderBy_1, ...args_1) => __awaiter(void 0, [orderBy_1, ...args_1], void 0, function* (orderBy, count = 220) {
    try {
        const response = yield fetch(`${BASE_URL}/api/upbit/daily_volume_power?count=${count}&orderBy=${orderBy}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching Upbit coins:', error);
        return {
            lastUpdated: 0,
            markets: [],
        }; // 또는 대체 데이터를 반환
    }
});
