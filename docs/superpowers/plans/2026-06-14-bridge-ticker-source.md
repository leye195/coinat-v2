# Bridge-backed Ticker Source Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dual Upbit/Binance WebSocket connections with a single 시세 브릿지 socket, while keeping the existing `TickerPayload` output identical so no consumer code changes.

**Architecture:** A pure mapper (`bridgeMapper.ts`) converts the bridge's `UnifiedTicker` stream into today's `TickerPayload`. A `BridgeWebSocket` class (`bridgeWS.ts`) owns one socket and applies messages into a `book`, exposing `getPayload()`. The existing 3-tier fallback (SharedWorker → Dedicated Worker → main-thread) is preserved, but each tier now builds a single `BridgeWebSocket` instead of two exchange clients. Config (`wsBase`/`token`) is read from `NEXT_PUBLIC_*` env in the Next bundle and passed to workers via an `init` message (workers are compiled by `tsc` and cannot inline env).

**Tech Stack:** Next.js 14, TypeScript, Jest (next/jest + jsdom), Web/SharedWorker, `tsc` worker build.

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `apps/web/.env.development` | Bridge env vars | Modify |
| `apps/web/src/lib/bridge-types.ts` | `UnifiedTicker`, `ServerMessage` types | Create |
| `apps/web/src/lib/ws/bridgeMapper.ts` | Pure `UnifiedTicker` → `TickerPayload` mapping | Create |
| `apps/web/src/lib/ws/bridgeMapper.test.ts` | Mapper unit tests (parity contract) | Create |
| `apps/web/src/lib/ws/bridgeWS.ts` | `BridgeWebSocket` socket lifecycle | Create |
| `apps/web/src/lib/ws/bridgeWS.test.ts` | Socket message-handling tests (mocked WS) | Create |
| `apps/web/workers/shared.worker.ts` | SharedWorker tier | Modify |
| `apps/web/workers/dedicated.worker.ts` | Dedicated Worker tier | Modify |
| `apps/web/src/lib/ticker-source/sharedWorkerSource.ts` | Send `init` config to shared worker | Modify |
| `apps/web/src/lib/ticker-source/dedicatedWorkerSource.ts` | Send `init` config to dedicated worker | Modify |
| `apps/web/src/lib/ticker-source/mainThreadSource.ts` | Build `BridgeWebSocket` directly | Modify |
| `apps/web/src/lib/ticker-source/README.md` | Update data-flow docs | Modify |
| `apps/web/src/lib/ws/upbitWS.ts` | Legacy Upbit client | Delete |
| `apps/web/src/lib/ws/binanceWS.ts` | Legacy Binance client | Delete |
| `apps/web/src/lib/socket.ts` | Dead legacy code (no importers) | Delete |

**All commands run from `apps/web/`** unless noted. Single test file: `pnpm exec jest --ci <path>`. Full suite: `pnpm test:ci`. Lint: `pnpm lint`. Worker build: `pnpm build:workers`.

---

### Task 1: Bridge env vars + types

**Files:**
- Modify: `apps/web/.env.development`
- Create: `apps/web/src/lib/bridge-types.ts`

- [ ] **Step 1: Add env vars**

Append to `apps/web/.env.development`:

```bash
NEXT_PUBLIC_BRIDGE_WS_BASE=wss://coinat.duckdns.org
NEXT_PUBLIC_BRIDGE_HTTP_BASE=https://coinat.duckdns.org
# 별도 안전 채널로 전달받은 토큰으로 교체 (브라우저 번들에 노출되는 "공개망 게이트" 토큰)
NEXT_PUBLIC_BRIDGE_TOKEN=REPLACE_WITH_BRIDGE_TOKEN
```

- [ ] **Step 2: Create the types file**

Create `apps/web/src/lib/bridge-types.ts`:

```ts
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
```

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 4: Commit**

```bash
git add apps/web/.env.development apps/web/src/lib/bridge-types.ts
git commit -m "feat(web): add bridge env vars and UnifiedTicker types"
```

---

### Task 2: Pure mapper (`bridgeMapper.ts`) — parity contract

**Files:**
- Create: `apps/web/src/lib/ws/bridgeMapper.ts`
- Test: `apps/web/src/lib/ws/bridgeMapper.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/lib/ws/bridgeMapper.test.ts`:

