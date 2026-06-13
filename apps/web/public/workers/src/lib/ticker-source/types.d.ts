import { Exchange } from '@/types/Ticker';
/**
 * Snapshot of both exchanges' tickers, broadcast by every ticker source.
 * Matches the payload produced by `workers/shared.worker.ts`.
 */
export type TickerPayload = {
    upbit: {
        data: Exchange['upbit'];
        btcKrw: number;
    };
    binance: {
        data: Exchange['binance'];
        btcKrw: number;
    };
};
export type TickerListener = (payload: TickerPayload) => void;
/** Called by a source when it fails to start/deliver, so the factory can downgrade. */
export type TickerSourceErrorHandler = () => void;
export interface TickerSource {
    /** Ask for the latest snapshot; it is delivered through the listener passed at creation. */
    requestTickers(): void;
    /** Tear the source down (close port / terminate worker). */
    disconnect(): void;
}
export type TickerSourceKind = 'shared-worker' | 'dedicated-worker' | 'main-thread';
//# sourceMappingURL=types.d.ts.map