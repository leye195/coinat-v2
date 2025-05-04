var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCoins } from '@/lib/coin';
const BINANCE_SOCKET_URL = 'wss://stream.binance.com:9443/stream?streams=';
export default class BinanceWebSocket {
    constructor() {
        this._isConnected = false;
        this._retry = false;
        this.btcKrw = 0; //btc 가격
        this._isConnected = false;
        this._retry = false;
        this._socket = null;
        this.data = { krw: {}, usdt: {}, btc: {} };
        this.onConnect();
    }
    parseTickerData(data) {
        return JSON.parse(data);
    }
    updateTickerData(symbol, data, market) {
        const { c, h, l, o, p, P } = data;
        this.data[market][symbol] = {
            tradePrice: parseFloat(c !== null && c !== void 0 ? c : 0),
            highPrice: h !== null && h !== void 0 ? h : 0,
            lowPrice: l !== null && l !== void 0 ? l : 0,
            openPrice: o !== null && o !== void 0 ? o : 0,
            marketWarning: 'None',
            changePrice: p,
            changeRate: P,
        };
    }
    onConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isConnected)
                return;
            const krw = yield getCoins('KRW');
            const btc = yield getCoins('BTC');
            const usdt = yield getCoins('USDT');
            const streams = `${[...krw, ...btc, ...usdt]
                .map((coin) => `${coin.name.toLowerCase()}${coin.USDT ? 'usdt' : 'btc'}@ticker/`)
                .join('')}btcusdt@ticker`;
            const socket = new WebSocket(`${BINANCE_SOCKET_URL}${streams}`);
            this._socket = socket;
            this._isConnected = true;
            socket.onopen = () => this.onOpen();
            socket.onmessage = (e) => this.onMessage(e);
            socket.onclose = () => this.onClose();
            socket.onerror = (e) => this.onError(e);
        });
    }
    onOpen() { }
    onMessage(e) {
        const { data } = this.parseTickerData(e.data);
        const { s, c } = data;
        const symbol = s.slice(0, s.length - 3);
        if (s.startsWith('BTCUSDT')) {
            this.btcKrw = parseFloat(c !== null && c !== void 0 ? c : 0);
            this.updateTickerData(s.slice(0, s.length - 4), data, 'btc');
        }
        else if (s.endsWith('BTC')) {
            this.updateTickerData(symbol, data, 'btc');
        }
        else if (s.endsWith('USDT')) {
            this.updateTickerData(s.slice(0, s.length - 4), data, 'usdt');
        }
    }
    onClose() {
        this._isConnected = false;
        if (this._retry) {
            setTimeout(() => this.onConnect(), 3000);
            return;
        }
        this._retry = true;
        this.onConnect();
    }
    onError(error) {
        console.error('[ws error] Binance:', error);
        this._isConnected = false;
    }
}
