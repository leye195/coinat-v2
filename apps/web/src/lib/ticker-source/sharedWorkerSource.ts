import { WorkerMsg } from '@/lib/ws/worker-messages';
import { getBridgeConfig } from './bridgeConfig';
import {
  TickerListener,
  TickerSource,
  TickerSourceErrorHandler,
} from './types';

// Keep the same path convention as the rest of the app (see SharedWorkerProvider history).
const SHARED_WORKER_URL = '/workers/workers/shared.worker.js';

/**
 * One SharedWorker holds a single bridge WebSocket shared across all tabs.
 * Used when `typeof SharedWorker !== 'undefined'`.
 */
export function createSharedWorkerSource(
  onTickers: TickerListener,
  onError: TickerSourceErrorHandler,
): TickerSource {
  // Pass the absolute path as a string so it resolves against the document's
  // base URL (http origin). Do NOT wrap in `new URL(..., import.meta.url)`:
  // webpack inlines `import.meta.url` as a `file://` path, which would resolve
  // the worker to `file:///workers/...` and fail to load.
  const worker = new SharedWorker(SHARED_WORKER_URL, {
    type: 'module',
  });

  worker.port.onmessage = (event: MessageEvent) => {
    const { type, payload } = event.data ?? {};
    if (type === WorkerMsg.Tickers && payload) onTickers(payload);
  };
  worker.port.onmessageerror = (e) => {
    console.error('[shared-worker] port messageerror:', e);
    onError();
  };
  // Script load failures surface on the worker object, not the port.
  worker.onerror = (e) => {
    console.error('[shared-worker] onerror:', {
      message: (e as ErrorEvent).message,
      filename: (e as ErrorEvent).filename,
      lineno: (e as ErrorEvent).lineno,
      event: e,
    });
    onError();
  };

  // Bridge config is inlined here (Next bundle) and handed to the worker.
  worker.port.postMessage({
    type: WorkerMsg.Init,
    payload: getBridgeConfig(),
  });
  worker.port.postMessage({ type: WorkerMsg.Ping });

  return {
    requestTickers() {
      worker.port.postMessage({ type: WorkerMsg.Tickers });
    },
    disconnect() {
      try {
        worker.port.postMessage({ type: WorkerMsg.Disconnect });
      } catch {
        // port may already be gone
      }
      try {
        worker.port.close();
      } catch {
        // ignore
      }
    },
  };
}
