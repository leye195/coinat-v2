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
        this.isConnected = false;
        this.retry = false;
        this.btcKrw = 0;
        this.isConnected = false;
        this.retry = false;
        const socket = new WebSocket(UPBIT_SOCKET_URL);
        socket.binaryType = 'arraybuffer';
        this.data = { krw: {}, usdt: {}, btc: {} };
        this.socket = socket;
        this.onConnect(socket);
    }
    onConnect(socket) {
        if (this.isConnected)
            return;
        socket.onopen = () => this.onOpen(socket);
        socket.onmessage = (e) => this.onMessage(e);
        socket.onclose = () => this.onClose();
        socket.onerror = () => this.onError();
    }
    onOpen(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const upbitList = (yield getUpbitCoins()).data.filter((coin) => coin.market.includes('KRW-') || coin.market.includes('BTC-'));
            this.isConnected = true;
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
        const enc = new TextDecoder('utf-8');
        const arr = new Uint8Array(e.data);
        const { code, trade_price: tradePrice, opening_price: openPrice, high_price: highPrice, low_price: lowPrice, market_warning: marketWarning, signed_change_price: changePrice, signed_change_rate: changeRate, market_state: marketState, acc_trade_volume: volume, change, timestamp, } = JSON.parse(enc.decode(arr));
        const symbol = code.slice(code.indexOf('-') + 1, code.length);
        if (code === 'KRW-BTC' && symbol === 'BTC') {
            this.btcKrw = tradePrice;
        }
        if (code === `KRW-${symbol}`) {
            this.data.krw[symbol] = {
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
            this.data.usdt[symbol] = {
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
        if (code === `BTC-${symbol}`) {
            this.data.btc[symbol] = {
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
    }
    onClose() {
        const connect = this.onConnect;
        this.isConnected = false;
        if (this.retry) {
            setTimeout(() => connect(this.socket), 3000);
            return;
        }
        this.retry = true;
        connect(this.socket);
    }
    onError() {
        this.isConnected = false;
    }
}
