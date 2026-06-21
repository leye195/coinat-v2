import type { TickerPayload } from '@/lib/ticker-source/types';
/**
 * Shared logic for both bridge workers (shared / dedicated): lazily own a single
 * BridgeWebSocket and produce the latest payload (or an empty one before init).
 *
 * Each worker keeps its own messaging surface — the SharedWorker broadcasts to
 * every connected port, the Dedicated Worker posts to its single page — but the
 * bridge lifecycle and payload shaping live here so they cannot drift apart.
 */
export declare class BridgeWorkerCore {
    private bridge;
    /** Construct the bridge socket once, from the config the main thread inlines. */
    init(payload: unknown): void;
    /** Latest snapshot, or an empty payload if the bridge has not been initialised. */
    payload(): TickerPayload;
}
//# sourceMappingURL=bridgeWorkerCore.d.ts.map