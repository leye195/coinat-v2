export type Exchange = Record<
  'upbit' | 'binance',
  {
    krw: Ticker;
    btc: Ticker;
  }
>;

export type Ticker = Record<
  string,
  {
    tradePrice: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    marketWarning: string;
    changePrice: number;
    changeRate: number;
    change?: string;
    marketState?: string;
    volume?: number;
    timestamp?: number;
  }
>;
