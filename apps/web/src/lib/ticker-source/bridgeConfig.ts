import type { BridgeConfig } from '@/lib/ws/bridgeWS';

/**
 * Bridge connection config, read from the Next bundle's inlined public env.
 *
 * Used by the main-thread ticker sources only — env is not available inside the
 * tsc-built worker bundle, so workers receive this via the `init` message.
 */
export function getBridgeConfig(): BridgeConfig {
  return {
    wsBase: process.env.NEXT_PUBLIC_BRIDGE_WS_BASE ?? '',
    token: process.env.NEXT_PUBLIC_BRIDGE_TOKEN ?? '',
  };
}
