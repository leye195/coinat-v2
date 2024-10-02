var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getBinanceCoins, getUpbitCoins } from '@/api';
export const getCoinSymbolImage = (symbol) => `https://static.upbit.com/logos/${symbol}.png`;
export const getCoins = (type) => __awaiter(void 0, void 0, void 0, function* () {
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
        // filtered data
        const data = binanceBtcCoins
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
        return data.filter((data) => data[type]);
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
