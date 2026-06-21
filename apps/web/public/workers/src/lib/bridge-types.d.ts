export interface UnifiedTicker {
    symbol: string;
    exchange: 'upbit' | 'binance';
    quote: 'KRW' | 'USDT' | 'BTC';
    tradePrice: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    changePrice: number;
    changeRate: number;
    marketWarning: string;
    change?: string;
    marketState?: string;
    volume?: number;
    timestamp?: number;
}
export type ServerMessage = {
    type: 'snapshot';
    data: UnifiedTicker[];
} | {
    type: 'ticker';
    data: UnifiedTicker;
};
//# sourceMappingURL=bridge-types.d.ts.map