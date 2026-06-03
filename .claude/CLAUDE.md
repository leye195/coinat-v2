# CLAUDE.md — Coinat v2 Monorepo

**Coinat v2** is a cryptocurrency information platform (real-time quotes, news, interactive charts), built as a **Turbo + pnpm workspaces** monorepo.

- **`apps/web`** — Frontend: Next.js 14, React 18, TypeScript, Zustand, React Query, Lightweight Charts, Tailwind + Emotion (`ownui-system`).
- **`apps/api`** — Backend: Next.js 15 App Router, proxies/aggregates Upbit & Binance data, integrates Supabase.
- **`packages/`** — Shared `@repo/*` configs (ESLint, Prettier/Stylelint, tsconfig).

## Must-know rules

- **Real-time data** flows through the SharedWorker (`apps/web/workers/shared.worker.ts`) — never open redundant WebSocket connections in the main thread.
- **`apps/web` build compiles workers first**: `pnpm build` = `pnpm build:workers && next build`. After editing `apps/web/workers/`, rebuild (or run `watch:workers`).
- **Data fetching**: use the centralized API layer (`apps/web/src/api/index.ts`) and React Query hooks in `apps/web/src/hooks/queries/`.
- **Styling**: Tailwind for layout/utilities, Emotion for dynamic styles. Run `pnpm lint` + `pnpm lint:css` (web) before finishing.

## Quick commands

- `pnpm install` · `pnpm dev` · `pnpm build` · `pnpm lint`
- Web only: `pnpm dev:web` / `pnpm build:web` · Test: `pnpm test` / `pnpm test:ci` (in `apps/web`)
- API only: `pnpm dev:api` / `pnpm build:api`

## Reference (read on demand)

- **`.claude/reference/commands.md`** — full command/script reference (root + per-app).
- **`.claude/reference/architecture.md`** — conventions, build quirks, env files, version split.
- **`.claude/reference/project-structure.md`** — apps/packages detail and key files & directories.
