# System Design Academy

A structured learning platform for backend and system design topics. It combines a heading-led homepage introduction, a seven-phase learning roadmap, and dedicated lesson content pages.

This README is the project handoff for contributors and coding assistants. It documents the curriculum, the pages that are implemented, and the source files that own each area. Roadmap entries are curriculum metadata; they do not necessarily have a completed lesson page yet.

## Highlights

- 80-topic System Design roadmap across 7 phases
- Roadmap dropdown with separate Kafka and Redis interview guides; Java and Demo entries remain marked Coming soon
- 20 questions per guide across 5 topics, each with a plain-language explanation, concrete example, animated labeled flow, and deeper technical answer; searchable content, individual/bulk expansion, light/dark themes, and a full-answer print view
- Dedicated pages for lesson and phase content
- Heading-led homepage introduction with a request-flow diagram
- Beginner-first Foundations lesson with expandable interview answers
- Interactive request-flow diagrams with animated signals, selectable steps, and playback controls
- Responsive React interface with Tailwind CSS and Framer Motion
- Typed Express API with a health endpoint
- Shared OpenAPI, Zod, and Drizzle workspace packages

## Learning Roadmap

The live roadmap metadata is in `artifacts/system-design-academy/src/content/system-design/roadmap.ts`. It defines these 80 topics in seven phases:

### Foundations

Lessons 01-08

| No. | Topic |
| --- | --- |
| 01 | How the web actually works |
| 02 | Latency, throughput, and the numbers that matter |
| 03 | The anatomy of a request |
| 04 | Storage primitives: files, rows, and documents |
| 05 | APIs as contracts |
| 06 | Reliability, availability, and durability |
| 07 | A practical capacity planning primer |
| 08 | Designing your first service boundary |

### Core Building Blocks

Lessons 09-24

| No. | Topic |
| --- | --- |
| 09 | Relational databases under load |
| 10 | Indexes and query shape |
| 11 | Transactions and isolation |
| 12 | Replication: the first copy |
| 13 | Partitioning and sharding |
| 14 | Caching without surprises |
| 15 | Cache invalidation strategies |
| 16 | Queues and asynchronous work |
| 17 | Pub/sub and event streams |
| 18 | Object storage and blob delivery |
| 19 | CDNs and edge caching |
| 20 | Rate limiting algorithms |
| 21 | Search indexes and retrieval |
| 22 | Distributed locks and leases |
| 23 | Idempotency and safe retries |
| 24 | A service boundary workshop |

### Distributed Systems

Lessons 25-40

| No. | Topic |
| --- | --- |
| 25 | The fallacies of distributed computing |
| 26 | Clocks, ordering, and causality |
| 27 | Consistency models explained |
| 28 | CAP without the slogans |
| 29 | Quorums and read repair |
| 30 | Leader election |
| 31 | Consensus: what it solves |
| 32 | Gossip protocols |
| 33 | Replication lag and read-your-writes |
| 34 | Split brain and fencing |
| 35 | Backpressure and load shedding |
| 36 | Circuit breakers and bulkheads |
| 37 | Exactly-once is a product decision |
| 38 | Sagas and distributed transactions |
| 39 | Building an event-driven workflow |
| 40 | Failure injection lab |

### Architecture Patterns

Lessons 41-52

| No. | Topic |
| --- | --- |
| 41 | Monoliths with clean seams |
| 42 | Modular monolith architecture |
| 43 | Service-oriented architecture |
| 44 | Microservices: the trade-off ledger |
| 45 | Hexagonal architecture |
| 46 | CQRS in practice |
| 47 | Event sourcing, carefully |
| 48 | Data mesh and ownership |
| 49 | The strangler migration |
| 50 | Multi-tenant system patterns |
| 51 | Designing for graceful degradation |
| 52 | Choosing a pattern under constraints |

### Production Systems

Lessons 53-62

| No. | Topic |
| --- | --- |
| 53 | Observability as a design input |
| 54 | Metrics that explain user impact |
| 55 | Structured logs and trace context |
| 56 | SLOs, SLIs, and error budgets |
| 57 | Capacity planning for growth |
| 58 | Deployments without downtime |
| 59 | Safe migrations and rollbacks |
| 60 | Incident response and learning |
| 61 | Security boundaries and threat modeling |
| 62 | The production readiness review |

### AI System Design

Lessons 63-70

| No. | Topic |
| --- | --- |
| 63 | The shape of an AI product |
| 64 | Inference latency and cost budgets |
| 65 | Embeddings and vector indexes |
| 66 | Retrieval-augmented generation |
| 67 | Evaluation before optimization |
| 68 | Prompt, model, and data routing |
| 69 | Safety, privacy, and human review |
| 70 | Operating an AI feature in production |

### System Design Case Studies

Lessons 71-80

