# Copilot instructions: System Design Academy

## Curriculum work: always start from the spec guide

Before any task that touches lesson content, roadmap data, diagrams, or interview guides:

1. Read `docs/curriculum-specs/README.md` in full. It defines the lesson-spec template, writing and diagram rules, and the one-topic-at-a-time workflow.
2. List `docs/curriculum-specs/`, read `00-conventions.md`, and then read the phase spec covering the topic (for example, `01-foundations.md` for lessons 01-08).
3. Implement at most two lessons per pass, in numeric order. Stop and report if a lesson needs a type change. Never generate a whole phase in one pass.

## Source of truth, in order

1. The phase spec for the topic.
2. Shared conventions in `docs/curriculum-specs/00-conventions.md` and the curriculum guide in `docs/curriculum-specs/README.md`.
3. Existing code patterns in `artifacts/system-design-academy/src/`.
4. Your own assumptions, only as a last resort and always stated.

If the phase spec for a topic does not exist, stop and tell me. Do not invent lesson content or mark a spec as written.

## Keep the status list honest

- The status list in the curriculum guide must match files actually present in `docs/curriculum-specs/`. List the directory to check; do not trust the status list alone.
- When a phase spec is added, moved, or removed, update the status list in the same change.
- If the status list says a spec is written but its file is missing, report the mismatch instead of working around it.

## Building lessons from a spec

- For Phase 2, live card `NN` is built from section `NN` of `docs/curriculum-specs/02-core-building-blocks.md`. Never rename or replace the live card title.
- Map spec sections onto the existing typed lesson model in `artifacts/system-design-academy/src/types/` and existing authored lessons. Do not change types without saying so and explaining why.
- Do not overwrite authored lessons. If lesson numbering or titles conflict (for example, Lesson 01 "What is System Design?" versus roadmap topic 01), ask me before choosing.
- Keep the spec's numbers and worked-example arithmetic. Do not invent benchmark figures.
- Specs use Mermaid for diagrams. The UI uses generated SVG flow components. Translate the diagram's nodes and its flow-steps table into those components; do not embed Mermaid in the UI.
- Preserve each diagram's caption and `Animate:` behavior.

## After finishing a task

- Update `README.md`, `PROJECT_STRUCTURE.md`, and the curriculum status list when routes, content, or structure change.
- Finish with a short report: which spec file and topic you used, which files changed, and any deviation from the spec and why.
