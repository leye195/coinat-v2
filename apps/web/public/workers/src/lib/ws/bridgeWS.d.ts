import type { TickerPayload } from '@/lib/ticker-source/types';
export interface BridgeConfig {
    /** e.g. wss://coinat.duckdns.org */
    wsBase: string;
    token: string;
    /** symbol filter; empty/omitted = all symbols */
    symbols?: string[];
}
export default class BridgeWebSocket {
    private _socket;
    private _isClosed;
    private _reconnectTimer;
    private _backoff;
    private _book;
    private readonly _url;
    constructor({ wsBase, token, symbols }: BridgeConfig);
    private connect;
    private onMessage;
    private onClose;
    /** Latest snapshot in the legacy TickerPayload shape. */
    getPayload(): TickerPayload;
    /** Permanently close the socket and stop reconnecting. */
    close(): void;
}
//# sourceMappingURL=bridgeWS.d.ts.map