| No. | Topic |
| --- | --- |
| 71 | Design a URL shortener |
| 72 | Design a global rate limiter |
| 73 | Design a news feed |
| 74 | Design a chat platform |
| 75 | Design a video streaming service |
| 76 | Design a ride matching system |
| 77 | Design a collaborative editor |
| 78 | Design a payments ledger |
| 79 | Design a metrics and logs platform |
| 80 | Design a global file storage system |

## Current Content Pages

- `/` - Homepage and interactive roadmap
- `/content` - Lesson 01: What is System Design? Includes Systems, scaling, HLD vs LLD, and expandable interview answers
- `/content/core-building-blocks` - Part II: lessons 09-24; lessons 09-16 include their full specs and interactive flows
- `/content/consistent-hashing` - Lesson 25: Consistent Hashing
- `/roadmaps/kafka` - Kafka interview roadmap: architecture, consumer coordination, replication, processing guarantees, and scaling
- `/roadmaps/redis` - Redis interview roadmap: persistence, caching, distribution, atomicity, and production design

### Implementation Status

The 80 topics above are the full roadmap catalog, not 80 completed pages. Current authored learning routes are:

| Route | Current content |
| --- | --- |
| `/content` | Foundations Lesson 01: What is System Design? |
| `/content/core-building-blocks` | Part II content for lessons 09-24, including animated request-flow diagrams |
| `/content/consistent-hashing` | Lesson 25: Consistent Hashing |
| `/roadmaps/kafka` | 20 interview questions across 5 Kafka topics |
| `/roadmaps/redis` | 20 interview questions across 5 Redis topics |

Other roadmap topics are cataloged for navigation/curriculum planning but do not yet have dedicated lesson routes. The Part II page's detailed technology-oriented lesson titles are in `src/content/system-design/building-blocks/lessons.ts`; these are distinct from the phase 02 topic names in `roadmap.ts`.

The Kafka and Redis guides each contain a plain-language explanation, example, animated flow, four deeper technical talking points, and official documentation links. Search matches question IDs, titles, topics, explanations, examples, flow steps, and technical answers. Printing clears the search and includes every answer, even collapsed ones. Guide theme choice is remembered locally. Kafka answers target conventional consumer groups and the Kafka 4.x KRaft architecture; Redis answers target standard primary/replica and Cluster deployments.

Core Building Blocks implementation is tracked per live card in `docs/curriculum-specs/README.md`: lessons 09-16 are implemented; lessons 17-24 have written specs and are not yet implemented. Four additional Phase 2 topics (Database Indexing, Replication, Sharding & Partitioning, and Object Storage) are tracked as written specs without matching live cards. Lesson cards retain their existing live titles while the expanded content follows the corresponding numbered spec section.

### Part II Page Lesson Titles

These are the lesson cards and flow material currently shown at `/content/core-building-blocks`. They are a separate page-specific list from the numbered Phase 02 roadmap topics above.

| Lesson | Topic |
| --- | --- |
| 09 | Networking Fundamentals (DNS, TCP/IP, HTTP, HTTPS) |
| 10 | REST APIs & API Design |
| 11 | Load Balancers |
| 12 | Reverse Proxy |
| 13 | API Gateway |
| 14 | Caching Fundamentals |
| 15 | Redis Deep Dive |
| 16 | Databases (SQL vs NoSQL) |
| 17 | Database Indexing |
| 18 | Replication |
| 19 | Sharding & Partitioning |
| 20 | Object Storage (Amazon S3) |
| 21 | CDN (Content Delivery Network) |
| 22 | Message Queues |
| 23 | Kafka Deep Dive |
| 24 | Service Discovery |

Lessons 09-16 retain their existing card titles and overview copy, with lesson 16's summary extended by ACID and database-family information. Their expanded content follows the corresponding Phase 2 sections. Lesson 12 summarizes network steps by referring to cards 09 and 11, and focuses its new material on browser input, rendering, and performance. Lesson 16 includes both database-choice and transaction flows. The Phase 2 spec follows the live Part II lesson list; roadmap-only Phase 02 entries remain in `roadmap.ts` and were not removed or renumbered.

Lessons with a request path use an interactive flow player. Learners can play or pause the animated signal, restart it, and select any step in the flow.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Wouter
- Backend: Express 5, Pino
- API contracts: OpenAPI, Orval, Zod
- Database tooling: Drizzle ORM
- Workspace: pnpm

## Project Structure

```text
artifacts/
├── system-design-academy/     # React/Vite frontend
│   └── src/
│       ├── App.tsx            # route wiring, home, Part II, and lesson 25 page
│       ├── components/        # reusable UI and interview flow diagram
│       ├── content/           # roadmap, lesson, and interview-guide data
│       ├── pages/             # shared Kafka/Redis page and not-found page
│       ├── types/             # typed lesson content model
│       └── index.css          # global and page-specific styles
├── api-server/                # Express API and health endpoint
└── mockup-sandbox/            # separate UI mockup app

lib/
├── api-client-react/          # generated React API client
├── api-spec/                  # OpenAPI contract
├── api-zod/                   # generated Zod schemas
└── db/                        # Drizzle schema and DB setup
```

