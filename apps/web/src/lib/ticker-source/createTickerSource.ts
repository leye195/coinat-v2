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

  const startTier = () => {
    if (disposed) return;

    while (index < tiers.length && !tiers[index].supported()) index++;
    if (index >= tiers.length) return;

    const tier = tiers[index];
    // Capture this tier's slot. Late callbacks from an already-superseded tier
    // (e.g. a stale worker `onerror` arriving after the watchdog downgraded)
    // must not tear down or settle whatever tier is now active.
    const activeIndex = index;
    settled = false;

    console.log(`[ticker-source] trying tier: "${tier.kind}"`);

    const downgrade = () => {
      if (disposed || settled || index !== activeIndex) return;
      console.log(`[ticker-source] tier "${tier.kind}" failed → downgrading`);
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

    const handleTickers: TickerListener = (payload) => {
      // Ignore late payloads from a superseded tier.
      if (disposed || index !== activeIndex) return;
      // First successful payload locks in the current tier.
      if (!settled) {
        settled = true;
        clearWatchdog();
        console.log(
          `[ticker-source] ✅ tier "${tier.kind}" is running (first snapshot received)`,
        );
      }
      onTickers(payload);
    };

    try {
      const activeSource = tier.build(handleTickers, downgrade);
      current = activeSource;
      onKind?.(tier.kind);

      // The main-thread tier is synchronous and always works — no watchdog needed.
      if (tier.kind !== 'main-thread') {
        watchdog = setTimeout(() => {
          if (!settled) downgrade();
        }, FIRST_TICKER_TIMEOUT);
        // Nudge the worker so it emits a first snapshot before the watchdog fires.
        try {
          activeSource.requestTickers();
        } catch {
          downgrade();
        }
      }
    } catch {
      downgrade();
      return;
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
