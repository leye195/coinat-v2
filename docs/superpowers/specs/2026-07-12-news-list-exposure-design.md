# 디지털 뉴스 영역 — 뉴스 리스트 노출 개선

- **일자:** 2026-07-12
- **브랜치:** feature/news-list
- **대상:** `apps/web` — `/trend` 페이지의 "디지털 자산 뉴스" 영역

## 배경 / 문제

`/trend` 페이지의 뉴스 리스트(`NewsList`)는 업비트 `coin_news` API를 프록시(`/api/upbit/news`)해서 렌더링한다. 라이브 API 응답을 확인한 결과 아래 문제가 있다.

| 항목 | 실측 (전체/general/policy/tech/column 공통) |
|---|---|
| `featured_list` | **항상 0개** |
| `list` | **항상 50개** |

1. **상단 프리뷰 카드 영역이 렌더링되지 않음.** `NewsList`는 `featured_list.length > 0`일 때만 상단 `MainNews` 카드 2개를 렌더링하는데, `featured_list`가 항상 비어 있어 이 영역은 사실상 죽은 UI다.
2. **노출량이 과소하고 앞 항목이 누락됨.** `list`는 50개가 오는데 `list.slice(2, 22)`로 20개만 노출하며, `OFFSET = 2` 때문에 앞 2개 항목을 건너뛴다. 이는 버그다.
3. **결과:** 실제 화면에는 title + 시간만 있는 컴팩트 행 20개만 노출되고, 리치한 프리뷰 영역과 나머지 28개 항목은 보이지 않는다.

## 목표

- `featured_list`가 비어 있어도 상단 프리뷰 카드 영역이 항상 노출되도록 한다.
- `OFFSET = 2` 버그를 제거해 첫 항목부터 노출한다.
- "더보기" 버튼으로 50개 전체를 점진적으로 노출한다.

## 비목표 (YAGNI)

- **썸네일 노출.** `thumbnail` 필드는 데이터가 불규칙(카테고리별 0~26개만 존재)하고 이번 요구에 포함되지 않음.
- **`MainNews` / `SubNews` 내부 디자인 대폭 개편.** 기존 카드 디자인을 재사용한다. 이번 노출 개선의 핵심은 (1) 프리뷰 영역이 실제로 보이게 하는 것, (2) 더보기 노출이다.
- **서버 사이드 페이지네이션.** 응답이 항상 50개 고정이므로 더보기는 클라이언트 사이드로 처리하며 추가 API 호출이 없다.

## 변경 범위

| 파일 | 변경 |
|---|---|
| `apps/web/src/components/NewsList/index.tsx` | 핵심 로직 변경 (아래) |
| `apps/web/src/app/trend/components/Page.tsx` | `<NewsList key={activeTab.name} .../>` 로 카테고리 전환 시 remount |
| `apps/web/src/components/News/MainNews.tsx` | 변경 없음 |
| `apps/web/src/components/News/SubNews.tsx` | 변경 없음 |
| `apps/web/src/components/News/NewsSkeleton.tsx` | 변경 없음 (프리뷰 2카드 + 20행 이미 반영) |
| `apps/web/src/components/Button.tsx` | 재사용 (변경 없음) |

## 상세 설계

### 데이터 유도 (`NewsList` 내부)

```ts
const hasFeatured = featured_list.length > 0;
const featured = (hasFeatured ? featured_list : list).slice(0, 2); // 상단 2 카드
const rest = hasFeatured ? list : list.slice(2);                   // 나머지 컴팩트 리스트
```

- `featured_list`가 채워지면 그것을 우선 사용하고, 비어 있으면 `list` 앞 2개로 프리뷰를 채운다.
- `hasFeatured`가 false일 때 `rest`는 `list.slice(2)` — 프리뷰로 쓴 앞 2개와의 중복을 피한다.
- `OFFSET = 2` 상수는 제거한다. (프리뷰가 앞 2개를 사용하고 `rest`가 그 뒤를 이어받는 구조로 대체)

### 더보기 (클라이언트 사이드)

```ts
const STEP = 20;
const [visibleCount, setVisibleCount] = useState(STEP);
// 렌더: rest.slice(0, visibleCount)
// rest.length > visibleCount 일 때만 "더보기" 버튼 노출
// onClick: setVisibleCount((c) => Math.min(c + STEP, rest.length))
```

- 초기 20개 노출, 클릭당 20개씩 추가, 최대 `rest.length`(약 48개)까지.
- 더보기 버튼은 기존 `@/components/Button`을 사용하고 `aria-label`을 부여한다.

### 카테고리 전환 시 상태 리셋

- 탭 전환 시 `visibleCount`가 20으로 초기화되어야 한다.
- `Page.tsx`에서 `<NewsList key={activeTab.name} category={activeTab.name} />`로 remount하여 리셋한다.
- React Query 캐시는 `queryKey: ['news', category]` 기준으로 유지되므로, 캐시된 카테고리로 전환 시 `useSuspenseQuery`가 즉시 resolve → 스켈레톤 재깜빡임 없음.

## 엣지 케이스

- `rest.length <= 20` → 더보기 버튼 숨김.
- `list`가 비어 있음 → 프리뷰/리스트 모두 미노출 (기존 빈 상태 가드 유지).
- `featured_list`가 (향후) 채워짐 → 자동으로 그것을 프리뷰로 사용하고 `list` 전체를 컴팩트 리스트로 노출.

## 검증

- `/trend` 접속 시 상단 프리뷰 카드 2개가 실제로 노출되는지 확인.
- 컴팩트 리스트가 첫 항목부터 20개 노출되는지 확인 (앞 2개 누락 없음).
- 더보기 클릭 시 20개씩 추가되어 50개 전체까지 노출되는지, 끝에서 버튼이 사라지는지 확인.
- 카테고리 탭 전환 시 노출 개수가 20으로 리셋되는지 확인.
- `pnpm lint` + `pnpm lint:css` (web) 통과.
