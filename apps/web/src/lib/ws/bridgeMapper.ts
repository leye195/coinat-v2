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

/**
 * Map one bridge record to a legacy ticker entry, preserving exact prior semantics.
 *
 * The returned entry is treated as an immutable snapshot. `buildPayload` may alias a
 * single entry into two slots (the upbit KRW→usdt mirror below), so consumers must
 * read fields off it and never mutate it in place.
 */
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

/** Build today's TickerPayload from the current book (see design routing table). */
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
      // binance has no KRW market, so a 'KRW' quote (shouldn't occur) is intentionally dropped.
    }
  }

  return payload;
}
