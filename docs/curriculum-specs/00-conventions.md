# Curriculum Spec Conventions

Read `README.md` in this directory, then the relevant phase specification. Work on one topic at a time.

## Writing

- Start with a beginner-friendly explanation, then introduce technical detail.
- Keep the lesson sections and their order from the topic spec template in `README.md`.
- Use 3-4 verb-led learning objectives, three interview questions with 3-4 answer points each, and 2-3 quick checks with answers.
- Treat numbers as approximate unless a source is named. Do not invent benchmark figures or present estimates as guarantees.
- Show the arithmetic for every worked example.
- Preserve authored material. Resolve title or numbering conflicts explicitly before changing existing lessons.

## Diagrams and flows

- Mermaid is the source format for specification diagrams. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`.
- Quote Mermaid labels containing parentheses, slashes, or colons.
- Give every diagram a one-line caption and an `Animate:` note describing the intended interaction.
- Keep each diagram focused on one idea; split diagrams with more than about 12 nodes.
- Include flow-step rows (`#`, `From`, `To`, `Label`, `Detail`) when the topic has an interactive request path.
- The UI uses generated SVG flow components. Translate Mermaid nodes and flow steps into the existing data shape; do not paste Mermaid source directly into the UI.

## Changes and status

- If a phase spec is missing, stop and report that; do not invent its lesson content or mark it written.
- Keep the phase status table in `README.md` synchronized with files actually present in this directory.
- After changes to routes, content, or structure, update both repository `README.md` and `PROJECT_STRUCTURE.md`.
