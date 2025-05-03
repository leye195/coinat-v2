import { getCoins } from '@/lib/coin';
import { Coin } from '@/types/Coin';
import { Exchange } from '@/types/Ticker';

const BINANCE_SOCKET_URL = 'wss://stream.binance.com:9443/stream?streams=';

interface BinanceTickerData {
  data: {
    s: string; // symbol
    c: string; // current price
    h: number; // high price
    l: number; // low price
    o: number; // open price
    p: number; // price change
    P: number; // price change percent
  };
}

export default class BinanceWebSocket {
  private _isConnected = false;
  private _retry = false;
  private _socket: WebSocket | null;
  public data: Exchange['binance'];
  public btcKrw: number = 0; //btc 가격

  constructor() {
    this._isConnected = false;
    this._retry = false;
    this._socket = null;
    this.data = { krw: {}, usdt: {}, btc: {} };

    this.onConnect();
  }

  private parseTickerData(data: string): BinanceTickerData {
    return JSON.parse(data);
  }

  private updateTickerData(
    symbol: string,
    data: BinanceTickerData['data'],
    market: 'btc' | 'usdt',
  ) {
    const { c, h, l, o, p, P } = data;

    this.data[market][symbol] = {
      tradePrice: parseFloat(c ?? 0),
      highPrice: h ?? 0,
      lowPrice: l ?? 0,
      openPrice: o ?? 0,
      marketWarning: 'None',
      changePrice: p,
      changeRate: P,
    };
  }

  async onConnect() {
    if (this._isConnected) return;

    const krw = await getCoins('KRW');
    const btc = await getCoins('BTC');
    const usdt = await getCoins('USDT');

    const streams = `${[...krw, ...btc, ...usdt]
      .map(
        (coin: Coin) =>
          `${coin.name.toLowerCase()}${coin.USDT ? 'usdt' : 'btc'}@ticker/`,
      )
      .join('')}btcusdt@ticker`;

    const socket = new WebSocket(`${BINANCE_SOCKET_URL}${streams}`);
    this._socket = socket;
    this._isConnected = true;

    socket.onopen = () => this.onOpen();
    socket.onmessage = (e) => this.onMessage(e);
    socket.onclose = () => this.onClose();
    socket.onerror = (e) => this.onError(e);
  }

  onOpen() {}

  onMessage(e: any) {
    const { data } = this.parseTickerData(e.data);
    const { s, c } = data;
    const symbol = s.slice(0, s.length - 3);

    if (s.startsWith('BTCUSDT')) {
      this.btcKrw = parseFloat(c ?? 0);
      this.updateTickerData(s.slice(0, s.length - 4), data, 'btc');
    } else if (s.endsWith('BTC')) {
      this.updateTickerData(symbol, data, 'btc');
    } else if (s.endsWith('USDT')) {
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

  onError(error: Event) {
    console.error('[ws error] Binance:', error);
    this._isConnected = false;
  }
}
