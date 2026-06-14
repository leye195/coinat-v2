import { WorkerMsg } from '@/lib/ws/worker-messages';
import { getBridgeConfig } from './bridgeConfig';
import {
  TickerListener,
  TickerSource,
  TickerSourceErrorHandler,
} from './types';

const DEDICATED_WORKER_URL = '/public/workers/workers/dedicated.worker.js';

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
    if (type === WorkerMsg.Tickers && payload) onTickers(payload);
  };
  worker.onmessageerror = () => onError();
  worker.onerror = () => onError();

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