For the detailed content layout, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Content Authoring

Detailed lesson-writing requirements and phase-spec status are maintained in [docs/curriculum-specs/README.md](docs/curriculum-specs/README.md). Read `00-conventions.md` and the relevant single phase spec before authoring a lesson. Repository-specific Copilot rules are in `.github/copilot-instructions.md` and `.github/instructions/curriculum.instructions.md`.

Canonical curriculum and lesson content lives under:

```text
docs/curriculum-specs/
├── README.md                 # curriculum specification guide and phase status
├── 00-conventions.md          # shared writing, diagram, and change conventions
├── 01-foundations.md          # detailed specification for Foundations lessons 01-08
└── 02-core-building-blocks.md # detailed specification for the live Part II lessons 09-24
```

Canonical application lesson content lives under:

```text
artifacts/system-design-academy/src/content/
├── index.ts                              # exports Foundation Lesson 01
├── foundations/lesson01.ts               # authored typed content for /content
├── interview-roadmaps.ts                 # Kafka and Redis interview Q&A
├── interview-roadmap-learning.ts         # plain-language explanations, examples, and flow steps
└── system-design/
	├── index.ts                          # exports roadmap and Part II catalogs
	├── roadmap.ts                        # canonical 80-topic, 7-phase roadmap and card metadata
	├── building-blocks/lessons.ts        # authored Part II lessons 09-24
	├── distributed/index.ts              # placeholder for future lessons 25-40
	├── architecture/index.ts              # placeholder for future lessons 41-52
	├── production/index.ts                # placeholder for future lessons 53-62
	├── ai/index.ts                        # placeholder for future lessons 63-70
	└── case-studies/index.ts              # placeholder for future lessons 71-80
```

When adding curriculum metadata, edit `roadmap.ts`. When adding an authored lesson page, follow the existing route and content patterns; currently the Foundations lesson model is in `src/content/foundations/lesson01.ts`, Part II content is in `src/content/system-design/building-blocks/lessons.ts`, and the Lesson 25 page is implemented in `App.tsx`. The other topic-folder index files are placeholders, not catalogs of completed lesson content. Avoid editing unused duplicate local data declarations in `App.tsx`; the current roadmap and Part II page consume exports from `src/content/system-design/index.ts`.

Future lesson modules can be added under the topic folder that owns them, for example:

```text
src/content/system-design/distributed/lesson26.ts
src/content/system-design/distributed/lesson27.ts
```

Kafka and Redis interview catalogs live in `src/content/interview-roadmaps.ts`. Each catalog contains five topics, twenty uniquely identified questions, exactly four answer points per question, and official references. Plain-language explanations, examples, and flow steps live in `src/content/interview-roadmap-learning.ts`. The reusable generated SVG flow diagram, including custom K01/K02 Kafka diagrams, lives in `src/components/interview-flow-diagram.tsx`. `src/pages/interview-roadmap.tsx` renders both catalogs; routes and the shared roadmap dropdown remain in `src/App.tsx`.

## Local Setup

### Requirements

- Node.js 24 or newer
- pnpm

Install dependencies:

```bash
pnpm install
```

If pnpm blocks required dependency build scripts on first install:

```bash
pnpm approve-builds --all
```

### Run the frontend

The Vite config requires both `PORT` and `BASE_PATH`:

```bash
PORT=5174 BASE_PATH=/ pnpm --filter @workspace/system-design-academy run dev
```

Open http://localhost:5174/.

### Run the API

The API requires `PORT`:

```bash
PORT=5100 pnpm --filter @workspace/api-server run dev
```

Check its health endpoint:

```bash
curl http://localhost:5100/api/healthz
```

Expected response:

```json
{"status":"ok"}
```

## Useful Commands

```bash
# Typecheck every workspace package
pnpm run typecheck

# Build every workspace package
pnpm run build

# Typecheck frontend only
pnpm --filter @workspace/system-design-academy run typecheck

# Regenerate API clients and Zod schemas from the OpenAPI specification
pnpm --filter @workspace/api-spec run codegen
```

## Notes

- Use `pnpm`; the workspace preinstall script rejects npm and yarn.
- `DATABASE_URL` is needed only for database operations such as schema pushes, not for the current frontend and health endpoint.

## Documentation Maintenance

Update both `README.md` and `PROJECT_STRUCTURE.md` whenever a completed change affects:

- User-facing features, routes, or learning content
- Content folder organization or authoring conventions
- Project structure, commands, environment variables, or runtime behavior
- Major frontend, API, or tooling decisions
