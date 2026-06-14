# Ticker Source — progressive real-time fallback

Real-time tickers are delivered through a **progressive fallback chain** so they keep working on browsers that don't support `SharedWorker` (Safari, most mobile browsers, Android Chrome). Without this, `new SharedWorker(...)` throws and — because the provider sits inside `RootErrorBoundary` — crashes the whole app.

All three tiers expose the same `TickerSource` interface (`requestTickers()` / `disconnect()`) and emit the same `TickerPayload`, so `SharedWorkerProvider` is agnostic to which one is active.

## Tier selection (`createTickerSource`)

Each worker tier is guarded by capability detection, a `try/catch` around construction, error handlers, and a **4s watchdog**. A missing API, a thrown constructor, or a worker script that fails to load all degrade to the next tier. The main-thread tier always succeeds.

```mermaid
flowchart TD
    Start([createTickerSource]) --> SW{SharedWorker<br/>supported?}
    SW -- yes --> SWbuild[SharedWorker source<br/>+ 4s watchdog]
    SW -- no --> DWq{Worker<br/>supported?}

    SWbuild --> SWok{first ticker<br/>within 4s?}
    SWok -- yes --> Active[active source locked in]
    SWok -- "no / onerror" --> DWq

    DWq -- yes --> DWbuild[Dedicated Worker source<br/>+ 4s watchdog]
    DWq -- no --> MT[Main-thread source<br/>WS on main thread]

    DWbuild --> DWok{first ticker<br/>within 4s?}
    DWok -- yes --> Active
    DWok -- "no / onerror" --> MT

    MT --> Active
```

Once a tier delivers its first payload it is "settled" and later errors no longer trigger a downgrade — the WS clients self-reconnect within that tier.

## Data flow (whichever tier is active)

```mermaid
flowchart LR
    P[SharedWorkerProvider<br/>useQuery poll every 1s] -- requestTickers --> SRC

    subgraph SRC["active TickerSource (exactly one)"]
      direction TB
      A[SharedWorker<br/>shared across tabs]
      B[Dedicated Worker<br/>per tab]
      C[Main thread<br/>per tab]
    end

    SRC -- TickerPayload --> P
    P -- setSocketState --> Store[(useCryptoSocketStore)]

    A -. WebSocket .-> EX[시세 브릿지 /bridge/ws]
    B -. WebSocket .-> EX
    C -. WebSocket .-> EX
```

## Files

| File | Role |
|------|------|
| `createTickerSource.ts` | Progressive factory: capability detection + watchdog downgrade |
| `sharedWorkerSource.ts` | Tier 1 — `SharedWorker`, one WS shared across tabs |
| `dedicatedWorkerSource.ts` | Tier 2 — per-tab `Worker`, off the main thread |
| `mainThreadSource.ts` | Tier 3 — single `BridgeWebSocket` on the main thread |
| `bridgeConfig.ts` | `getBridgeConfig()` — reads `NEXT_PUBLIC_BRIDGE_*` env, shared by all three tiers |
| `types.ts` | `TickerSource`, `TickerPayload`, listener/error types |
| `@/lib/ws/bridgeWS.ts` | `BridgeWebSocket` — one socket to the bridge, exposes `getPayload()` |
| `@/lib/ws/bridgeMapper.ts` | Pure `UnifiedTicker` → `TickerPayload` mapping |
| `@/lib/ws/bridgeWorkerCore.ts` | `BridgeWorkerCore` — shared bridge lazy-init + payload logic for both workers |
| `@/lib/ws/worker-messages.ts` | `WorkerMsg` — message protocol constants (SSOT) shared by workers and sources |

The worker tiers load the compiled workers from `apps/web/workers/` (`shared.worker.ts`, `dedicated.worker.ts`); all three tiers build a single `BridgeWebSocket` (`@/lib/ws/bridgeWS`) that connects to the unified 시세 브릿지 and maps `UnifiedTicker` → `TickerPayload` via `@/lib/ws/bridgeMapper`. Both workers share `BridgeWorkerCore` so their bridge lifecycle cannot drift apart. Bridge config (`wsBase`/`token`) is read from `NEXT_PUBLIC_*` env in the Next bundle via `getBridgeConfig()` (`bridgeConfig.ts`) — env is unavailable inside the tsc worker build, so the main-thread sources read it and pass it to the workers via an `init` message. Message types use the `WorkerMsg` constants (`@/lib/ws/worker-messages`) on both sides.
