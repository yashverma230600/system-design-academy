# Project Structure

This repository is a pnpm monorepo for a System Design Academy site and its supporting API. The app is split into a Vite/React frontend, an Express API, shared libraries, generated client code, and database tooling.

## Top-level layout

```text
System-Design-Academy/
├── package.json                     # root workspace config and shared typecheck/build scripts
├── pnpm-workspace.yaml              # pnpm workspace definition
├── pnpm-lock.yaml                  # lockfile
├── tsconfig.base.json              # base TS config
├── tsconfig.json                   # root TS project references
├── replit.md                       # project notes / runbook template
├── PROJECT_STRUCTURE.md            # this file
├── artifacts/
│   ├── system-design-academy/      # frontend app
│   ├── api-server/                 # API server
│   ├── mockup-sandbox/             # design/mockup sandbox
│   └── ...
├── lib/
│   ├── api-client-react/           # generated React API client
│   ├── api-spec/                   # OpenAPI contract + codegen config
│   ├── api-zod/                    # Zod validation types generated from API schema
│   └── db/                         # Drizzle database schema and migrations tooling
├── scripts/                        # workspace helper scripts
├── docs/curriculum-specs/          # detailed per-phase lesson content specifications
├── .github/
│   ├── copilot-instructions.md     # repository-wide Copilot guidance
│   └── instructions/curriculum.instructions.md # scoped curriculum editing rules
└── attached_assets/                # local asset storage
```

`docs/curriculum-specs/README.md` defines the lesson-spec template, phase status, and per-live-card implementation status. Read `00-conventions.md` before the relevant phase specification. `01-foundations.md` specifies Foundations lessons 01-08, and `02-core-building-blocks.md` contains the Phase 2 material. Lesson 09 is implemented; live cards 10-24 are marked spec-written, with four additional spec topics tracked as written without a matching card. Phase specs are authored one phase at a time in this folder. Copilot guidance is stored in `.github/copilot-instructions.md` and `.github/instructions/curriculum.instructions.md`.

## Content organization

The canonical roadmap and most lesson metadata are organized under `artifacts/system-design-academy/src/content/system-design/`. The 80 roadmap topics in `roadmap.ts` are curriculum entries; many do not yet have authored pages. The current authored pages are `/content`, `/content/core-building-blocks`, and `/content/consistent-hashing`.

```text
src/content/
├── index.ts                         # exports Foundation Lesson 01
├── foundations/lesson01.ts          # typed authored lesson for /content
└── system-design/
    ├── index.ts                     # exports roadmap and Part II catalog
    ├── roadmap.ts                   # canonical 80-topic, 7-phase roadmap
    ├── building-blocks/lessons.ts   # Part II lessons 09-24; lessons 09-16 have structured curriculum details
    ├── distributed/index.ts         # placeholder for future lessons 25-40
    ├── architecture/index.ts        # placeholder for future lessons 41-52
    ├── production/index.ts          # placeholder for future lessons 53-62
    ├── ai/index.ts                  # placeholder for future lessons 63-70
    └── case-studies/index.ts        # placeholder for future lessons 71-80
```

The current `/content/core-building-blocks` lesson titles are in `building-blocks/lessons.ts`; they are page-specific and differ from the Phase 02 roadmap topic names in `roadmap.ts`. The Phase 2 spec follows the live page list and does not remove or renumber roadmap-only entries. Lessons 09-16 keep their existing card titles while rendering spec content from their `curriculum` data. Lesson 12 focuses on browser rendering and refers network details back to lessons 09 and 11. Lessons 13-14 extend the Traffic Police and Waiter card analogies. Lesson 16 preserves its Library analogy and summary while adding ACID, SQL vs NoSQL, database types, and two flows. The roadmap page consumes catalog exports through `system-design/index.ts`. `App.tsx` contains older duplicate local declarations for some roadmap data; edit the exported catalog files, not those unused copies.

Use this pattern for future lesson modules:

```text
src/content/system-design/distributed/lesson26.ts
src/content/system-design/distributed/lesson27.ts
```

The UI imports catalog data from `src/content/system-design/index.ts`; presentation and routing remain in `src/App.tsx`.

Kafka and Redis interview roadmaps use a separate typed catalog and a shared study page:

```text
src/
├── content/interview-roadmaps.ts     # Kafka/Redis: 20 questions and 5 topics each, four answer points, references
├── content/interview-roadmap-learning.ts # plain-language explanations, examples, and flow steps for all questions
├── components/interview-flow-diagram.tsx # generated zigzag SVG flows and custom Kafka K01/K02 diagrams
└── pages/interview-roadmap.tsx       # search, theme, answer expansion, topic links, printing
```

The routes are `/roadmaps/kafka` and `/roadmaps/redis`. The shared navigation in `src/App.tsx` uses the existing Radix dropdown component for roadmap selection on desktop and mobile, including content pages. System Design, Kafka, and Redis are available; Java and Demo preserve their existing Coming soon status. Guide styles, responsive layouts, and full-answer print rules live in `src/index.css`.

