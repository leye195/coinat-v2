import { WorkerMsg } from '@/lib/ws/worker-messages';
import { getBridgeConfig } from './bridgeConfig';
import {
  TickerListener,
  TickerSource,
  TickerSourceErrorHandler,
} from './types';

const DEDICATED_WORKER_URL = '/workers/workers/dedicated.worker.js';

/**
 * A per-tab Dedicated Worker running a single bridge WebSocket off the main thread.
 * Used when SharedWorker is unavailable but `Worker` is (e.g. Safari, most mobile browsers).
 */
export function createDedicatedWorkerSource(
  onTickers: TickerListener,
  onError: TickerSourceErrorHandler,
): TickerSource {
  // Pass the absolute path as a string so it resolves against the document's
  // base URL (http origin). Wrapping in `new URL(..., import.meta.url)` would
  // resolve to `file:///workers/...` (webpack inlines import.meta.url as a
  // file path) and fail to load.
  const worker = new Worker(DEDICATED_WORKER_URL, {
    type: 'module',
  });

  worker.onmessage = (event: MessageEvent) => {
    const { type, payload } = event.data ?? {};
    if (type === WorkerMsg.Tickers && payload) onTickers(payload);
  };
  worker.onmessageerror = (e) => {
    console.error('[dedicated-worker] messageerror:', e);
    onError();
  };
  worker.onerror = (e) => {
    console.error('[dedicated-worker] onerror:', {
      message: (e as ErrorEvent).message,
      filename: (e as ErrorEvent).filename,
      lineno: (e as ErrorEvent).lineno,
      event: e,
    });
    onError();
  };

  worker.postMessage({
    type: WorkerMsg.Init,
    payload: getBridgeConfig(),
  });

  return {
    requestTickers() {
      worker.postMessage({ type: WorkerMsg.Tickers });
    },
    disconnect() {
      worker.terminate();
    },
  };
}
