export type Coin = {
  name: string;
  KRW: boolean;
  BTC: boolean;
  img?: string;
  upbit?: boolean;
  binance?: boolean;
  createdAt?: string;
};

export type UpbitCoin = {
  market: string;
  korean_name: string;
  english_name: string;
};

export type TickerType = 'KRW' | 'BTC';

type MarketData = {
  market_cap: string;
  circulating_supply: string;
  date: string;
  contact?: string;
  supply_plan?: Record<'value' | 'link', string>;
};

type BlockInspectorUrl = Record<'value' | 'link', string>;

type MainComponent = {
  type_name: string;
  detail: Record<'subtitle' | 'content', string>;
};

export type CoinInfo = {
  english_name: string;
  korean_name: string;
  symbol: string;
  header_key_values: {};
  block_inspector_urls: BlockInspectorUrl[];
  market_data: Record<
    'coin_market_cap' | 'coin_gecko' | 'project_name',
    MarketData
  >;
  main_components: MainComponent[];
};
