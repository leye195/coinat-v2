import BrowserPort from '@/lib/browser-port';
import { BridgeWorkerCore } from '@/lib/ws/bridgeWorkerCore';
import { WorkerMsg } from '@/lib/ws/worker-messages';
const _self = self;
// chrome://inspect/#workers
const core = new BridgeWorkerCore();
let ports = [];
_self.onconnect = (e) => {
    const port = new BrowserPort(e.ports[0]);
    ports.push(port);
    console.log('Port connected:', port);
    port.addEventListener('message', (e) => {
        const { type, payload } = e.data;
        if (type === WorkerMsg.Init) {
            // Config arrives from the main thread (env is inlined there, not in the tsc worker build).
            core.init(payload);
            return;
        }
        if (type === WorkerMsg.Ping) {
            ports.forEach((p) => p.postMessage({ type: WorkerMsg.Pong }));
            return;
        }
        if (type === WorkerMsg.Disconnect) {
            ports = ports.filter((p) => p !== port);
            port.close();
            console.log('Port disconnected:', port);
            return;
        }
        if (type === WorkerMsg.Tickers) {
            try {
                const data = core.payload();
                ports.forEach((p) => p.postMessage({ type: WorkerMsg.Tickers, payload: data }));
            }
            catch (error) {
                console.error('Error sending data:', error);
            }
        }
    });
};
