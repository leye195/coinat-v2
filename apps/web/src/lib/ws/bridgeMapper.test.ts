import type { UnifiedTicker } from '@/lib/bridge-types';
import { applyTicker, buildPayload, createBook } from '@/lib/ws/bridgeMapper';

const base = {
  highPrice: 0,
  lowPrice: 0,
  openPrice: 0,
  changePrice: 0,
  marketWarning: 'NONE',
};

const u = (
  p: Partial<UnifiedTicker> &
    Pick<UnifiedTicker, 'symbol' | 'exchange' | 'quote' | 'tradePrice'>,
): UnifiedTicker => ({
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
    applyTicker(
      book,
      u({
        symbol: 'BTC',
        exchange: 'upbit',
        quote: 'KRW',
        tradePrice: 90000000,
      }),
    );
    applyTicker(
      book,
      u({
        symbol: 'ETH',
        exchange: 'upbit',
        quote: 'KRW',
        tradePrice: 5000000,
        changeRate: 0.0123,
      }),
    );
    const p = buildPayload(book);

    expect(p.upbit.btcKrw).toBe(90000000);
    expect(p.upbit.data.krw.ETH.tradePrice).toBe(5000000);
    expect(p.upbit.data.krw.ETH.changeRate).toBe(0.0123); // upbit decimal preserved
    expect(p.upbit.data.usdt.ETH.tradePrice).toBe(5000000); // legacy copy
  });

  it('routes upbit BTC market into btc', () => {
    const book = createBook();
    applyTicker(
      book,
      u({ symbol: 'ETH', exchange: 'upbit', quote: 'BTC', tradePrice: 0.055 }),
    );
    expect(buildPayload(book).upbit.data.btc.ETH.tradePrice).toBe(0.055);
  });

  it('routes binance BTC/USDT into btc[BTC] and sets btcKrw', () => {
    const book = createBook();
    applyTicker(
      book,
      u({
        symbol: 'BTC',
        exchange: 'binance',
        quote: 'USDT',
        tradePrice: 65000,
      }),
    );
    const p = buildPayload(book);
    expect(p.binance.btcKrw).toBe(65000);
    expect(p.binance.data.btc.BTC.tradePrice).toBe(65000);
  });

  it('routes binance non-BTC USDT into usdt, BTC market into btc', () => {
    const book = createBook();
    applyTicker(
      book,
      u({
        symbol: 'ETH',
        exchange: 'binance',
        quote: 'USDT',
        tradePrice: 3500,
      }),
    );
    applyTicker(
      book,
      u({
        symbol: 'ETH',
        exchange: 'binance',
        quote: 'BTC',
        tradePrice: 0.054,
      }),
    );
    const p = buildPayload(book);
    expect(p.binance.data.usdt.ETH.tradePrice).toBe(3500);
    expect(p.binance.data.btc.ETH.tradePrice).toBe(0.054);
  });

  it('multiplies binance changeRate by 100 to preserve legacy percent semantics', () => {
    const book = createBook();
    applyTicker(
      book,
      u({
        symbol: 'ETH',
        exchange: 'binance',
        quote: 'USDT',
        tradePrice: 3500,
        changeRate: 0.0123,
      }),
    );
    expect(buildPayload(book).binance.data.usdt.ETH.changeRate).toBeCloseTo(
      1.23,
    );
  });

  it('keeps only the latest value per exchange:symbol:quote', () => {
    const book = createBook();
    applyTicker(
      book,
      u({ symbol: 'ETH', exchange: 'upbit', quote: 'KRW', tradePrice: 1 }),
    );
    applyTicker(
      book,
      u({ symbol: 'ETH', exchange: 'upbit', quote: 'KRW', tradePrice: 2 }),
    );
    expect(buildPayload(book).upbit.data.krw.ETH.tradePrice).toBe(2);
  });
});
