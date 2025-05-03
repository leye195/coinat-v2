import { getUpbitCoins } from '@/api';
import type { Coin, UpbitCoin } from '@/types/Coin';
import type { Exchange } from '@/types/Ticker';

type Rate = {
  upbit: number;
  binance: number;
};

type OpenCallback = (socket: WebSocket) => void;
type MessageCallback = (e: MessageEvent<any>) => void;

export const tickers: Exchange = {
  upbit: {
    krw: {},
    btc: {},
    usdt: {},
  },
  binance: {
    krw: {},
    btc: {},
    usdt: {},
  },
};

export const btcKrw: Rate = {
  upbit: 0, //krw
  binance: 0, // btc
};

let upbitConnected = false;
let binanceConnected = false;

const UPBIT_SOCKET = 'wss://api.upbit.com/websocket/v1';
const BINANCE_SOCKET = 'wss://stream.binance.com:9443/stream?streams=';

const onUpbitOpen = async (socket: WebSocket) => {
  const upbitList = (await getUpbitCoins()).data.filter(
    (coin: UpbitCoin) =>
      coin.market.includes('KRW-') || coin.market.includes('BTC-'),
  );

  console.log('upbit connected');
  upbitConnected = true;

  const data = [
    { ticket: 'coin-at' },
    {
      type: 'ticker',
      codes: ['KRW-BTC', ...upbitList.map((coin: UpbitCoin) => coin.market)],
    },
  ];

  socket.send(JSON.stringify(data));
};

const handleUpbitMessage = (_cb?: () => void) => (e: any) => {
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
    btcKrw.upbit = tradePrice;
  }

  if (code === `KRW-${symbol}`) {
    tickers.upbit.krw[symbol] = {
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
    tickers.upbit.usdt[symbol] = {
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
    tickers.upbit.btc[symbol] = {
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
};

const onBinanceOpen = async (_socket: WebSocket) => {
  console.log('binance connected');
  binanceConnected = true;
};

const handleBinanceMessage = (_cb?: () => void) => (e: any) => {
  const {
    data: { s, c, h, l, o, p, P },
  } = JSON.parse(e.data);

  const symbol = s.slice(0, s.length - 3);

  if (s.startsWith('BTCUSDT')) {
    btcKrw.binance = parseFloat(c ?? 0);
    tickers.binance.btc[s.slice(0, s.length - 4)] = {
      tradePrice: parseFloat(c ?? 0),
      highPrice: h ?? 0,
      lowPrice: l ?? 0,
      openPrice: o ?? 0,
      marketWarning: 'None',
      changePrice: p,
      changeRate: P,
    };
  } else if (s.endsWith('BTC')) {
    tickers.binance.btc[symbol] = {
      tradePrice: parseFloat(c ?? 0),
      highPrice: h ?? 0,
      lowPrice: l ?? 0,
      openPrice: o ?? 0,
      marketWarning: 'None',
      changePrice: p,
      changeRate: P,
    };
  } else if (s.endsWith('USDT')) {
    tickers.binance.usdt[s.slice(0, s.length - 4)] = {
      tradePrice: parseFloat(c ?? 0),
      highPrice: h ?? 0,
      lowPrice: l ?? 0,
      openPrice: o ?? 0,
      marketWarning: 'None',
      changePrice: p,
      changeRate: P,
    };
  }
};

const connect = (
  url: string,
  onOpen?: OpenCallback,
  onMessage?: MessageCallback,
  binaryType?: BinaryType,
) => {
  if (url.includes(UPBIT_SOCKET) && upbitConnected) {
    console.log('Upbit socket is already connected.');
    return; // Exit if Upbit is already connected
  }

  if (url.includes(BINANCE_SOCKET) && binanceConnected) {
    console.log('Binance socket is already connected.');
    return; // Exit if Binance is already connected
  }

  let retry = false;
  const socket = new WebSocket(url);

  if (binaryType) socket.binaryType = binaryType;

  socket.onopen = function () {
    console.log(`connected to ${url}`);
    onOpen?.(this);
  };

  socket.onmessage = function (e) {
    onMessage?.(e);
  };

  socket.onclose = function () {
    console.log('reconnecting socket');
    if (retry) {
      setTimeout(() => connect(url), 3000);
      return;
    }

    retry = true;
    connect(url);
  };

  socket.onerror = function () {
    upbitConnected = false;
    binanceConnected = false;
  };
};

export const connectUpbitSocket = () => {
  connect(UPBIT_SOCKET, onUpbitOpen, handleUpbitMessage(), 'arraybuffer');
};

export const connectBinanceSocket = (coinList: Coin[]) => {
  const streams = `${coinList
    .map(
      (coin: Coin) =>
        `${coin.name.toLowerCase()}${coin.USDT ? 'usdt' : 'btc'}@ticker/`,
    )
    .join('')}btcusdt@ticker`;

  connect(`${BINANCE_SOCKET}${streams}`, onBinanceOpen, handleBinanceMessage());
};

export const initSocket = (coinList: Coin[]) => {
  //upbit
  connectUpbitSocket();

  // binance
  connectBinanceSocket(coinList);
};

export const getTickers = () => {
  return tickers;
};
