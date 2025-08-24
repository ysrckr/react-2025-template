# React 2025 Template

Opinionated React + TypeScript starter powered by Vite 6, React 19, Tailwind CSS v4, TanStack Router, and TanStack Query. It includes sensible defaults for routing, data fetching, state, and project structure so you can ship fast.

## Stack

- React 19 + TypeScript
- Vite 6 with SWC React plugin (`@vitejs/plugin-react-swc`)
- Tailwind CSS v4 via `@tailwindcss/vite`
- TanStack Router v1 (file-based routes with code-splitting)
- TanStack React Query v5 (+ Devtools in dev)
- Zustand for state, Zod for schemas, Immer for immutable updates

## Features

- File-based routing under `src/routes` with `@tanstack/router-plugin` generating `routeTree.gen.ts`
- Query Client in router context with default Pending, Error, Not Found components
- Code splitting enabled for routes
- Alias `@` → `src`
- Dev server on port 3000, auto-open, strict port
- Tailwind v4, zero-config (see `src/index.css`)

## Getting started

Install dependencies (Bun recommended; npm/pnpm/yarn also work):

```sh
# bun
bun install

# or npm
npm install

# or pnpm
pnpm install

# or yarn
yarn install
```

Run dev server:

```sh
# bun
bun run dev

# npm
npm run dev
```

Build, preview, lint:

```sh
bun run build
bun run preview
bun run lint
```

## Scripts

- `dev` — start Vite dev server
- `build` — type-check (`tsc -b`) and build
- `preview` — preview production build
- `lint` — run ESLint

## Project structure

```txt
src/
  assets/
  components/
    defaults/        # Default pending/error/not-found components
  hooks/
    queries/         # Query hooks and queryOptions
    mutations/       # Mutation hooks and mutationOptions
  keys/              # Centralized query/mutation keys
  routes/            # File-based routes (see below)
  schemas/           # Zod schemas
  stores/            # Zustand stores
  types/             # Shared types
  main.tsx           # Router + QueryClient wiring
  index.css          # Tailwind v4
```

Key config:

- `vite.config.ts`
  - Alias `@` → `./src`
  - TanStack Router plugin with `autoCodeSplitting: true`
  - Tailwind v4 via `@tailwindcss/vite`
  - Server: `{ port: 3000, open: true, strictPort: true }`

## Routing (TanStack Router)

- Routes live in `src/routes`. The plugin generates `src/routeTree.gen.ts` that is imported in `src/main.tsx`.
- The root route is `src/routes/__root.tsx`, which renders `<Outlet />` and enables Devtools in development.
- Defaults:
  - `defaultPendingComponent`, `defaultErrorComponent`, `defaultNotFoundComponent`
  - `defaultPreload: "intent"`, `scrollRestoration: true`, `defaultViewTransition: false`

Example route file:

```tsx
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <h1>Home</h1>,
})
```

## Data fetching (TanStack Query)

- A `QueryClient` is created in `src/main.tsx` and passed via Router context; use React Query normally in components/hooks.
- Organize query/mutation logic under `src/hooks` and centralize keys under `src/keys`.

Example query hook:

```ts
// src/hooks/queries/queries/example-query.ts
import { useQuery } from '@tanstack/react-query'

export function useExample(id: string) {
  return useQuery({
    queryKey: ['example', id],
    queryFn: async () => {/* fetch */},
  })
}
```

## Styling (Tailwind v4)

- Tailwind is enabled via the Vite plugin. See `src/index.css`:

```css
@import "tailwindcss";
```

Use utility classes in your components. For theming or customization, follow Tailwind v4 guidance (no tailwind.config.js required for common cases).

## Aliases & imports

- Use `@` to reference `src`: `import Button from '@/components/Button'`.

## Environment variables

- Vite loads `.env*` files. This template also defines `__APP_ENV__` at build time from `APP_ENV` in your env files via `define` in `vite.config.ts`.
- Example: create `.env` with `APP_ENV=local` and reference `__APP_ENV__` in code if needed.

## Devtools

- In development, React Query Devtools (bottom-right) and TanStack Router Devtools (top-left) are enabled from `src/routes/__root.tsx`.

## Requirements

- A recent Node.js runtime (18+ recommended). Package manager: Bun, npm, pnpm, or Yarn.

---

Happy shipping!
