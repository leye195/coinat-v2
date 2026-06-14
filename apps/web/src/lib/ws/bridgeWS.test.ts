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
    new BridgeWebSocket({
      wsBase: 'wss://x',
      token: 'tok en',
      symbols: ['BTC', 'ETH'],
    });
    expect(MockWebSocket.last?.url).toBe(
      'wss://x/bridge/ws?token=tok+en&symbols=BTC%2CETH',
    );
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
        {
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
      ],
    });
    sock.emit({
      type: 'ticker',
      data: {
        symbol: 'BTC',
        exchange: 'binance',
        quote: 'USDT',
        tradePrice: 65000,
        highPrice: 0,
        lowPrice: 0,
        openPrice: 0,
        changePrice: 0,
        changeRate: 0,
        marketWarning: 'NONE',
      },
    });

    const p = bridge.getPayload();
    expect(p.upbit.btcKrw).toBe(9e7);
    expect(p.binance.btcKrw).toBe(65000);
  });

  it('ignores null / primitive frames without throwing', () => {
    const bridge = new BridgeWebSocket({ wsBase: 'wss://x', token: 't' });
    const sock = MockWebSocket.last!;
    expect(() => sock.onmessage?.({ data: 'null' })).not.toThrow();
    expect(() => sock.onmessage?.({ data: '42' })).not.toThrow();
    expect(bridge.getPayload()).toEqual({
      upbit: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
      binance: { data: { krw: {}, btc: {}, usdt: {} }, btcKrw: 0 },
    });
  });

  it('does not open a socket when the ws url has an invalid scheme', () => {
    new BridgeWebSocket({ wsBase: '', token: 't' });
    expect(MockWebSocket.last).toBeNull();
  });

  it('skips null/non-object items inside a snapshot without throwing', () => {
    const bridge = new BridgeWebSocket({ wsBase: 'wss://x', token: 't' });
    const sock = MockWebSocket.last!;
    expect(() =>
      sock.onmessage?.({
        data: JSON.stringify({
          type: 'snapshot',
          data: [
            null,
            42,
            {
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
          ],
        }),
      }),
    ).not.toThrow();
    // The one valid record still landed.
    expect(bridge.getPayload().upbit.btcKrw).toBe(9e7);
  });

  it('close() detaches handlers and closes the socket', () => {
    const bridge = new BridgeWebSocket({ wsBase: 'wss://x', token: 't' });
    const sock = MockWebSocket.last!;
    bridge.close();
    expect(sock.close).toHaveBeenCalled();
    expect(sock.onmessage).toBeNull();
  });
});
