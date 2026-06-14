import type { ServerMessage } from '@/lib/bridge-types';
import { BridgeWorkerCore } from '@/lib/ws/bridgeWorkerCore';

class MockWebSocket {
  static last: MockWebSocket | null = null;
  static instances = 0;
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  close = jest.fn();
  constructor(url: string) {
    this.url = url;
    MockWebSocket.last = this;
    MockWebSocket.instances += 1;
  }
  emit(msg: ServerMessage) {
    this.onmessage?.({ data: JSON.stringify(msg) });
  }
}

const emptyPayload = {
  upbit: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
  binance: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
};

beforeAll(() => {
  (global as unknown as { WebSocket: unknown }).WebSocket = MockWebSocket;
});

beforeEach(() => {
  MockWebSocket.last = null;
  MockWebSocket.instances = 0;
});

describe('BridgeWorkerCore', () => {
  it('returns an empty payload before init (no socket opened)', () => {
    const core = new BridgeWorkerCore();
    expect(core.payload()).toEqual(emptyPayload);
    expect(MockWebSocket.instances).toBe(0);
  });

  it('does nothing when init is called without a config payload', () => {
    const core = new BridgeWorkerCore();
    core.init(undefined);
    core.init(null);
    expect(MockWebSocket.instances).toBe(0);
    expect(core.payload()).toEqual(emptyPayload);
  });

  it('opens the bridge on init and reflects its payload', () => {
    const core = new BridgeWorkerCore();
    core.init({ wsBase: 'wss://x', token: 't' });
    expect(MockWebSocket.instances).toBe(1);

    MockWebSocket.last!.emit({
      type: 'ticker',
      data: {
        symbol: 'BTC',
        exchange: 'upbit',
        quote: 'KRW',
        tradePrice: 9e7,
        highPrice: 0,
        lowPrice: 0,
        openPrice: 0,
        changePrice: 0,
        changeRate: 0,
        marketWarning: 'NONE',
      },
    });

    expect(core.payload().upbit.btcKrw).toBe(9e7);
  });

  it('is idempotent: a second init does not open another socket', () => {
    const core = new BridgeWorkerCore();
    core.init({ wsBase: 'wss://x', token: 't' });
    core.init({ wsBase: 'wss://y', token: 'other' });
    expect(MockWebSocket.instances).toBe(1);
    expect(MockWebSocket.last!.url).toContain('wss://x');
  });
});
