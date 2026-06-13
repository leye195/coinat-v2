import {
  TickerListener,
  TickerSource,
  TickerSourceErrorHandler,
} from './types';

// Keep the same path convention as the rest of the app (see SharedWorkerProvider history).
const SHARED_WORKER_URL = '/public/workers/workers/shared.worker.js';

const WS_BASE = process.env.NEXT_PUBLIC_BRIDGE_WS_BASE ?? '';
const TOKEN = process.env.NEXT_PUBLIC_BRIDGE_TOKEN ?? '';

/**
 * One SharedWorker holds a single bridge WebSocket shared across all tabs.
 * Used when `typeof SharedWorker !== 'undefined'`.
 */
export function createSharedWorkerSource(
  onTickers: TickerListener,
  onError: TickerSourceErrorHandler,
): TickerSource {
  const worker = new SharedWorker(new URL(SHARED_WORKER_URL, import.meta.url), {
    type: 'module',
  });

  worker.port.onmessage = (event: MessageEvent) => {
    const { type, payload } = event.data ?? {};
    if (type === 'tickers' && payload) onTickers(payload);
  };
  worker.port.onmessageerror = () => onError();
  // Script load failures surface on the worker object, not the port.
  worker.onerror = () => onError();

  // Bridge config is inlined here (Next bundle) and handed to the worker.
  worker.port.postMessage({
    type: 'init',
    payload: { wsBase: WS_BASE, token: TOKEN },
  });
  worker.port.postMessage({ type: 'ping' });

  return {
    requestTickers() {
      worker.port.postMessage({ type: 'tickers' });
    },
    disconnect() {
      try {
        worker.port.postMessage({ type: 'disconnect' });
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
