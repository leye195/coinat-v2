import BinanceWebSocket from '@/lib/ws/binanceWS';
import UpbitWebSocket from '@/lib/ws/upbitWS';
import { TickerListener, TickerSource } from './types';

/**
 * Last-resort fallback: run the WebSocket clients directly on the main thread.
 * Used when neither SharedWorker nor Worker is available (or both failed to load).
 */
export function createMainThreadSource(
  onTickers: TickerListener,
): TickerSource {
  const upbitSocket = new UpbitWebSocket();
  const binanceSocket = new BinanceWebSocket();

  return {
    requestTickers() {
      onTickers({
        upbit: { data: upbitSocket.data, btcKrw: upbitSocket.btcKrw },
        binance: { data: binanceSocket.data, btcKrw: binanceSocket.btcKrw },
      });
    },
    disconnect() {
      // The WS clients self-reconnect and expose no public close(); page unload
      // closes the sockets. Acceptable for this app-lifetime provider.
    },
  };
}
