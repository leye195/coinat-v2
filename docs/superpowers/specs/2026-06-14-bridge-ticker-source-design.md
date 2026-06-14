# 시세 브릿지 연동 — Bridge-backed Ticker Source 설계

- 작성일: 2026-06-14
- 대상: `apps/web`
- 상태: 승인됨 (구현 대기)

## 1. 배경 / 목표

현재 coinat-v2는 SharedWorker 안에서 **업비트 소켓과 바이낸스 소켓을 각각 연결**한 뒤
두 거래소 데이터를 합쳐 제공한다. 두 연결이 모두 맺어질 때까지 기다려야 하고, 코드 경로가
두 갈래(거래소별 WS 클라이언트)로 나뉜다.

이를 **통합 시세 브릿지(`wss://coinat.duckdns.org/bridge/ws`)** 의 단일 소켓으로 대체한다.
브릿지는 연결 직후 `snapshot` 1회 + 이후 `ticker` 갱신을 보내므로:

- 두 거래소 연결을 동시에 기다릴 필요가 없다 (단일 소켓, 단일 스냅샷).
- 첫 스냅샷 수신 시점에 즉시 ready 상태가 된다.
- 거래소별 분기 코드(업비트/바이낸스 WS 클라이언트)를 하나로 합친다.

### 채택 방식: Approach A — 브릿지만 사용

브릿지 다운 시 직접 거래소로 폴백하지 **않는다**. 브릿지 자체 재연결(지수 백오프)에 의존하며,
직접 거래소 WS 코드(`UpbitWebSocket`/`BinanceWebSocket`)는 삭제한다. (단순성·유지보수 우선.)

## 2. 아키텍처

#23에서 도입한 3-tier 점진적 폴백(SharedWorker → Dedicated Worker → main-thread)은 **그대로 유지**한다.
폴백의 의미만 바뀐다: 각 tier가 "업비트+바이낸스 두 소켓"이 아니라 **단일 `BridgeWebSocket` 하나**를 만든다.
tier 폴백은 이제 "브릿지 연결 실패 시 다른 거래소" 가 아니라 **"이 실행 환경에서 워커를 쓸 수 있는가"** 만 가린다.

```
SharedWorkerProvider (변경 없음)
  └─ createTickerSource (tier 로직 변경 없음)
       ├─ shared.worker.ts     ─┐
       ├─ dedicated.worker.ts  ─┼─ 모두 사용 →  BridgeWebSocket  ─ws→  /bridge/ws
       └─ mainThreadSource.ts  ─┘                   │
                                                    └─ UnifiedTicker → TickerPayload 매핑
                                                         → useCryptoSocketStore (변경 없음)
                                                         → combineTickers / 모든 hook (변경 없음)
```

핵심: 출력 형태(`TickerPayload`)가 오늘과 동일하므로 **store, `combineTickers`, 모든 hook, 모든 컴포넌트는 그대로**다.

## 3. 데이터 흐름 / 파리티 계약 (작업의 핵심)

`BridgeWebSocket.getPayload()` 가 기존 두 클라이언트가 만들던 `TickerPayload` 와
**의미상 1:1로 동일한** 결과를 만들어야 한다.

### 3.1 `TickerPayload` (기존, 변경 없음)

```ts
type TickerPayload = {
  upbit: { data: Exchange['upbit']; btcKrw: number };
  binance: { data: Exchange['binance']; btcKrw: number };
};
// Exchange['upbit'] = { krw: Ticker; btc: Ticker; usdt: Ticker }
```

### 3.2 라우팅 표 (`UnifiedTicker` → payload slot)

`book` 키는 브릿지 가이드대로 `` `${exchange}:${symbol}:${quote}` `` 를 쓴다.
`getPayload()` 호출 시 book을 순회하며 아래 규칙으로 `Exchange` 구조를 만든다.

| 브릿지 레코드 | → payload 위치 |
|---|---|
| `upbit:SYM:KRW` | `upbit.data.krw[SYM]` **그리고** `upbit.data.usdt[SYM]` (복사 — 기존 코드가 동일 동작) |
| `upbit:BTC:KRW` | 위 + `upbit.btcKrw = tradePrice` |
| `upbit:SYM:BTC` | `upbit.data.btc[SYM]` |
| `binance:BTC:USDT` | `binance.data.btc['BTC']` **그리고** `binance.btcKrw = tradePrice` |
| `binance:SYM:USDT` (BTC 제외) | `binance.data.usdt[SYM]` |
| `binance:SYM:BTC` | `binance.data.btc[SYM]` |

> 업비트는 USDT 마켓을 제공하지 않는다. 기존 코드에서 `upbit.usdt` 는 KRW 값의 복사본이었으므로
> 위 규칙(`KRW → krw + usdt 복사`)이 그 동작을 그대로 보존한다.

### 3.3 필드 매핑 (`UnifiedTicker` → `Ticker[symbol]`)

```ts
{
  tradePrice, highPrice, lowPrice, openPrice,
  marketWarning,           // 아래 normalize 참고
  changePrice,
  changeRate,              // 아래 changeRate 규칙 참고
  change,                  // upbit만 존재, binance undefined
  marketState,             // upbit만 존재
  volume,
  timestamp,
}
```

