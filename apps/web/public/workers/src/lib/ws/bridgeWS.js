import { applyTicker, buildPayload, createBook, } from './bridgeMapper';
const MAX_BACKOFF = 30000;
export default class BridgeWebSocket {
    constructor({ wsBase, token, symbols = [] }) {
        this._socket = null;
        this._isClosed = false;
        this._reconnectTimer = null;
        this._backoff = 1000;
        this._book = createBook();
        const params = new URLSearchParams({ token });
        if (symbols.length)
            params.set('symbols', symbols.join(','));
        this._url = `${wsBase}/bridge/ws?${params.toString()}`;
        this.connect();
    }
    connect() {
        if (this._isClosed)
            return;
        const socket = new WebSocket(this._url);
        this._socket = socket;
        socket.onopen = () => {
            this._backoff = 1000;
        };
        socket.onmessage = (e) => this.onMessage(e);
        socket.onclose = () => this.onClose();
        socket.onerror = () => {
            try {
                socket.close();
            }
            catch (_a) {
                // ignore
            }
        };
    }
    onMessage(e) {
        let msg;
        try {
            msg = JSON.parse(e.data);
        }
        catch (_a) {
            return;
        }
        // Defensive: a malformed frame must not reach the mapper as undefined.
        if (msg.type === 'snapshot' && Array.isArray(msg.data)) {
            for (const t of msg.data)
                applyTicker(this._book, t);
        }
        else if (msg.type === 'ticker' && msg.data) {
            applyTicker(this._book, msg.data);
        }
    }
    onClose() {
        if (this._isClosed)
            return;
        this._socket = null;
        this._reconnectTimer = setTimeout(() => {
            this._backoff = Math.min(this._backoff * 2, MAX_BACKOFF);
            this.connect();
        }, this._backoff);
    }
    /** Latest snapshot in the legacy TickerPayload shape. */
    getPayload() {
        return buildPayload(this._book);
    }
    /** Permanently close the socket and stop reconnecting. */
    close() {
        this._isClosed = true;
        if (this._reconnectTimer) {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }
        if (this._socket) {
            this._socket.onopen = null;
            this._socket.onmessage = null;
            this._socket.onclose = null;
            this._socket.onerror = null;
            try {
                this._socket.close();
            }
            catch (_a) {
                // ignore
            }
            this._socket = null;
        }
    }
}
