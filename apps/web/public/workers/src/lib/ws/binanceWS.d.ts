import { Exchange } from '@/types/Ticker';
export default class BinanceWebSocket {
    private _isConnected;
    private _socket;
    data: Exchange['binance'];
    btcKrw: number;
    constructor();
    private parseTickerData;
    private updateTickerData;
    private reconnect;
    onConnect(): Promise<void>;
    onOpen(): void;
    onMessage(e: any): void;
    onClose(): void;
    onError(error: Event): void;
}
//# sourceMappingURL=binanceWS.d.ts.map