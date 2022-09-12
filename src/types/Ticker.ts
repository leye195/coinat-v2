export type Exchange = {
  upbit: {
    krw: Ticker;
    btc: Ticker;
  };
  binance: {
    krw: Ticker;
    btc: Ticker;
  };
};

export type Ticker = {
  [key in string]: {
    tradePrice: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
  };
};
