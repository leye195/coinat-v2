import { createDedicatedWorkerSource } from './dedicatedWorkerSource';
import { createMainThreadSource } from './mainThreadSource';
import { createSharedWorkerSource } from './sharedWorkerSource';
import {
  TickerListener,
  TickerSource,
  TickerSourceErrorHandler,
  TickerSourceKind,
} from './types';

/** If a worker tier delivers no snapshot within this window, downgrade to the next tier. */
const FIRST_TICKER_TIMEOUT = 4000;

type Tier = {
  kind: TickerSourceKind;
  supported: () => boolean;
  build: (
    onTickers: TickerListener,
    onError: TickerSourceErrorHandler,
  ) => TickerSource;
};

/**
 * Progressive ticker source: SharedWorker → Dedicated Worker → main thread.
 *
 * Each worker tier is guarded by capability detection, a try/catch around
 * construction, error handlers, and a watchdog timer — so a missing API, a
 * thrown constructor, or a worker script that fails to load all degrade
 * gracefully to the next tier. The main-thread tier always succeeds.
 *
 * @param onTickers called with every snapshot from the active source.
 * @param onKind optional, notified of the tier currently in use (for debugging/telemetry).
 */
export function createTickerSource(
  onTickers: TickerListener,
  onKind?: (kind: TickerSourceKind) => void,
): TickerSource {
  const tiers: Tier[] = [
    {
      kind: 'shared-worker',
      supported: () => typeof SharedWorker !== 'undefined',
      build: createSharedWorkerSource,
    },
    {
      kind: 'dedicated-worker',
      supported: () => typeof Worker !== 'undefined',
      build: createDedicatedWorkerSource,
    },
    {
      kind: 'main-thread',
      supported: () => true,
      build: (onTickersCb) => createMainThreadSource(onTickersCb),
    },
  ];

  let current: TickerSource | null = null;
  let index = 0;
  let settled = false;
  let disposed = false;
  let watchdog: ReturnType<typeof setTimeout> | null = null;

  const clearWatchdog = () => {
    if (watchdog) {
      clearTimeout(watchdog);
      watchdog = null;
    }
  };

  const handleTickers: TickerListener = (payload) => {
    // First successful payload locks in the current tier.
    settled = true;
    clearWatchdog();
    onTickers(payload);
  };

  const startTier = () => {
    if (disposed) return;

    while (index < tiers.length && !tiers[index].supported()) index++;
    if (index >= tiers.length) return;

    const tier = tiers[index];
    settled = false;

    const downgrade = () => {
      if (disposed || settled) return;
      clearWatchdog();
      try {
        current?.disconnect();
      } catch {
        // ignore
      }
      current = null;
      index++;
      startTier();
    };

    try {
      current = tier.build(handleTickers, downgrade);
      onKind?.(tier.kind);
    } catch {
      downgrade();
      return;
    }

    // The main-thread tier is synchronous and always works — no watchdog needed.
    if (tier.kind !== 'main-thread') {
      watchdog = setTimeout(() => {
        if (!settled) downgrade();
      }, FIRST_TICKER_TIMEOUT);
      // Nudge the worker so it emits a first snapshot before the watchdog fires.
      try {
        current.requestTickers();
      } catch {
        downgrade();
      }
    }
  };

  startTier();

  return {
    requestTickers() {
      current?.requestTickers();
    },
    disconnect() {
      disposed = true;
      clearWatchdog();
      try {
        current?.disconnect();
      } catch {
        // ignore
      }
      current = null;
    },
  };
}