```ts
import type { UnifiedTicker } from '@/lib/bridge-types';
import { applyTicker, buildPayload, createBook } from '@/lib/ws/bridgeMapper';

const base = {
  highPrice: 0,
  lowPrice: 0,
  openPrice: 0,
  changePrice: 0,
  marketWarning: 'NONE',
};

const u = (p: Partial<UnifiedTicker> & Pick<UnifiedTicker, 'symbol' | 'exchange' | 'quote' | 'tradePrice'>): UnifiedTicker => ({
  ...base,
  changeRate: 0,
  ...p,
});

describe('bridgeMapper', () => {
  it('returns an empty payload for an empty book', () => {
    const payload = buildPayload(createBook());
    expect(payload).toEqual({
      upbit: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
      binance: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
    });
  });

  it('routes upbit KRW into krw and usdt, and BTC sets btcKrw', () => {
    const book = createBook();
    applyTicker(book, u({ symbol: 'BTC', exchange: 'upbit', quote: 'KRW', tradePrice: 90000000 }));
    applyTicker(book, u({ symbol: 'ETH', exchange: 'upbit', quote: 'KRW', tradePrice: 5000000, changeRate: 0.0123 }));
    const p = buildPayload(book);

    expect(p.upbit.btcKrw).toBe(90000000);
    expect(p.upbit.data.krw.ETH.tradePrice).toBe(5000000);
    expect(p.upbit.data.krw.ETH.changeRate).toBe(0.0123); // upbit decimal preserved
    expect(p.upbit.data.usdt.ETH.tradePrice).toBe(5000000); // legacy copy
  });

  it('routes upbit BTC market into btc', () => {
    const book = createBook();
    applyTicker(book, u({ symbol: 'ETH', exchange: 'upbit', quote: 'BTC', tradePrice: 0.055 }));
    expect(buildPayload(book).upbit.data.btc.ETH.tradePrice).toBe(0.055);
  });

  it('routes binance BTC/USDT into btc[BTC] and sets btcKrw', () => {
    const book = createBook();
    applyTicker(book, u({ symbol: 'BTC', exchange: 'binance', quote: 'USDT', tradePrice: 65000 }));
    const p = buildPayload(book);
    expect(p.binance.btcKrw).toBe(65000);
    expect(p.binance.data.btc.BTC.tradePrice).toBe(65000);
  });

  it('routes binance non-BTC USDT into usdt, BTC market into btc', () => {
    const book = createBook();
    applyTicker(book, u({ symbol: 'ETH', exchange: 'binance', quote: 'USDT', tradePrice: 3500 }));
    applyTicker(book, u({ symbol: 'ETH', exchange: 'binance', quote: 'BTC', tradePrice: 0.054 }));
    const p = buildPayload(book);
    expect(p.binance.data.usdt.ETH.tradePrice).toBe(3500);
    expect(p.binance.data.btc.ETH.tradePrice).toBe(0.054);
  });

  it('multiplies binance changeRate by 100 to preserve legacy percent semantics', () => {
    const book = createBook();
    applyTicker(book, u({ symbol: 'ETH', exchange: 'binance', quote: 'USDT', tradePrice: 3500, changeRate: 0.0123 }));
    expect(buildPayload(book).binance.data.usdt.ETH.changeRate).toBeCloseTo(1.23);
  });

  it('keeps only the latest value per exchange:symbol:quote', () => {
    const book = createBook();
    applyTicker(book, u({ symbol: 'ETH', exchange: 'upbit', quote: 'KRW', tradePrice: 1 }));
    applyTicker(book, u({ symbol: 'ETH', exchange: 'upbit', quote: 'KRW', tradePrice: 2 }));
    expect(buildPayload(book).upbit.data.krw.ETH.tradePrice).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec jest --ci src/lib/ws/bridgeMapper.test.ts`
Expected: FAIL — cannot find module `@/lib/ws/bridgeMapper`.

- [ ] **Step 3: Implement the mapper**

Create `apps/web/src/lib/ws/bridgeMapper.ts`:

