import BrowserPort from '@/lib/browser-port';
import { BridgeWorkerCore } from '@/lib/ws/bridgeWorkerCore';
import { WorkerMsg } from '@/lib/ws/worker-messages';

const _self = self as unknown as SharedWorkerGlobalScope;

// chrome://inspect/#workers

const core = new BridgeWorkerCore();
let ports: BrowserPort[] = [];

_self.onconnect = (e: MessageEvent) => {
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
        // Guard each send: a closed-but-not-GC'd port can throw, and one bad
        // port must not stop the broadcast to the others. Drop the failed ones.
        const alive: BrowserPort[] = [];
        ports.forEach((p) => {
          try {
            p.postMessage({ type: WorkerMsg.Tickers, payload: data });
            alive.push(p);
          } catch (error) {
            console.error('Dropping unreachable port:', error);
            try {
              p.close();
            } catch {
              // ignore
            }
          }
        });
        ports = alive;
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  });
};