The Part II page and Lesson 25 content are composed in `src/App.tsx`. Part II catalog data and the 80-topic roadmap come from `src/content/system-design/`. Kafka and Redis pages use the interview catalog, learning-aid catalog, generated SVG diagrams, and shared page noted above.

## Main application packages

### 1) Frontend: `artifacts/system-design-academy`

This is the website users interact with.

Key files:

- `artifacts/system-design-academy/package.json`
  - Vite app config
  - scripts: `dev`, `build`, `serve`, `typecheck`
- `artifacts/system-design-academy/vite.config.ts`
  - Vite config
  - expects `PORT` and `BASE_PATH` environment variables
- `artifacts/system-design-academy/src/main.tsx`
  - app bootstrap
- `artifacts/system-design-academy/src/App.tsx`
  - main page logic, lesson pages, route structure, homepage introduction, roadmap UI
- `artifacts/system-design-academy/src/index.css`
  - global styles, layout polish, interview roadmap layouts, themes, and print styles
- `artifacts/system-design-academy/src/components/ui/`
  - reusable shadcn-style UI components
- `artifacts/system-design-academy/src/lib/utils.ts`
  - shared utility helpers

Important behavior:

- uses React + Vite + Wouter for route handling
- homepage opens with a heading-led introduction, learning links, and a request-flow diagram
- lesson content is moved into dedicated routes instead of keeping everything on one page

### 2) API: `artifacts/api-server`

This is the backend that serves app data and health endpoints.

Key files:

- `artifacts/api-server/package.json`
  - backend scripts and dependencies
- `artifacts/api-server/build.mjs`
  - esbuild bundle config
- `artifacts/api-server/src/index.ts`
  - starts the API server and reads `PORT`
- `artifacts/api-server/src/app.ts`
  - Express app setup, middleware, route mounting
- `artifacts/api-server/src/routes/index.ts`
  - root API route grouping
- `artifacts/api-server/src/routes/health.ts`
  - health endpoint: `GET /api/healthz`

Runtime behavior:

- runs on a configurable port via `PORT`
- mounts routes under `/api`
- returns a simple status payload for health checks

### 3) Shared libraries

#### `lib/api-spec/`

- `openapi.yaml` is the source of truth for API contracts
- `orval.config.ts` sets up generated client code from the OpenAPI spec
- used to keep front-end data access aligned with backend schema

#### `lib/api-client-react/`

- generated React API helper client
- `src/generated/api.ts` and `src/generated/api.schemas.ts` are output from the OpenAPI generator
- keeps app-side API calls typed and centralized

#### `lib/api-zod/`

- generated Zod validation models
- used to enforce request/response validation in a typed way

#### `lib/db/`

- `drizzle.config.ts` is the Drizzle configuration
- `src/schema/` contains the database schema definitions
- `src/index.ts` provides DB connection/setup layer

## Root workspace and build setup

### Root config

- `package.json`
  - enforces `pnpm` usage via `preinstall`
  - runs typecheck/build across workspaces
- `pnpm-workspace.yaml`
  - defines all workspace packages
- `tsconfig.base.json`
  - common compiler settings
- `tsconfig.json`
  - root TypeScript project references

### Shared commands

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

Service-specific commands:

```bash
# Start the frontend (Vite requires both environment variables)
PORT=5175 BASE_PATH=/ pnpm --filter @workspace/system-design-academy run dev

# Start the API server in a separate terminal
PORT=5100 pnpm --filter @workspace/api-server run dev
```

## Important runtime notes

- The frontend Vite app requires:
  - `PORT`
  - `BASE_PATH`
- The API server requires:
  - `PORT`
- The repo was previously affected by macOS ARM native dependency issues, including Lightning CSS / Rollup native binaries.
- Local dev runs should use `pnpm` rather than `npm` or `yarn` because the repo explicitly blocks other package managers.

## Where the main app logic lives

If you are changing the site behavior, start here:

- `artifacts/system-design-academy/src/App.tsx` — route structure, lesson pages, homepage introduction, and roadmap UI
- `artifacts/system-design-academy/src/index.css` — visual styling and animation behavior
- `artifacts/system-design-academy/src/content/system-design/` — System Design learning content and topic catalog

## Suggested developer flow

1. Start the API first with a known port.
2. Start the frontend with the required environment variables.
3. Make UI changes in the frontend app.
4. Keep API contract changes aligned with `lib/api-spec/openapi.yaml`.
5. Regenerate typed clients and schemas when the API contract changes.

## Documentation Maintenance

At the end of each completed feature or structural change, update both `README.md` and `PROJECT_STRUCTURE.md` when the change affects user-facing behavior, content organization, commands, or architecture.

## Quick summary

- Frontend = education site / landing experience
- API = backend health and app data service
- `lib/` = shared API contracts, database, generated types
- `artifacts/` = runtime packages for the app experience
- `scripts/` = repo tooling and automation helpers
