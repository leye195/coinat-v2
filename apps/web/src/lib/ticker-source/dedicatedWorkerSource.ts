import {
  TickerListener,
  TickerSource,
  TickerSourceErrorHandler,
} from './types';

const DEDICATED_WORKER_URL = '/public/workers/workers/dedicated.worker.js';

/**
 * A per-tab Dedicated Worker running the same WebSocket clients off the main thread.
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

  return {
    requestTickers() {
      worker.postMessage({ type: 'tickers' });
    },
    disconnect() {
      worker.terminate();
    },
  };
}
