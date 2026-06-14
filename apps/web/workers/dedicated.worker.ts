import { BridgeWorkerCore } from '@/lib/ws/bridgeWorkerCore';
import { WorkerMsg } from '@/lib/ws/worker-messages';

// Dedicated Worker fallback for browsers without SharedWorker support.
// Mirrors shared.worker.ts but serves a single page (no onconnect/ports).
// `self` is globally typed as SharedWorkerGlobalScope for the worker tsconfig,
// so cast to the minimal Dedicated Worker surface we use.
const ctx = self as unknown as {
  onmessage: ((event: MessageEvent) => void) | null;
  postMessage: (message: unknown) => void;
};

const core = new BridgeWorkerCore();

ctx.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data ?? {};

  if (type === WorkerMsg.Init) {
    core.init(payload);
    return;
  }

  if (type === WorkerMsg.Tickers) {
    try {
      const data = core.payload();
      ctx.postMessage({ type: WorkerMsg.Tickers, payload: data });
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
};
