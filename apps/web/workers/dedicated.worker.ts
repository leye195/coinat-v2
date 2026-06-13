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
