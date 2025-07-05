var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUpbitCoins } from '@/api';
const UPBIT_SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
export default class UpbitWebSocket {
    constructor() {
        this._isConnected = false;
        this.btcKrw = 0;
        this._isConnected = false;
        const socket = new WebSocket(UPBIT_SOCKET_URL);
        socket.binaryType = 'arraybuffer';
        this.data = { krw: {}, usdt: {}, btc: {} };
        this._socket = socket;
        this.onConnect(socket);
    }
    parseTickerData(data) {
        const enc = new TextDecoder('utf-8');
        const arr = new Uint8Array(data);
        return JSON.parse(enc.decode(arr));
    }
    updateTickerData(symbol, data, market) {
        const { trade_price: tradePrice, opening_price: openPrice, high_price: highPrice, low_price: lowPrice, market_warning: marketWarning, signed_change_price: changePrice, signed_change_rate: changeRate, market_state: marketState, acc_trade_volume: volume, change, timestamp, } = data;
        this.data[market][symbol] = {
            tradePrice,
            highPrice,
            lowPrice,
            openPrice,
            marketWarning,
            changePrice,
            changeRate,
            change,
            marketState,
            volume,
            timestamp,
        };
    }
    reconnect(delay = 3000) {
        var _a;
        try {
            (_a = this._socket) === null || _a === void 0 ? void 0 : _a.close();
        }
        catch (e) {
            console.warn('[Upbit] Socket close failed:', e);
        }
        this._isConnected = false;
        this._socket = null;
        setTimeout(() => {
            const socket = new WebSocket(UPBIT_SOCKET_URL);
            socket.binaryType = 'arraybuffer';
            this._socket = socket;
            this.onConnect(socket);
        }, delay);
    }
    onConnect(socket) {
        if (this._isConnected)
            return;
        socket.onopen = () => this.onOpen(socket);
        socket.onmessage = (e) => this.onMessage(e);
        socket.onclose = () => this.onClose();
        socket.onerror = (e) => this.onError(e);
    }
    onOpen(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const upbitList = (yield getUpbitCoins()).data.filter((coin) => coin.market.includes('KRW-') || coin.market.includes('BTC-'));
            this._isConnected = true;
            const data = [
                { ticket: 'coin-at' },
                {
                    type: 'ticker',
                    codes: ['KRW-BTC', ...upbitList.map((coin) => coin.market)],
                },
            ];
            socket.send(JSON.stringify(data));
        });
    }
    onMessage(e) {
        const tickerData = this.parseTickerData(e.data);
        const { code } = tickerData;
        const symbol = code.slice(code.indexOf('-') + 1, code.length);
        if (code === 'KRW-BTC' && symbol === 'BTC') {
            this.btcKrw = tickerData.trade_price;
        }
        if (code === `KRW-${symbol}`) {
            this.updateTickerData(symbol, tickerData, 'krw');
            this.updateTickerData(symbol, tickerData, 'usdt');
        }
        if (code === `BTC-${symbol}`) {
            this.updateTickerData(symbol, tickerData, 'btc');
        }
    }
    onClose() {
        console.warn('[info] Upbit Socket closed');
        this.reconnect();
    }
    onError(error) {
        console.error('[error] Upbit Socket error:', error);
        this.reconnect();
    }
}
