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
        // A missing/misconfigured wsBase yields a non-ws URL; `new WebSocket` would
        // throw a DOMException. Bail (and stop reconnecting) instead of crashing the
        // worker/main thread — the ticker-source factory then degrades to the next tier.
        if (!this._url.startsWith('ws://') && !this._url.startsWith('wss://')) {
            console.error('[BridgeWebSocket] invalid ws url, not connecting:', this._url);
            this._isClosed = true;
            return;
        }
        // Even a well-formed ws/wss url can throw (CSP/SecurityError, port limits).
        // Stop reconnecting and let the ticker-source factory degrade to the next tier.
        let socket;
        try {
            socket = new WebSocket(this._url);
        }
        catch (error) {
            console.error('[BridgeWebSocket] failed to open ws:', error);
            this._isClosed = true;
            return;
        }
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
        // Defensive: `JSON.parse('null')` / a primitive frame would throw on the
        // `.type` access below, so bail unless we got an object.
        if (!msg || typeof msg !== 'object')
            return;
        // Defensive: a null/non-object item would throw in the mapper (`t.exchange`),
        // so validate each record before it reaches the book.
        if (msg.type === 'snapshot' && Array.isArray(msg.data)) {
            for (const t of msg.data) {
                if (t && typeof t === 'object')
                    applyTicker(this._book, t);
            }
        }
        else if (msg.type === 'ticker' &&
            msg.data &&
            typeof msg.data === 'object') {
            applyTicker(this._book, msg.data);
        }
    }
    onClose() {
        if (this._isClosed)
            return;
        this._socket = null;
        // Guard against stacking timers if onClose fires again before the pending
        // reconnect runs — only one reconnect should ever be in flight.
        if (this._reconnectTimer)
            clearTimeout(this._reconnectTimer);
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
