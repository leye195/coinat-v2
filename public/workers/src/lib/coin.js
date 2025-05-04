var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getBinanceCoins, getUpbitCoins, getUpbitCoinsV2, getBinanceCoinsV2, } from '@/api';
export const getCoinSymbolImage = (symbol) => `https://static.upbit.com/logos/${symbol}.png`;
export const getCoinsV2 = (type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // upbit coin data
        const upbitData = yield getUpbitCoinsV2();
        const upbitKrwCoins = upbitData.filter((coin) => coin.market.includes('KRW-'));
        const upbitBtcCoins = upbitData
            .filter((coin) => coin.market.includes('BTC-'))
            .filter((coin) => {
            const symbol = coin.market.replace(/BTC-/, '');
            return !upbitKrwCoins.some((coin) => coin.market.includes(symbol));
        });
        // binance coin data
        const binanceData = yield getBinanceCoinsV2();
        const binanceBtcCoins = (_a = binanceData === null || binanceData === void 0 ? void 0 : binanceData.symbols) === null || _a === void 0 ? void 0 : _a.filter((data) => data.symbol.endsWith('BTC') && data.status === 'TRADING').map((data) => data.symbol.slice(0, data.symbol.length - 3));
        const binanceUsdtCoins = (_b = binanceData === null || binanceData === void 0 ? void 0 : binanceData.symbols) === null || _b === void 0 ? void 0 : _b.filter((data) => data.symbol.endsWith('USDT') && data.status === 'TRADING').map((data) => data.symbol.slice(0, data.symbol.length - 4)).slice(1);
        // filtered data
        const dataWithUSDT = binanceUsdtCoins
            .filter((symbol) => upbitKrwCoins.findIndex(({ market }) => market === `KRW-${symbol}`) !== -1)
            .map((symbol) => {
            const data = {
                name: symbol,
                USDT: upbitKrwCoins.findIndex(({ market }) => market === `KRW-${symbol}`) !== -1,
            };
            return data;
        })
            .sort((data1, data2) => (data1.name > data2.name ? 1 : -1));
        const dataWithBTC = binanceBtcCoins
            .filter((symbol) => upbitKrwCoins.findIndex(({ market }) => market === `KRW-${symbol}`) !== -1 ||
            upbitBtcCoins.findIndex(({ market }) => market === `BTC-${symbol}`) !== -1)
            .map((symbol) => {
            const data = {
                name: symbol,
                KRW: upbitKrwCoins.findIndex(({ market }) => market === `KRW-${symbol}`) !== -1,
                BTC: upbitBtcCoins.findIndex(({ market }) => market === `BTC-${symbol}`) !== -1,
            };
            return data;
        })
            .sort((data1, data2) => (data1.name > data2.name ? 1 : -1));
        return type === 'USDT'
            ? dataWithUSDT.filter((data) => data.USDT)
            : dataWithBTC.filter((data) => data[type]);
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
export const getCoins = (type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // upbit coin data
        const { data: upbitData } = yield getUpbitCoins();
        const upbitKrwCoins = upbitData.filter((coin) => coin.market.includes('KRW-'));
        const upbitBtcCoins = upbitData
            .filter((coin) => coin.market.includes('BTC-'))
            .filter((coin) => {
            const symbol = coin.market.replace(/BTC-/, '');
            return !upbitKrwCoins.some((coin) => coin.market.includes(symbol));
        });
        // binance coin data
        const { data: binanceData } = yield getBinanceCoins();
        const binanceBtcCoins = binanceData.symbols
            .filter((data) => data.symbol.endsWith('BTC') && data.status === 'TRADING')
            .map((data) => data.symbol.slice(0, data.symbol.length - 3));
        const binanceUsdtCoins = (_a = binanceData === null || binanceData === void 0 ? void 0 : binanceData.symbols) === null || _a === void 0 ? void 0 : _a.filter((data) => data.symbol.endsWith('USDT') && data.status === 'TRADING').map((data) => data.symbol.slice(0, data.symbol.length - 4)).slice(1);
        // filtered data
        const dataWithUSDT = binanceUsdtCoins
            .filter((symbol) => upbitKrwCoins.findIndex(({ market }) => market === `KRW-${symbol}`) !== -1)
            .map((symbol) => {
            const data = {
                name: symbol,
                USDT: upbitKrwCoins.findIndex(({ market }) => market === `KRW-${symbol}`) !== -1,
            };
            return data;
        })
            .sort((data1, data2) => (data1.name > data2.name ? 1 : -1));
        const dataWithBTC = binanceBtcCoins
            .filter((symbol) => upbitKrwCoins.findIndex(({ market }) => market === `KRW-${symbol}`) !== -1 ||
            upbitBtcCoins.findIndex(({ market }) => market === `BTC-${symbol}`) !== -1)
            .map((symbol) => {
            const data = {
                name: symbol,
                KRW: upbitKrwCoins.findIndex(({ market }) => market === `KRW-${symbol}`) !== -1,
                BTC: upbitBtcCoins.findIndex(({ market }) => market === `BTC-${symbol}`) !== -1,
            };
            return data;
        })
            .sort((data1, data2) => (data1.name > data2.name ? 1 : -1));
        return type === 'USDT'
            ? dataWithUSDT.filter((data) => data.USDT)
            : dataWithBTC.filter((data) => data[type]);
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
