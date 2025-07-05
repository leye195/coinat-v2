export type CandleType = 'minutes' | 'days' | 'weeks' | 'months';
export type FearGreed = {
    name: string;
    data: Array<Record<'value' | 'value_classification' | 'timestamp' | 'time_until_update', string>>;
};
export type UpbitCandle = {
    market: string;
    candle_date_time_utc: string;
    candle_date_time_kst: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    timestamp: number;
    candle_acc_trade_price: number;
    candle_acc_trade_volume: number;
    prev_closing_price?: number;
    change_price?: number;
    change_rate?: number;
    converted_trade_price?: number;
    unit?: number;
    first_day_of_period?: number;
};
export type UpbitCandlesParams = {
    market: string;
    candleType: CandleType;
    count: number;
    minute?: number;
    to?: string;
};
export type BinanceCandlesParams = {
    symbol: string;
    interval: CandleType;
};
export type ChartData = {
    close: number;
    high: number;
    low: number;
    open: number;
    timestamp: number;
};
export type TradingViewCandle = {
    close: number;
    high: number;
    low: number;
    open: number;
    time: string;
};
//# sourceMappingURL=Candle.d.ts.map