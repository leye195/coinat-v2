# Coinat v2 Monorepo

디지털 자산 시세/뉴스/차트 정보를 제공하는 서비스의 모노레포입니다. Turbo로 `web`(Next.js 14) 프론트엔드와 `api`(Next.js 15 app router) 백엔드를 함께 관리합니다.

## 요구 사항

- Node.js 18+ (권장 20+)
- pnpm 10.x

## 설치

```bash
pnpm install
```

## 실행 방법

- 전체 개발 서버: `pnpm dev` (turbo dev)
- 프론트엔드만: `pnpm dev:web` (apps/web)
- API만: `pnpm dev:api` (apps/api)

## 빌드/검증

- 전체 빌드: `pnpm build`
- 전체 린트: `pnpm lint`

## 주요 디렉터리

- `apps/web/` : 사용자용 웹 앱 (Next.js, React Query, Tailwind 기반 UI 컴포넌트)
- `apps/api/` : 백엔드 API (Next.js App Router)
- `packages/` : 공유 ESLint/TSConfig 등 공용 설정

## 코드 스타일

- pnpm + Turbo workspace
- ESLint/Prettier/Stylelint 사용
- Suspense 기반 데이터 패칭 및 공용 `ErrorMessage`/스켈레톤 컴포넌트 제공
