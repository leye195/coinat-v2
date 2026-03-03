# GEMINI.md - Coinat v2 Monorepo Context

This file provides a comprehensive overview and instructional context for the Coinat v2 project.

## Project Overview
**Coinat v2** is a cryptocurrency information platform providing real-time quotes, news, and interactive charts. It is architected as a monorepo using **Turbo** and **pnpm workspaces**.

### Main Applications
- **`apps/web`**: Frontend application built with **Next.js 14**, React, and TypeScript.
  - **State Management**: **Zustand** for global UI/coin state.
  - **Data Fetching**: **React Query (TanStack Query)** for server state management.
  - **Real-time Data**: Utilizes a **SharedWorker** (`shared.worker.ts`) to manage shared WebSocket connections (Upbit, Binance) across multiple browser tabs, reducing redundant network traffic.
  - **Charts**: **Lightweight Charts** (TradingView) for financial data visualization.
  - **Styling**: **Tailwind CSS** combined with **Emotion** (CSS-in-JS). Uses a UI system called **ownui-system**.
  - **Build**: Custom build scripts exist for Web Workers (`pnpm build:workers`).
- **`apps/api`**: Backend API built with **Next.js 15** (App Router).
  - Acts as a proxy and aggregator for various cryptocurrency data sources (Upbit API, Binance API, etc.).
  - Integrated with **Supabase** for database and authentication needs.
- **`packages/`**: Contains shared configurations for ESLint, TypeScript, and Prettier.

## Building and Running

### Prerequisites
- Node.js 18+ (20+ recommended)
- pnpm 10.x

### Commands
- **Install dependencies**: `pnpm install`
- **Development (all apps)**: `pnpm dev`
- **Build (all apps)**: `pnpm build`
- **Lint (all apps)**: `pnpm lint`
- **Web App specific**: `pnpm dev:web`, `pnpm build:web`
- **API specific**: `pnpm dev:api`, `pnpm build:api`

## Development Conventions

### Architecture & Patterns
- **Monorepo Structure**: Use Turbo for task orchestration. Shared configs are in `packages/`.
- **API Layer**: `apps/web/src/api/index.ts` centralizes all external and internal API calls.
- **React Query**: Prefer using custom hooks in `apps/web/src/hooks/queries/` for data fetching to ensure consistency and cache reusability.
- **Shared Worker**: Real-time ticker data is handled via `apps/web/workers/shared.worker.ts`. Avoid opening redundant WebSocket connections in the main thread.
- **Error Handling**: Uses `react-error-boundary` and custom `ErrorMessage` components.
- **Component Pattern**: Follows a standard React component structure, utilizing `src/components/` for reusable UI elements.

### Coding Standards
- **TypeScript**: Strict typing is encouraged across the codebase.
- **Styling**: Use Tailwind CSS for layout and utility classes. Emotion is used for more complex, dynamic styling needs.
- **Formatting**: Adhere to the project's Prettier and ESLint configurations (pnpm lint to verify).

## Key Files & Directories
- `apps/web/src/app/`: Next.js App Router for the frontend.
- `apps/web/src/store/`: Zustand stores (e.g., `coin.ts`).
- `apps/web/src/api/`: API clients using Axios.
- `apps/web/workers/`: Web Worker logic, specifically the `SharedWorker`.
- `apps/api/app/api/`: Backend route handlers for proxying data.
- `turbo.json`: Task pipeline configuration.
