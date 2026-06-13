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
