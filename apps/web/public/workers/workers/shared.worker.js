import BrowserPort from '@/lib/browser-port';
import { buildPayload, createBook } from '@/lib/ws/bridgeMapper';
import BridgeWebSocket from '@/lib/ws/bridgeWS';
const _self = self;
// chrome://inspect/#workers
let bridge = null;
let ports = [];
const emptyPayload = () => buildPayload(createBook());
_self.onconnect = (e) => {
    const port = new BrowserPort(e.ports[0]);
    ports.push(port);
    console.log('Port connected:', port);
    port.addEventListener('message', (e) => {
        const { type, payload } = e.data;
        if (type === 'init') {
            // Config arrives from the main thread (env is inlined there, not in the tsc worker build).
            if (!bridge && payload)
                bridge = new BridgeWebSocket(payload);
            return;
        }
        if (type === 'ping') {
            ports.forEach((p) => p.postMessage({ type: 'pong' }));
            return;
        }
        if (type === 'disconnect') {
            ports = ports.filter((p) => p !== port);
            port.close();
            console.log('Port disconnected:', port);
            return;
        }
        if (type === 'tickers') {
            try {
                const data = bridge ? bridge.getPayload() : emptyPayload();
                ports.forEach((p) => p.postMessage({ type: 'tickers', payload: data }));
            }
            catch (error) {
                console.error('Error sending data:', error);
            }
        }
    });
};
