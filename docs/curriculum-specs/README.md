# System Design Academy: Curriculum Specs

Read this file first, then read one phase file at a time.

## Purpose

These files are the detailed content specification for the 80-topic roadmap in `artifacts/system-design-academy/src/content/system-design/roadmap.ts`. The roadmap contains titles and metadata; the phase specs define what each lesson should teach, including explanations, diagrams, worked examples, trade-offs, and interview answers.

Use the specs as the source of truth when building or redesigning lesson pages. Implement at most two lessons per pass, in numeric order. Stop and report if a lesson needs a type change.

Read `00-conventions.md` before reading a phase spec.

## Phase Files

| File | Phase | Lessons | Status |
| --- | --- | --- | --- |
| `01-foundations.md` | Foundations | 01-08 | Written |
| `02-core-building-blocks.md` | Core Building Blocks | 09-24 | Written |
| `03-distributed-systems.md` | Distributed Systems | 25-40 | Not yet written |
| `04-architecture-patterns.md` | Architecture Patterns | 41-52 | Not yet written |
| `05-production-systems.md` | Production Systems | 53-62 | Not yet written |
| `06-ai-system-design.md` | AI System Design | 63-70 | Not yet written |
| `07-case-studies.md` | System Design Case Studies | 71-80 | Not yet written |

Create each phase file in this directory. Update the status table as each file is authored and reviewed.

## Lesson Implementation Progress

| Lesson | Live card title | Status |
| --- | --- | --- |
| 09 | How Does the Internet Actually Work? | Implemented |
| 10 | Client & Server | Implemented |
| 11 | DNS (The Internet's Phone Book) | Implemented |
| 12 | What Happens When You Press Enter? | Implemented |
| 13 | Load Balancer (The Traffic Police) | Implemented |
| 14 | API (The Waiter) | Implemented |
| 15 | API Gateway | Implemented |
| 16 | Database (The Library) | Implemented |
| 17 | Cache (Sticky Notes) | Spec written |
| 18 | Redis | Spec written |
| 19 | Message Queue (The Waiting Line) | Spec written |
| 20 | Kafka | Spec written |
| 21 | CDN (Delivery Warehouse) | Spec written |
| 22 | Service Discovery | Spec written |
| 23 | Reverse Proxy | Spec written |
| 24 | Putting Everything Together | Spec written |

### Unplaced Phase 2 Specs

These topics have written material in `02-core-building-blocks.md` but no dedicated matching live card. Keep their status distinct from the 09-24 live-card implementation tracker.

| Spec topic | Status |
| --- | --- |
| Database Indexing | Spec written, no card |
| Replication | Spec written, no card |
| Sharding & Partitioning | Spec written, no card |
| Object Storage (Amazon S3) | Spec written, no card |

## Before Implementing a Lesson

1. Read this guide and the relevant phase spec only. Implement at most two lessons per pass, in numeric order. Stop and report if a lesson needs a type change.
2. Read `artifacts/system-design-academy/src/types/content.ts` and existing authored content in `artifacts/system-design-academy/src/content/foundations/lesson01.ts` and `artifacts/system-design-academy/src/content/system-design/building-blocks/lessons.ts`. Map each spec section to the current typed lesson model. Do not change types unless a section has no place in them; if extending a type is necessary, state why.
3. Do not overwrite authored content. The existing Lesson 01 at `/content` is “What is System Design?”, while roadmap topic 01 is “How the web actually works.” Reconcile this deliberately. For example, keep the existing lesson as an introduction and add web basics as the next lesson; document the decision.
4. Part II page titles in `building-blocks/lessons.ts` differ from Phase 02 titles in `roadmap.ts`. Treat this as a known split, not a bug to silently fix.
5. After a completed change that adds routes, content, or structure, update both `README.md` and `PROJECT_STRUCTURE.md`.

## Topic Spec Template

Every topic uses these headings in this order. Omit a section only when it genuinely does not apply, such as flow steps for a topic with no request path.

1. **Header block**: lesson number, title, phase, level, read time, prerequisites.
2. **Learning objectives**: 3-4 outcomes starting with a verb.
3. **Plain-language explanation**: avoid jargon; use at most one analogy.
4. **How it works**: technical explanation, in numbered steps where order matters.
5. **Key terms**: short glossary.
6. **Diagrams**: Mermaid source, one-line caption, and an `Animate:` note describing what the interactive player highlights or moves.
7. **Flow steps**: a table with `#`, `From`, `To`, `Label`, and `Detail`; each row is one selectable player step.
8. **Worked example**: concrete numbers with the arithmetic shown.
9. **Trade-offs and decision rules**: when to use it and when not to.
10. **Common mistakes**.
11. **Interview questions**: 3 questions, each with 3-4 answer points.
12. **Quick checks**: 2-3 self-test questions with answers.
13. **Related topics**: lesson numbers.

## Writing Rules

- Beginner first: explain in plain language, then go deeper. The Kafka and Redis guides in `artifacts/system-design-academy/src/content/interview-roadmap-learning.ts` use the same progression: plain language, example, flow, technical points.
- Treat numbers as approximate unless a source is named. Do not present an approximation as a guarantee or invent benchmark figures.
- Show the arithmetic in every worked example so the reader can reproduce it.
- Prefer one idea per diagram. Split diagrams with more than about 12 nodes.

## Diagram Rules

- Mermaid is the source of truth for diagrams in these specs. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`; diagrams should render on GitHub and in VS Code.
- Quote Mermaid labels containing parentheses, slashes, or colons.
- Every diagram needs a caption and an `Animate:` note.
- The app uses generated SVG for animated diagrams, including `artifacts/system-design-academy/src/components/interview-flow-diagram.tsx` and the lesson flow player. Do not paste Mermaid source directly into the UI. Translate Mermaid nodes and the matching Flow steps table into the existing player data shape.