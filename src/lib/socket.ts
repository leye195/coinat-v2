import api from 'axios';
import type { Coin, UpbitCoin } from 'types/Coin';
import type { Exchange } from 'types/Ticker';

type OpenCallback = (socket: WebSocket) => void;
type MessageCallback = (e: MessageEvent<any>) => void;

const tickers: Exchange = {
  upbit: {
    krw: {},
    btc: {},
  },
  binance: {
    krw: {},
    btc: {},
  },
};
const btcKrw = {
  upbit: 0, //krw
  binance: 0, // btc
};

const UPBIT_SOCKET = 'wss://api.upbit.com/websocket/v1';
const BINANCE_SOCKET = 'wss://stream.binance.com:9443/stream?streams=';

const onUpbitOpen = () => async (socket: WebSocket) => {
  const upbitList = (
    await api.get('https://api.upbit.com/v1/market/all')
  ).data.filter(
    (coin: UpbitCoin) =>
      coin.market.includes('KRW-') || coin.market.includes('BTC-'),
  );

  const data = [
    { ticket: 'coin-at' },
    {
      type: 'ticker',
      codes: [
        'KRW-BTC',
        ...upbitList.map((coin: UpbitCoin) => `${coin.market}`),
      ],
    },
  ];

  socket.send(JSON.stringify(data));
};

const handleUpbitMessage = (e: any) => {
  const enc = new TextDecoder('utf-8');
  const arr = new Uint8Array(e.data);
  const {
    code,
    trade_price: tradePrice,
    opening_price: openPrice,
    high_price: highPrice,
    low_price: lowPrice,
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
    };
  }

  if (code === `BTC-${symbol}`) {
    tickers.upbit.btc[symbol] = {
      tradePrice,
      highPrice,
      lowPrice,
      openPrice,
    };
  }
};

const onBinanceOpen = () => async (socket: WebSocket) => {};

const connect = (
  url: string,
  onOpen?: OpenCallback,
  onMessage?: MessageCallback,
  binaryType?: BinaryType,
) => {
  let retry = false;
  const socket = new WebSocket(url);

  if (binaryType) socket.binaryType = binaryType;

  if (!!onOpen)
    socket.onopen = () => {
      console.log(`connected to ${url}`);
      onOpen(socket);
    };

  if (!!onMessage) {
    socket.onmessage = onMessage;
  }

  socket.onclose = () => {
    console.log('reconnecting socket');
    if (retry) {
      setTimeout(() => connect(url), 3000);
      return;
    }

    retry = true;
    connect(url);
  };
};

export const initSocket = () => {
  //upbit
  connect(UPBIT_SOCKET, onUpbitOpen, handleUpbitMessage, 'arraybuffer');

  // binance;
  connect(BINANCE_SOCKET, onBinanceOpen);
};

export const combineTickers = () => {
  return {};
};
