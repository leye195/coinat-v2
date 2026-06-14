export interface UnifiedTicker {
  symbol: string;
  exchange: 'upbit' | 'binance';
  quote: 'KRW' | 'USDT' | 'BTC';
  tradePrice: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  changePrice: number;
  changeRate: number; // decimal (0.0123 = +1.23%) for BOTH exchanges
  marketWarning: string; // binance: always 'NONE'
  change?: string; // upbit only: 'RISE' | 'EVEN' | 'FALL'
  marketState?: string; // upbit only
  volume?: number;
  timestamp?: number;
}

export type ServerMessage =
  | { type: 'snapshot'; data: UnifiedTicker[] }
  | { type: 'ticker'; data: UnifiedTicker };
