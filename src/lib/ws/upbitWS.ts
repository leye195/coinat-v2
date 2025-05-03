import { getUpbitCoins } from '@/api';
import { UpbitCoin } from '@/types/Coin';
import { Exchange } from '@/types/Ticker';

const UPBIT_SOCKET_URL = 'wss://api.upbit.com/websocket/v1';

interface UpbitTickerData {
  code: string;
  trade_price: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  market_warning: string;
  signed_change_price: number;
  signed_change_rate: number;
  market_state: string;
  acc_trade_volume: number;
  change: string;
  timestamp: number;
}

export default class UpbitWebSocket {
  private _isConnected = false;
  private _retry = false;
  private _socket: WebSocket;
  public data: Exchange['upbit'];
  public btcKrw: number = 0;

  constructor() {
    this._isConnected = false;
    this._retry = false;

    const socket = new WebSocket(UPBIT_SOCKET_URL);
    socket.binaryType = 'arraybuffer';

    this.data = { krw: {}, usdt: {}, btc: {} };
    this._socket = socket;

    this.onConnect(socket);
  }

  private parseTickerData(data: ArrayBuffer): UpbitTickerData {
    const enc = new TextDecoder('utf-8');
    const arr = new Uint8Array(data);
    return JSON.parse(enc.decode(arr));
  }

  private updateTickerData(
    symbol: string,
    data: UpbitTickerData,
    market: 'krw' | 'usdt' | 'btc',
  ) {
    const {
      trade_price: tradePrice,
      opening_price: openPrice,
      high_price: highPrice,
      low_price: lowPrice,
      market_warning: marketWarning,
      signed_change_price: changePrice,
      signed_change_rate: changeRate,
      market_state: marketState,
      acc_trade_volume: volume,
      change,
      timestamp,
    } = data;

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

  onConnect(socket: WebSocket) {
    if (this._isConnected) return;

    socket.onopen = () => this.onOpen(socket);
    socket.onmessage = (e) => this.onMessage(e);
    socket.onclose = () => this.onClose();
    socket.onerror = (e) => this.onError(e);
  }

  async onOpen(socket: WebSocket) {
    const upbitList = (await getUpbitCoins()).data.filter(
      (coin: UpbitCoin) =>
        coin.market.includes('KRW-') || coin.market.includes('BTC-'),
    );

    this._isConnected = true;
    const data = [
      { ticket: 'coin-at' },
      {
        type: 'ticker',
        codes: ['KRW-BTC', ...upbitList.map((coin: UpbitCoin) => coin.market)],
      },
    ];

    socket.send(JSON.stringify(data));
  }

  onMessage(e: any) {
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
    this._isConnected = false;

    if (this._retry) {
      setTimeout(() => this.onConnect(this._socket), 3000);
      return;
    }

    this._retry = true;
    this.onConnect(this._socket);
  }

  onError(error: Event) {
    console.error('[error] Binance:', error);
    this._isConnected = false;
  }
}