```ts
import type { UnifiedTicker } from '@/lib/bridge-types';
import type { TickerPayload } from '@/lib/ticker-source/types';
import type { Ticker } from '@/types/Ticker';

export type BridgeBook = Map<string, UnifiedTicker>;

export const bookKey = (t: UnifiedTicker): string =>
  `${t.exchange}:${t.symbol}:${t.quote}`;

export function createBook(): BridgeBook {
  return new Map();
}

export function applyTicker(book: BridgeBook, t: UnifiedTicker): void {
  book.set(bookKey(t), t);
}

/** Map one bridge record to a legacy ticker entry, preserving exact prior semantics. */
function toEntry(t: UnifiedTicker): Ticker[string] {
  return {
    tradePrice: t.tradePrice,
    highPrice: t.highPrice,
    lowPrice: t.lowPrice,
    openPrice: t.openPrice,
    marketWarning: t.marketWarning,
    changePrice: t.changePrice,
    // Bridge sends decimal for both exchanges. The legacy Binance client stored a
    // percent (Binance `P`), so multiply binance by 100 to keep consumers unchanged.
    changeRate: t.exchange === 'binance' ? t.changeRate * 100 : t.changeRate,
    change: t.change,
    marketState: t.marketState,
    volume: t.volume,
    timestamp: t.timestamp,
  };
}

/** Build today's TickerPayload from the current book (see design §3.2 routing table). */
export function buildPayload(book: BridgeBook): TickerPayload {
  const payload: TickerPayload = {
    upbit: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
    binance: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
  };

  for (const t of book.values()) {
    const entry = toEntry(t);
    const sym = t.symbol;

    if (t.exchange === 'upbit') {
      if (t.quote === 'KRW') {
        payload.upbit.data.krw[sym] = entry;
        payload.upbit.data.usdt[sym] = entry; // legacy: upbit has no USDT market; mirror KRW
        if (sym === 'BTC') payload.upbit.btcKrw = t.tradePrice;
      } else if (t.quote === 'BTC') {
        payload.upbit.data.btc[sym] = entry;
      } else {
        payload.upbit.data.usdt[sym] = entry; // defensive: unexpected upbit USDT
      }
    } else {
      if (t.quote === 'USDT') {
        if (sym === 'BTC') {
          payload.binance.data.btc.BTC = entry;
          payload.binance.btcKrw = t.tradePrice;
        } else {
          payload.binance.data.usdt[sym] = entry;
        }
      } else if (t.quote === 'BTC') {
        payload.binance.data.btc[sym] = entry;
      }
    }
  }

  return payload;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec jest --ci src/lib/ws/bridgeMapper.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/ws/bridgeMapper.ts apps/web/src/lib/ws/bridgeMapper.test.ts
git commit -m "feat(web): add pure bridge ticker mapper with parity tests"
```

---

### Task 3: `BridgeWebSocket` class

**Files:**
- Create: `apps/web/src/lib/ws/bridgeWS.ts`
- Test: `apps/web/src/lib/ws/bridgeWS.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/lib/ws/bridgeWS.test.ts`:

```ts
import type { ServerMessage } from '@/lib/bridge-types';
import BridgeWebSocket from '@/lib/ws/bridgeWS';

class MockWebSocket {
  static last: MockWebSocket | null = null;
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  close = jest.fn();
  constructor(url: string) {
    this.url = url;
    MockWebSocket.last = this;
  }
  emit(msg: ServerMessage) {
    this.onmessage?.({ data: JSON.stringify(msg) });
  }
}

beforeAll(() => {
  (global as unknown as { WebSocket: unknown }).WebSocket = MockWebSocket;
});

beforeEach(() => {
  MockWebSocket.last = null;
});

describe('BridgeWebSocket', () => {
  it('builds the ws url with token and symbols', () => {
    new BridgeWebSocket({ wsBase: 'wss://x', token: 'tok en', symbols: ['BTC', 'ETH'] });
    expect(MockWebSocket.last?.url).toBe('wss://x/bridge/ws?token=tok+en&symbols=BTC%2CETH');
  });

  it('omits symbols when none given', () => {
    new BridgeWebSocket({ wsBase: 'wss://x', token: 't' });
    expect(MockWebSocket.last?.url).toBe('wss://x/bridge/ws?token=t');
  });

  it('applies snapshot then ticker into the payload', () => {
    const bridge = new BridgeWebSocket({ wsBase: 'wss://x', token: 't' });
    const sock = MockWebSocket.last!;
    sock.emit({
      type: 'snapshot',
      data: [
        { symbol: 'BTC', exchange: 'upbit', quote: 'KRW', tradePrice: 9e7, highPrice: 0, lowPrice: 0, openPrice: 0, changePrice: 0, changeRate: 0, marketWarning: 'NONE' },
      ],
    });
    sock.emit({
      type: 'ticker',
      data: { symbol: 'BTC', exchange: 'binance', quote: 'USDT', tradePrice: 65000, highPrice: 0, lowPrice: 0, openPrice: 0, changePrice: 0, changeRate: 0, marketWarning: 'NONE' },
    });

    const p = bridge.getPayload();
    expect(p.upbit.btcKrw).toBe(9e7);
    expect(p.binance.btcKrw).toBe(65000);
  });

  it('close() detaches handlers and closes the socket', () => {
    const bridge = new BridgeWebSocket({ wsBase: 'wss://x', token: 't' });
    const sock = MockWebSocket.last!;
    bridge.close();
    expect(sock.close).toHaveBeenCalled();
    expect(sock.onmessage).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec jest --ci src/lib/ws/bridgeWS.test.ts`
