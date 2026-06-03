import BinanceWebSocket from '@/lib/ws/binanceWS';
import UpbitWebSocket from '@/lib/ws/upbitWS';
// Dedicated Worker fallback for browsers without SharedWorker support.
// Mirrors shared.worker.ts but serves a single page (no onconnect/ports).
// `self` is globally typed as SharedWorkerGlobalScope for the worker tsconfig,
// so cast to the minimal Dedicated Worker surface we use.
const ctx = self;
const upbitSocket = new UpbitWebSocket();
const binanceSocket = new BinanceWebSocket();
ctx.onmessage = (event) => {
    var _a;
    const { type } = (_a = event.data) !== null && _a !== void 0 ? _a : {};
    if (type === 'tickers') {
        try {
            ctx.postMessage({
                type: 'tickers',
                payload: {
                    upbit: {
                        data: upbitSocket.data,
                        btcKrw: upbitSocket.btcKrw,
                    },
                    binance: {
                        data: binanceSocket.data,
                        btcKrw: binanceSocket.btcKrw,
                    },
                },
            });
        }
        catch (error) {
            console.error('Error sending data:', error);
        }
    }
};
