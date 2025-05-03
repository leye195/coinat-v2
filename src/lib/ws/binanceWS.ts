import { getCoins } from '@/lib/coin';
import { Coin } from '@/types/Coin';
import { Exchange } from '@/types/Ticker';

const BINANCE_SOCKET_URL = 'wss://stream.binance.com:9443/stream?streams=';

export default class BinanceWebSocket {
  private isConnected = false;
  private retry = false;
  private socket: WebSocket | null;
  public data: Exchange['binance'];
  public btcKrw: number = 0; //btc 가격

  constructor() {
    this.isConnected = false;
    this.retry = false;
    this.socket = null;
    this.data = { krw: {}, usdt: {}, btc: {} };

    this.onConnect();
  }

  async onConnect() {
    if (this.isConnected) return;

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
    this.socket = socket;
    this.isConnected = true;

    socket.onopen = () => this.onOpen();
    socket.onmessage = (e) => this.onMessage(e);
    socket.onclose = () => this.onClose();
    socket.onerror = () => this.onError();
  }

  onOpen() {}

  onMessage(e: any) {
    const {
      data: { s, c, h, l, o, p, P },
    } = JSON.parse(e.data);

    const symbol = s.slice(0, s.length - 3);

    if (s.startsWith('BTCUSDT')) {
      this.btcKrw = parseFloat(c ?? 0);
      this.data.btc[s.slice(0, s.length - 4)] = {
        tradePrice: parseFloat(c ?? 0),
        highPrice: h ?? 0,
        lowPrice: l ?? 0,
        openPrice: o ?? 0,
        marketWarning: 'None',
        changePrice: p,
        changeRate: P,
      };
    } else if (s.endsWith('BTC')) {
      this.data.btc[symbol] = {
        tradePrice: parseFloat(c ?? 0),
        highPrice: h ?? 0,
        lowPrice: l ?? 0,
        openPrice: o ?? 0,
        marketWarning: 'None',
        changePrice: p,
        changeRate: P,
      };
    } else if (s.endsWith('USDT')) {
      this.data.usdt[s.slice(0, s.length - 4)] = {
        tradePrice: parseFloat(c ?? 0),
        highPrice: h ?? 0,
        lowPrice: l ?? 0,
        openPrice: o ?? 0,
        marketWarning: 'None',
        changePrice: p,
        changeRate: P,
      };
    }
  }

  onClose() {
    const connect = this.onConnect;
    this.isConnected = false;

    if (this.retry) {
      setTimeout(() => connect(), 3000);
      return;
    }

    this.retry = true;
    connect();
  }

  onError() {
    this.isConnected = false;
  }
}