Expected: FAIL — cannot find module `@/lib/ws/bridgeWS`.

- [ ] **Step 3: Implement the class**

Create `apps/web/src/lib/ws/bridgeWS.ts`:

```ts
import type { ServerMessage } from '@/lib/bridge-types';
import type { TickerPayload } from '@/lib/ticker-source/types';
import { applyTicker, buildPayload, createBook, type BridgeBook } from './bridgeMapper';

export interface BridgeConfig {
  /** e.g. wss://coinat.duckdns.org */
  wsBase: string;
  token: string;
  /** symbol filter; empty/omitted = all symbols */
  symbols?: string[];
}

const MAX_BACKOFF = 30_000;

export default class BridgeWebSocket {
  private _socket: WebSocket | null = null;
  private _isClosed = false;
  private _reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private _backoff = 1000;
  private _book: BridgeBook = createBook();
  private readonly _url: string;

  constructor({ wsBase, token, symbols = [] }: BridgeConfig) {
    const params = new URLSearchParams({ token });
    if (symbols.length) params.set('symbols', symbols.join(','));
    this._url = `${wsBase}/bridge/ws?${params.toString()}`;
    this.connect();
  }

  private connect() {
    if (this._isClosed) return;
    const socket = new WebSocket(this._url);
    this._socket = socket;

    socket.onopen = () => {
      this._backoff = 1000;
    };
    socket.onmessage = (e: MessageEvent) => this.onMessage(e);
    socket.onclose = () => this.onClose();
    socket.onerror = () => {
      try {
        socket.close();
      } catch {
        // ignore
      }
    };
  }

  private onMessage(e: MessageEvent) {
    let msg: ServerMessage;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }
    if (msg.type === 'snapshot') {
      for (const t of msg.data) applyTicker(this._book, t);
    } else if (msg.type === 'ticker') {
      applyTicker(this._book, msg.data);
    }
  }

  private onClose() {
    if (this._isClosed) return;
    this._socket = null;
    this._reconnectTimer = setTimeout(() => {
      this._backoff = Math.min(this._backoff * 2, MAX_BACKOFF);
      this.connect();
    }, this._backoff);
  }

  /** Latest snapshot in the legacy TickerPayload shape. */
  getPayload(): TickerPayload {
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
        // ignore
      }
      this._socket = null;
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec jest --ci src/lib/ws/bridgeWS.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/ws/bridgeWS.ts apps/web/src/lib/ws/bridgeWS.test.ts
git commit -m "feat(web): add BridgeWebSocket client over the unified bridge"
```

---

### Task 4: SharedWorker tier → BridgeWebSocket

**Files:**
- Modify: `apps/web/workers/shared.worker.ts`
- Modify: `apps/web/src/lib/ticker-source/sharedWorkerSource.ts`

- [ ] **Step 1: Rewrite the shared worker**

Replace the entire contents of `apps/web/workers/shared.worker.ts` with:

