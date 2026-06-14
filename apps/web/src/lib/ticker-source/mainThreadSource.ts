import BridgeWebSocket from '@/lib/ws/bridgeWS';
import { getBridgeConfig } from './bridgeConfig';
import { TickerListener, TickerSource } from './types';

/**
 * Last-resort fallback: run the bridge WebSocket directly on the main thread.
 * Used when neither SharedWorker nor Worker is available (or both failed to load).
 */
export function createMainThreadSource(
  onTickers: TickerListener,
): TickerSource {
  const bridge = new BridgeWebSocket(getBridgeConfig());

  return {
    requestTickers() {
      onTickers(bridge.getPayload());
    },
    disconnect() {
      // Close the socket so remounts (StrictMode, Fast Refresh, route changes)
      // don't leak accumulating WebSocket connections.
      try {
        bridge.close();
      } catch (error) {
        console.error('Failed to close bridge socket:', error);
      }
    },
  };
}
