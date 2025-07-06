import BrowserPort from '@/lib/browser-port';
import BinanceWebSocket from '@/lib/ws/binanceWS';
import UpbitWebSocket from '@/lib/ws/upbitWS';

const _self = self as unknown as SharedWorkerGlobalScope;

// chrome://inspect/#workers

const upbitSocket = new UpbitWebSocket();
const binanceSocket = new BinanceWebSocket(); // BinanceSocket 생셩

let ports: BrowserPort[] = [];

_self.onconnect = (e: MessageEvent) => {
  const port = new BrowserPort(e.ports[0]);
  ports.push(port);
  console.log('Port connected:', port);

  port.addEventListener('message', (e) => {
    const { type } = e.data;

    if (type === 'ping') {
      ports.forEach((p) =>
        p.postMessage({
          type: 'pong',
        }),
      );
    }

    if (type === 'disconnect') {
      ports = ports.filter((p) => p !== port);
      port.close();
      console.log('Port disconnected:', port);
      return;
    }

    if (type === 'tickers') {
      try {
        ports.forEach((p) =>
          p.postMessage({
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
          }),
        );
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  });
};
