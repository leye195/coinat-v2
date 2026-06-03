# Commands Reference — Coinat v2

Requirements: Node.js 18+ (20+ recommended), pnpm 10.x (`pnpm@10.12.4`).

## Root (Turbo)
| Command | Description |
|---------|-------------|
| `pnpm install` | Install all workspace deps |
| `pnpm dev` | Run all apps (`turbo dev`) |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm dev:web` / `pnpm build:web` | Web only |
| `pnpm lint:web` / `pnpm lint:fix:web` | Web lint / autofix |
| `pnpm dev:api` / `pnpm build:api` | API only |

## `apps/web`
| Command | Description |
|---------|-------------|
| `pnpm dev` | `next dev` |
| `pnpm build` | **`pnpm build:workers && next build`** — workers compile first |
| `pnpm build:workers` | `tsc -p tsconfig.worker.json` → `public/workers/` (ES modules) |
| `pnpm watch:workers` | Rebuild workers on change during dev |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm lint:css` | Stylelint (enforces a custom CSS-property ordering) |
| `pnpm test` | Jest (watch) |
| `pnpm test:ci` | Jest (CI, non-watch) |

## `apps/api`
| Command | Description |
|---------|-------------|
| `pnpm dev` | `next dev --turbopack` |
| `pnpm build` | `next build` |
| `pnpm start` | `next start` |
| `pnpm lint` | ESLint |
