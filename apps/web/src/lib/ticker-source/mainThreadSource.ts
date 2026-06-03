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
      // Close both sockets so remounts (StrictMode, Fast Refresh, route changes)
      // don't leak accumulating WebSocket connections.
      try {
        upbitSocket.close();
        binanceSocket.close();
      } catch (error) {
        console.error('Failed to close main-thread sockets:', error);
      }
    },
  };
}
