import type { UnifiedTicker } from '@/lib/bridge-types';
import type { TickerPayload } from '@/lib/ticker-source/types';
export type BridgeBook = Map<string, UnifiedTicker>;
export declare const bookKey: (t: UnifiedTicker) => string;
export declare function createBook(): BridgeBook;
export declare function applyTicker(book: BridgeBook, t: UnifiedTicker): void;
/** Build today's TickerPayload from the current book (see design routing table). */
export declare function buildPayload(book: BridgeBook): TickerPayload;
//# sourceMappingURL=bridgeMapper.d.ts.map