```ts
import BrowserPort from '@/lib/browser-port';
import { buildPayload, createBook } from '@/lib/ws/bridgeMapper';
import BridgeWebSocket, { type BridgeConfig } from '@/lib/ws/bridgeWS';

const _self = self as unknown as SharedWorkerGlobalScope;

// chrome://inspect/#workers

let bridge: BridgeWebSocket | null = null;
let ports: BrowserPort[] = [];

const emptyPayload = () => buildPayload(createBook());

_self.onconnect = (e: MessageEvent) => {
  const port = new BrowserPort(e.ports[0]);
  ports.push(port);
  console.log('Port connected:', port);

  port.addEventListener('message', (e) => {
    const { type, payload } = e.data;

    if (type === 'init') {
      // Config arrives from the main thread (env is inlined there, not in the tsc worker build).
      if (!bridge && payload) bridge = new BridgeWebSocket(payload as BridgeConfig);
      return;
    }

    if (type === 'ping') {
      ports.forEach((p) => p.postMessage({ type: 'pong' }));
      return;
    }

    if (type === 'disconnect') {
      ports = ports.filter((p) => p !== port);
      port.close();
      console.log('Port disconnected:', port);
      return;
    }

    if (type === 'tickers') {
      try {
        const data = bridge ? bridge.getPayload() : emptyPayload();
        ports.forEach((p) => p.postMessage({ type: 'tickers', payload: data }));
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  });
};
```

- [ ] **Step 2: Send config from the shared worker source**

Replace the entire contents of `apps/web/src/lib/ticker-source/sharedWorkerSource.ts` with:

```ts
import {
  TickerListener,
  TickerSource,
  TickerSourceErrorHandler,
} from './types';

// Keep the same path convention as the rest of the app (see SharedWorkerProvider history).
const SHARED_WORKER_URL = '/public/workers/workers/shared.worker.js';

const WS_BASE = process.env.NEXT_PUBLIC_BRIDGE_WS_BASE ?? '';
const TOKEN = process.env.NEXT_PUBLIC_BRIDGE_TOKEN ?? '';

/**
 * One SharedWorker holds a single bridge WebSocket shared across all tabs.
 * Used when `typeof SharedWorker !== 'undefined'`.
 */
export function createSharedWorkerSource(
  onTickers: TickerListener,
  onError: TickerSourceErrorHandler,
): TickerSource {
  const worker = new SharedWorker(new URL(SHARED_WORKER_URL, import.meta.url), {
    type: 'module',
  });

  worker.port.onmessage = (event: MessageEvent) => {
    const { type, payload } = event.data ?? {};
    if (type === 'tickers' && payload) onTickers(payload);
  };
  worker.port.onmessageerror = () => onError();
  // Script load failures surface on the worker object, not the port.
  worker.onerror = () => onError();

  // Bridge config is inlined here (Next bundle) and handed to the worker.
  worker.port.postMessage({
    type: 'init',
    payload: { wsBase: WS_BASE, token: TOKEN },
  });
  worker.port.postMessage({ type: 'ping' });

  return {
    requestTickers() {
      worker.port.postMessage({ type: 'tickers' });
    },
    disconnect() {
      try {
        worker.port.postMessage({ type: 'disconnect' });
      } catch {
        // port may already be gone
      }
      try {
        worker.port.close();
      } catch {
        // ignore
      }
    },
  };
}
```

- [ ] **Step 3: Build the workers to confirm compilation**

Run: `pnpm build:workers`
Expected: PASS — `tsc -p tsconfig.worker.json` emits with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/workers/shared.worker.ts apps/web/src/lib/ticker-source/sharedWorkerSource.ts
git commit -m "feat(web): drive SharedWorker tier from the bridge socket"
```

---

### Task 5: Dedicated Worker tier → BridgeWebSocket

**Files:**
- Modify: `apps/web/workers/dedicated.worker.ts`
- Modify: `apps/web/src/lib/ticker-source/dedicatedWorkerSource.ts`

- [ ] **Step 1: Rewrite the dedicated worker**

Replace the entire contents of `apps/web/workers/dedicated.worker.ts` with:

```ts
import { buildPayload, createBook } from '@/lib/ws/bridgeMapper';
import BridgeWebSocket, { type BridgeConfig } from '@/lib/ws/bridgeWS';

