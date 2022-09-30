import api from 'axios';
import { getPercent } from '@/lib/utils';
import type { Coin, UpbitCoin } from 'types/Coin';
import type { Exchange } from 'types/Ticker';

export type Rate = {
  upbit: number;
  binance: number;
};
export type CombinedTickers = {
  symbol: string;
  last: number;
  blast: number;
  convertedBlast?: number;
  per?: number;
};

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

const btcKrw: Rate = {
  upbit: 0, //krw
  binance: 0, // btc
};

const UPBIT_SOCKET = 'wss://api.upbit.com/websocket/v1';
const BINANCE_SOCKET = 'wss://stream.binance.com:9443/stream?streams=';

const onUpbitOpen = async (socket: WebSocket) => {
  const upbitList = (
    await api.get('https://api.upbit.com/v1/market/all')
  ).data.filter(
    (coin: UpbitCoin) =>
      coin.market.includes('KRW-') || coin.market.includes('BTC-'),
  );

  console.log('upbit connected');

  const data = [
    { ticket: 'coin-at' },
    {
      type: 'ticker',
      codes: ['KRW-BTC', ...upbitList.map((coin: UpbitCoin) => coin.market)],
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

const onBinanceOpen = async (socket: WebSocket) => {
  console.log('binance connected');
};

const handleBinanceMessage = (e: any) => {
  const {
    data: { s, c, h, l, o },
  } = JSON.parse(e.data);

  const symbol = s.slice(0, s.length - 3);
  if (symbol === 'BTCU') {
    btcKrw.binance = parseFloat(c ?? 0);
    tickers.binance.btc[s.slice(0, s.length - 4)] = {
      tradePrice: parseFloat(c ?? 0),
      highPrice: h ?? 0,
      lowPrice: l ?? 0,
      openPrice: o ?? 0,
    };
  } else {
    tickers.binance.btc[symbol] = {
      tradePrice: parseFloat(c ?? 0),
      highPrice: h ?? 0,
      lowPrice: l ?? 0,
      openPrice: o ?? 0,
    };
  }
};

const connect = (
  url: string,
  onOpen?: OpenCallback,
  onMessage?: MessageCallback,
  binaryType?: BinaryType,
) => {
  let retry = false;
  const socket = new WebSocket(url);

  if (binaryType) socket.binaryType = binaryType;

  if (!!onOpen) {
    socket.onopen = function () {
      console.log(`connected to ${url}`);
      onOpen(this);
    };
  }

  if (!!onMessage) {
    socket.onmessage = function (e) {
      onMessage(e);
    };
  }

  socket.onclose = function () {
    console.log('reconnecting socket');
    if (retry) {
      setTimeout(() => connect(url), 3000);
      return;
    }

    retry = true;
    connect(url);
  };
};

export const initSocket = (coinList: Coin[]) => {
  //upbit
  connect(UPBIT_SOCKET, onUpbitOpen, handleUpbitMessage, 'arraybuffer');

  // binance
  const streams = `${coinList
    .map((coin: Coin) => `${coin.name.toLowerCase()}btc@ticker/`)
    .join('')}btcusdt@ticker`;

  connect(`${BINANCE_SOCKET}${streams}`, onBinanceOpen, handleBinanceMessage);
};

export const combineTickers = (coinList: Coin[], type?: string) => {
  const result: CombinedTickers[] = [{ name: 'BTC' }, ...coinList].map(
    ({ name }) => {
      if (type === 'KRW' || name === 'BTC') {
        return {
          symbol: name,
          last:
            tickers.upbit.krw[name] === undefined
              ? 0
              : tickers.upbit.krw[name].tradePrice,
          blast:
            tickers.binance.btc[name] === undefined
              ? 0
              : tickers.binance.btc[name].tradePrice,
          convertedBlast:
            tickers.binance.btc[name] === undefined
              ? 0
              : parseFloat(
                  (tickers.binance.btc[name].tradePrice * btcKrw.upbit).toFixed(
                    2,
                  ),
                ),
          per:
            tickers.upbit.krw[name] === undefined ||
            tickers.binance.btc[name] === undefined
              ? undefined
              : getPercent(
                  tickers.upbit.krw[name].tradePrice,
                  parseFloat(
                    (
                      tickers.binance.btc[name].tradePrice * btcKrw.upbit
                    ).toFixed(2),
                  ),
                ),
        };
      }

      return {
        symbol: name,
        last:
          tickers.upbit.btc[name] === undefined
            ? 0
            : tickers.upbit.btc[name].tradePrice,
        blast:
          tickers.binance.btc[name] === undefined
            ? 0
            : tickers.upbit.btc[name].tradePrice,

        per:
          tickers.upbit.btc[name] === undefined ||
          tickers.binance.btc[name] === undefined
            ? undefined
            : getPercent(
                tickers.upbit.btc[name].tradePrice,
                tickers.binance.btc[name].tradePrice,
              ),
      };
    },
  );

  return result;
};
