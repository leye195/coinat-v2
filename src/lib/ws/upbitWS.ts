import { getUpbitCoins } from '@/api';
import { UpbitCoin } from '@/types/Coin';
import { Exchange } from '@/types/Ticker';

const UPBIT_SOCKET_URL = 'wss://api.upbit.com/websocket/v1';

export default class UpbitWebSocket {
  private isConnected = false;
  private retry = false;
  private socket: WebSocket;
  public data: Exchange['upbit'];
  public btcKrw: number = 0;

  constructor() {
    this.isConnected = false;
    this.retry = false;

    const socket = new WebSocket(UPBIT_SOCKET_URL);
    socket.binaryType = 'arraybuffer';

    this.data = { krw: {}, usdt: {}, btc: {} };
    this.socket = socket;

    this.onConnect(socket);
  }

  onConnect(socket: WebSocket) {
    if (this.isConnected) return;

    socket.onopen = () => this.onOpen(socket);
    socket.onmessage = (e) => this.onMessage(e);
    socket.onclose = () => this.onClose();
    socket.onerror = () => this.onError();
  }

  async onOpen(socket: WebSocket) {
    const upbitList = (await getUpbitCoins()).data.filter(
      (coin: UpbitCoin) =>
        coin.market.includes('KRW-') || coin.market.includes('BTC-'),
    );

    this.isConnected = true;
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
    const enc = new TextDecoder('utf-8');
    const arr = new Uint8Array(e.data);
    const {
      code,
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
    } = JSON.parse(enc.decode(arr));

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
