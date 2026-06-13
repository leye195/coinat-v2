import { buildPayload, createBook } from '@/lib/ws/bridgeMapper';
import BridgeWebSocket from '@/lib/ws/bridgeWS';
// Dedicated Worker fallback for browsers without SharedWorker support.
// Mirrors shared.worker.ts but serves a single page (no onconnect/ports).
// `self` is globally typed as SharedWorkerGlobalScope for the worker tsconfig,
// so cast to the minimal Dedicated Worker surface we use.
const ctx = self;
let bridge = null;
ctx.onmessage = (event) => {
    var _a;
    const { type, payload } = (_a = event.data) !== null && _a !== void 0 ? _a : {};
    if (type === 'init') {
        if (!bridge && payload)
            bridge = new BridgeWebSocket(payload);
        return;
    }
    if (type === 'tickers') {
        try {
            const data = bridge ? bridge.getPayload() : buildPayload(createBook());
            ctx.postMessage({ type: 'tickers', payload: data });
        }
        catch (error) {
            console.error('Error sending data:', error);
        }
    }
};