// Dedicated Worker fallback for browsers without SharedWorker support.
// Mirrors shared.worker.ts but serves a single page (no onconnect/ports).
// `self` is globally typed as SharedWorkerGlobalScope for the worker tsconfig,
// so cast to the minimal Dedicated Worker surface we use.
const ctx = self as unknown as {
  onmessage: ((event: MessageEvent) => void) | null;
  postMessage: (message: unknown) => void;
};

let bridge: BridgeWebSocket | null = null;

ctx.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data ?? {};

  if (type === 'init') {
    if (!bridge && payload) bridge = new BridgeWebSocket(payload as BridgeConfig);
    return;
  }

  if (type === 'tickers') {
    try {
      const data = bridge ? bridge.getPayload() : buildPayload(createBook());
      ctx.postMessage({ type: 'tickers', payload: data });
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
};
```

- [ ] **Step 2: Send config from the dedicated worker source**

Replace the entire contents of `apps/web/src/lib/ticker-source/dedicatedWorkerSource.ts` with:

```ts
import {
  TickerListener,
  TickerSource,
  TickerSourceErrorHandler,
} from './types';

const DEDICATED_WORKER_URL = '/public/workers/workers/dedicated.worker.js';

const WS_BASE = process.env.NEXT_PUBLIC_BRIDGE_WS_BASE ?? '';
const TOKEN = process.env.NEXT_PUBLIC_BRIDGE_TOKEN ?? '';

/**
 * A per-tab Dedicated Worker running a single bridge WebSocket off the main thread.
 * Used when SharedWorker is unavailable but `Worker` is (e.g. Safari, most mobile browsers).
 */
export function createDedicatedWorkerSource(
  onTickers: TickerListener,
  onError: TickerSourceErrorHandler,
): TickerSource {
  const worker = new Worker(new URL(DEDICATED_WORKER_URL, import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (event: MessageEvent) => {
    const { type, payload } = event.data ?? {};
    if (type === 'tickers' && payload) onTickers(payload);
  };
  worker.onmessageerror = () => onError();
  worker.onerror = () => onError();

  worker.postMessage({
    type: 'init',
    payload: { wsBase: WS_BASE, token: TOKEN },
  });

  return {
    requestTickers() {
      worker.postMessage({ type: 'tickers' });
    },
    disconnect() {
      worker.terminate();
    },
  };
}
```

- [ ] **Step 3: Build the workers**

Run: `pnpm build:workers`
Expected: PASS — no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/workers/dedicated.worker.ts apps/web/src/lib/ticker-source/dedicatedWorkerSource.ts
git commit -m "feat(web): drive Dedicated Worker tier from the bridge socket"
```

---

### Task 6: Main-thread tier → BridgeWebSocket

**Files:**
- Modify: `apps/web/src/lib/ticker-source/mainThreadSource.ts`

- [ ] **Step 1: Rewrite the main-thread source**

Replace the entire contents of `apps/web/src/lib/ticker-source/mainThreadSource.ts` with:

```ts
import BridgeWebSocket from '@/lib/ws/bridgeWS';
import { TickerListener, TickerSource } from './types';

const WS_BASE = process.env.NEXT_PUBLIC_BRIDGE_WS_BASE ?? '';
const TOKEN = process.env.NEXT_PUBLIC_BRIDGE_TOKEN ?? '';

/**
 * Last-resort fallback: run the bridge WebSocket directly on the main thread.
 * Used when neither SharedWorker nor Worker is available (or both failed to load).
 */
export function createMainThreadSource(
  onTickers: TickerListener,
): TickerSource {
  const bridge = new BridgeWebSocket({ wsBase: WS_BASE, token: TOKEN });

  return {
    requestTickers() {
      onTickers(bridge.getPayload());
    },
    disconnect() {
      // Close the socket so remounts (StrictMode, Fast Refresh, route changes)
      // don't leak accumulating WebSocket connections.
      try {
        bridge.close();
      } catch (error) {
        console.error('Failed to close bridge socket:', error);
      }
    },
  };
}
```

- [ ] **Step 2: Type-check + run the full test suite**

Run: `pnpm exec tsc --noEmit && pnpm test:ci`
Expected: PASS — tsc clean, all tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/ticker-source/mainThreadSource.ts
git commit -m "feat(web): drive main-thread tier from the bridge socket"
```

---

### Task 7: Delete legacy clients, update docs, verify build

**Files:**
- Delete: `apps/web/src/lib/ws/upbitWS.ts`
- Delete: `apps/web/src/lib/ws/binanceWS.ts`
- Delete: `apps/web/src/lib/socket.ts`
- Modify: `apps/web/src/lib/ticker-source/README.md`

- [ ] **Step 1: Confirm there are no remaining importers**

Run: `grep -rn "lib/ws/upbitWS\|lib/ws/binanceWS\|lib/socket\b\|from '@/lib/socket'" apps/web/src apps/web/workers`
Expected: no output (no remaining references).

- [ ] **Step 2: Delete the legacy files**

```bash
git rm apps/web/src/lib/ws/upbitWS.ts apps/web/src/lib/ws/binanceWS.ts apps/web/src/lib/socket.ts
```

- [ ] **Step 3: Update the ticker-source README**

In `apps/web/src/lib/ticker-source/README.md`, update the data-flow description so it reflects the bridge. Replace the "Data flow" diagram's exchange edges and the closing paragraph. Specifically:

- Change the three `... WebSocket .-> EX[Upbit / Binance]` edges so each tier connects to one bridge socket:

```
    A -. WebSocket .-> EX[시세 브릿지 /bridge/ws]
    B -. WebSocket .-> EX
    C -. WebSocket .-> EX
```

- Replace the final paragraph with:

```
The worker tiers load the compiled workers from `apps/web/workers/` (`shared.worker.ts`, `dedicated.worker.ts`); all three tiers build a single `BridgeWebSocket` (`@/lib/ws/bridgeWS`) that connects to the unified 시세 브릿지 and maps `UnifiedTicker` → `TickerPayload` via `@/lib/ws/bridgeMapper`. Bridge config (`wsBase`/`token`) is read from `NEXT_PUBLIC_*` env in the Next bundle and passed to the workers via an `init` message.
```

- In the "Files" table, replace the row referencing `@/lib/ws/*` exchange clients with a row for `@/lib/ws/bridgeWS.ts` + `@/lib/ws/bridgeMapper.ts`.

- [ ] **Step 4: Full verification**

Run: `pnpm build:workers && pnpm exec tsc --noEmit && pnpm test:ci && pnpm lint`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/ticker-source/README.md
git commit -m "refactor(web): remove legacy exchange WS clients, update docs"
```

---

### Task 8: Manual smoke test

**Files:** none (verification only)

- [ ] **Step 1: Set a real token**

Edit `apps/web/.env.development` and set `NEXT_PUBLIC_BRIDGE_TOKEN` to the token received via the safe channel.

- [ ] **Step 2: Verify the bridge is up**

Run: `curl -s https://coinat.duckdns.org/bridge/health`
Expected: JSON with `healthy:true`.

- [ ] **Step 3: Run the app and confirm live prices**

Run: `pnpm dev:web` (from repo root) and open the KRW board.
Expected: prices populate within ~1–2s; KRW, USDT, and BTC tabs all show data; kimchi-premium (`per`) and `convertedBlast` render as before. Confirm in DevTools that exactly **one** `/bridge/ws` connection is open (Network → WS), and no `api.upbit.com` / `stream.binance.com` sockets.

- [ ] **Step 4: Cross-check coverage (open item)**

Run: `curl -s "https://coinat.duckdns.org/bridge/tickers" | head -c 2000`
Compare the returned symbols against the app's coin list. If the bridge serves fewer symbols than the app lists, note which rows stay empty and report back — this is a server-side coverage question for the bridge operator, not a client fix.

---

## Notes / Risks

- **changeRate ×100 for Binance** is the one behavior-preserving transform — verified by the mapper test and by the trading-view chart (`chart.tsx` multiplies by 100 for display; for Binance that path now receives the same percent value as before).
- **Worker env**: workers never read `process.env`; config is injected via the `init` message. This also removes the legacy transitive `process.env` reference that came in through `@/api`.
- **Bridge coverage** (Task 8 Step 4) is the only unknown that could leave some rows empty; it does not block the migration and is resolved server-side.
