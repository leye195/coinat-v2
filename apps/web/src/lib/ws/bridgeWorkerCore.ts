import type { TickerPayload } from '@/lib/ticker-source/types';
import { buildPayload, createBook } from './bridgeMapper';
import BridgeWebSocket, { type BridgeConfig } from './bridgeWS';

/**
 * Shared logic for both bridge workers (shared / dedicated): lazily own a single
 * BridgeWebSocket and produce the latest payload (or an empty one before init).
 *
 * Each worker keeps its own messaging surface — the SharedWorker broadcasts to
 * every connected port, the Dedicated Worker posts to its single page — but the
 * bridge lifecycle and payload shaping live here so they cannot drift apart.
 */
export class BridgeWorkerCore {
  private bridge: BridgeWebSocket | null = null;

  /** Construct the bridge socket once, from the config the main thread inlines. */
  init(payload: unknown): void {
    if (!this.bridge && payload) {
      this.bridge = new BridgeWebSocket(payload as BridgeConfig);
    }
  }

  /** Latest snapshot, or an empty payload if the bridge has not been initialised. */
  payload(): TickerPayload {
    return this.bridge ? this.bridge.getPayload() : buildPayload(createBook());
  }
}
