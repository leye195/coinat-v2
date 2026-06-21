// src/lib/browser-port.ts
var BrowserPort = class {
  constructor(port) {
    this.weakRef = new WeakRef(port);
    port.start();
  }
  isAlive() {
    return !!this.weakRef.deref();
  }
  postMessage(message) {
    this.weakRef.deref()?.postMessage(message);
  }
  addEventListener(event, handler) {
    this.weakRef.deref()?.addEventListener(event, handler);
  }
  removeEventListener(event, handler) {
    this.weakRef.deref()?.removeEventListener(event, handler);
  }
  close() {
    this.weakRef.deref()?.close();
  }
};

// src/lib/ws/bridgeMapper.ts
var bookKey = (t) => `${t.exchange}:${t.symbol}:${t.quote}`;
function createBook() {
  return /* @__PURE__ */ new Map();
}
function applyTicker(book, t) {
  book.set(bookKey(t), t);
}
function toEntry(t) {
  return {
    tradePrice: t.tradePrice,
    highPrice: t.highPrice,
    lowPrice: t.lowPrice,
    openPrice: t.openPrice,
    marketWarning: t.marketWarning,
    changePrice: t.changePrice,
    // Bridge sends decimal for both exchanges. The legacy Binance client stored a
    // percent (Binance `P`), so multiply binance by 100 to keep consumers unchanged.
    changeRate: t.exchange === "binance" ? t.changeRate * 100 : t.changeRate,
    change: t.change,
    marketState: t.marketState,
    volume: t.volume,
    timestamp: t.timestamp
  };
}
function buildPayload(book) {
  const payload = {
    upbit: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
    binance: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 }
  };
  for (const t of book.values()) {
    const entry = toEntry(t);
    const sym = t.symbol;
    if (t.exchange === "upbit") {
      if (t.quote === "KRW") {
        payload.upbit.data.krw[sym] = entry;
        payload.upbit.data.usdt[sym] = entry;
        if (sym === "BTC") payload.upbit.btcKrw = t.tradePrice;
      } else if (t.quote === "BTC") {
        payload.upbit.data.btc[sym] = entry;
      } else {
        payload.upbit.data.usdt[sym] = entry;
      }
    } else {
      if (t.quote === "USDT") {
        if (sym === "BTC") {
          payload.binance.data.btc.BTC = entry;
          payload.binance.btcKrw = t.tradePrice;
        } else {
          payload.binance.data.usdt[sym] = entry;
        }
      } else if (t.quote === "BTC") {
        payload.binance.data.btc[sym] = entry;
      }
    }
  }
  return payload;
}

// src/lib/ws/bridgeWS.ts
var MAX_BACKOFF = 3e4;
var BridgeWebSocket = class {
  constructor({ wsBase, token, symbols = [] }) {
    this._socket = null;
    this._isClosed = false;
    this._reconnectTimer = null;
    this._backoff = 1e3;
    this._book = createBook();
    const params = new URLSearchParams({ token });
    if (symbols.length) params.set("symbols", symbols.join(","));
    this._url = `${wsBase}/bridge/ws?${params.toString()}`;
    this.connect();
  }
  connect() {
    if (this._isClosed) return;
    if (!this._url.startsWith("ws://") && !this._url.startsWith("wss://")) {
      console.error(
        "[BridgeWebSocket] invalid ws url, not connecting:",
        this._url
      );
      this._isClosed = true;
      return;
    }
    let socket;
    try {
      socket = new WebSocket(this._url);
    } catch (error) {
      console.error("[BridgeWebSocket] failed to open ws:", error);
      this._isClosed = true;
      return;
    }
    this._socket = socket;
    socket.onopen = () => {
      this._backoff = 1e3;
    };
    socket.onmessage = (e) => this.onMessage(e);
    socket.onclose = () => this.onClose();
    socket.onerror = () => {
      try {
        socket.close();
      } catch {
      }
    };
  }
  onMessage(e) {
    let msg;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }
    if (!msg || typeof msg !== "object") return;
    if (msg.type === "snapshot" && Array.isArray(msg.data)) {
      for (const t of msg.data) {
        if (t && typeof t === "object") applyTicker(this._book, t);
      }
    } else if (msg.type === "ticker" && msg.data && typeof msg.data === "object") {
      applyTicker(this._book, msg.data);
    }
  }
  onClose() {
    if (this._isClosed) return;
    this._socket = null;
    if (this._reconnectTimer) clearTimeout(this._reconnectTimer);
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
      } catch {
      }
      this._socket = null;
    }
  }
};

// src/lib/ws/bridgeWorkerCore.ts
var BridgeWorkerCore = class {
  constructor() {
    this.bridge = null;
  }
  /** Construct the bridge socket once, from the config the main thread inlines. */
  init(payload) {
    if (!this.bridge && payload) {
      this.bridge = new BridgeWebSocket(payload);
    }
  }
  /** Latest snapshot, or an empty payload if the bridge has not been initialised. */
  payload() {
    return this.bridge ? this.bridge.getPayload() : buildPayload(createBook());
  }
};

// src/lib/ws/worker-messages.ts
var WorkerMsg = {
  Init: "init",
  Ping: "ping",
  Pong: "pong",
  Disconnect: "disconnect",
  Tickers: "tickers"
};

// workers/shared.worker.ts
var _self = self;
var core = new BridgeWorkerCore();
var ports = [];
_self.onconnect = (e) => {
  const port = new BrowserPort(e.ports[0]);
  ports.push(port);
  console.log("Port connected:", port);
  port.addEventListener("message", (e2) => {
    const { type, payload } = e2.data;
    if (type === WorkerMsg.Init) {
      core.init(payload);
      return;
    }
    if (type === WorkerMsg.Ping) {
      ports.forEach((p) => p.postMessage({ type: WorkerMsg.Pong }));
      return;
    }
    if (type === WorkerMsg.Disconnect) {
      ports = ports.filter((p) => p !== port);
      port.close();
      console.log("Port disconnected:", port);
      return;
    }
    if (type === WorkerMsg.Tickers) {
      try {
        const data = core.payload();
        const alive = [];
        ports.forEach((p) => {
          try {
            p.postMessage({ type: WorkerMsg.Tickers, payload: data });
            alive.push(p);
          } catch (error) {
            console.error("Dropping unreachable port:", error);
            try {
              p.close();
            } catch {
            }
          }
        });
        ports = alive;
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  });
};
