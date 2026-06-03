import { Exchange } from '@/types/Ticker';
export default class UpbitWebSocket {
    private _isConnected;
    private _socket;
    private _isClosed;
    private _reconnectTimer;
    data: Exchange['upbit'];
    btcKrw: number;
    constructor();
    private parseTickerData;
    private updateTickerData;
    private reconnect;
    onConnect(socket: WebSocket): void;
    onOpen(socket: WebSocket): Promise<void>;
    onMessage(e: any): void;
    onClose(): void;
    onError(error: Event): void;
    /** Permanently close the socket and stop reconnecting. */
    close(): void;
}
//# sourceMappingURL=upbitWS.d.ts.map