- **changeRate (중요)**: 브릿지는 업비트·바이낸스 **둘 다 소수(decimal, `0.0123`)** 로 보낸다.
  그러나 기존 `BinanceWebSocket` 은 바이낸스 `changeRate` 를 **퍼센트 숫자(`P`, 예: `1.23`)** 로 저장했다.
  소비자(예: trading-view `chart.tsx` 의 `* 100` 표기)를 건드리지 않으려면, 매퍼에서
  **바이낸스 changeRate 에만 `* 100`** 을 적용하고 **업비트는 소수 그대로** 둔다.
  (이렇게 하면 기존 두 클라이언트의 출력과 정확히 일치한다.)
- **marketWarning normalize**: 브릿지는 `'NONE'`, 기존 바이낸스 코드는 `'None'` 을 썼다.
  소비자 분기는 `=== 'CAUTION'` 만 검사하므로 동작에는 영향이 없으나, 혼선을 줄이기 위해
  값은 브릿지가 주는 그대로 보존한다(`CAUTION` 비교는 그대로 통과).

## 4. 파일 변경 목록

### 신규
- **`apps/web/src/lib/bridge-types.ts`** — `UnifiedTicker`, `ServerMessage` 타입 (가이드 §3 그대로).
- **`apps/web/src/lib/ws/bridgeWS.ts`** — `BridgeWebSocket` 클래스.
  - `${NEXT_PUBLIC_BRIDGE_WS_BASE}/bridge/ws?token=…` 연결.
  - `snapshot` → 전체 apply, `ticker` → 단건 apply, 내부 `book: Map<string, UnifiedTicker>` 유지.
  - `getPayload(): TickerPayload` 로 §3 라우팅표 결과 반환.
  - 지수 백오프 재연결(기존 ws 클라이언트와 동일한 패턴: `_isClosed`, `_reconnectTimer`).
  - `close()` 로 핸들러 해제 + 소켓 종료 (StrictMode/Fast Refresh 누수 방지, 기존 클라이언트와 동일 동작).

### 변경
- **`apps/web/workers/shared.worker.ts`** — `UpbitWebSocket`+`BinanceWebSocket` → 단일 `BridgeWebSocket`.
  `tickers` 메시지 응답에서 `bridge.getPayload()` 를 그대로 postMessage.
- **`apps/web/workers/dedicated.worker.ts`** — 동일하게 단일 `BridgeWebSocket` 사용.
- **`apps/web/src/lib/ticker-source/mainThreadSource.ts`** — 단일 `BridgeWebSocket` 사용,
  `requestTickers` 에서 `bridge.getPayload()` 반환.
- **`apps/web/src/lib/ticker-source/README.md`** — 데이터 흐름 다이어그램/표를 브릿지 기준으로 갱신.

### 삭제
- **`apps/web/src/lib/ws/upbitWS.ts`**
- **`apps/web/src/lib/ws/binanceWS.ts`**
- **`apps/web/src/lib/socket.ts`** (현재 import하는 곳 없음 — 데드코드, 확인 완료)

### 변경 없음 (소비자 레이어)
`store/socket.ts`, `useTickersData`, `useExchangeData`, `SharedWorkerProvider`, `types/Ticker.ts`,
모든 컴포넌트.

## 5. 환경변수

`apps/web/.env.development` (및 운영 env)에 추가:

```bash
NEXT_PUBLIC_BRIDGE_WS_BASE=wss://coinat.duckdns.org
NEXT_PUBLIC_BRIDGE_HTTP_BASE=https://coinat.duckdns.org
NEXT_PUBLIC_BRIDGE_TOKEN=<별도 안전 채널로 전달받은 토큰>
```

- 브라우저 WS가 직접 붙으므로 토큰은 `NEXT_PUBLIC_` 접두사 필요(번들에 노출됨 — 가이드상 "공개망 게이트" 수준).
- **확인 필요**: 워커 빌드(`build:workers`)가 `NEXT_PUBLIC_*` 를 인라인하는지. 인라인 안 되면
  메인 스레드에서 connect 메시지로 URL/토큰을 워커에 전달하는 경로로 대체.

## 6. 테스트

- **`bridgeWS` 매핑 단위 테스트**: `snapshot` + 몇 개의 `ticker` 메시지를 주입하고
  `getPayload()` 결과가 손으로 계산한 `Exchange` 구조와 일치하는지 검증.
  특히 (a) `binance changeRate * 100`, (b) `upbit KRW → usdt 복사`,
  (c) `binance:BTC:USDT → btc['BTC'] + btcKrw` 케이스를 고정한다.
- 기존 `pnpm test` / `pnpm lint` / `pnpm lint:css` 통과.

## 7. 구현 중 확인 항목 (Open Items)

1. `build:workers` 가 `NEXT_PUBLIC_*` env를 인라인하는지 (토큰 주입 경로 확정).
2. 브릿지 "전체 심볼" 커버리지 vs 앱의 전체 코인 목록. 브릿지가 일부만 제공하면 일부 행이 빈다.
   `GET /bridge/tickers` 응답을 현재 업비트/바이낸스 코인 목록과 대조해 확인.
3. 단일 소켓이므로 `combineTickers` 의 `tickers !== null` ready 게이팅이 첫 스냅샷에 바로 만족되는지 확인.
