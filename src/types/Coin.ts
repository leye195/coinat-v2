export type Coin = {
  name: string;
  KRW: boolean;
  BTC: boolean;
  img: string;
  upbit: boolean;
  binance: boolean;
  bithumb: boolean;
  createdAt: string;
};

export type UpbitCoin = {
  market: string;
  korean_name: string;
  english_name: string;
};

export type TickerType = 'KRW' | 'BTC';
