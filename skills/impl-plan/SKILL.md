---
name: impl-plan
description: |
  Create and maintain implementation plan documents in docs/plans/. Always use this skill when the user wants to: create an implementation plan, write a technical plan, plan how to build a feature, turn a spec into tasks, design a system architecture, define data schemas, plan infrastructure, or document technical decisions for a development effort. Trigger on: implementation plan, tech plan, technical design, build plan, coding plan, architecture plan, system design, data model, dev plan, how to implement, how to build. When the user has a spec or feature description and says "plan how to build this", "create an implementation plan", or "make this into tasks" — that's this skill.
---

# Implementation Plan Writer

You help write and maintain implementation plan documents that describe *how* a product or feature will be built. These plans serve developers as the authoritative technical guide for a development effort, covering languages, frameworks, architecture, data schemas, and component breakdown fine-grained enough to derive coding tasks from.

## Step 1: Clarify before writing

An implementation plan is only as useful as the information behind it. Before writing anything, identify gaps.

**Required information — ask if missing:**
- What is being built? (feature summary or link to a product spec)
- What programming language(s) will be used?
- What frameworks or runtimes? (e.g. Next.js, FastAPI, Go stdlib)
- Where will it run? (cloud provider, region, deployment model — serverless, container, VM, on-prem)
- What data will it store or process, and where? (database engine, storage service)
- What external services or APIs does it integrate with?
- Any hard constraints? (performance SLOs, compliance requirements, existing infrastructure to reuse)

**Nice to have — infer if reasonable, confirm if ambiguous:**
- Middleware and messaging (queues, caches, event buses)
- Auth model (session, JWT, OAuth provider)
- CI/CD and deployment pipeline
- Observability approach (logging, metrics, tracing)

Do not start writing until required information is either provided or confirmed as "to be decided" by the user.

## Step 2: Survey existing plans

Check what already exists:

```bash
find docs/plans -name "*.md" 2>/dev/null | sort
```

If `docs/plans/` exists, read `docs/plans/README.md` and any plans that might overlap with the current effort. Update rather than duplicate.

If the directory doesn't exist yet, create it:

```bash
mkdir -p docs/plans
```

## Step 3: Decide on file structure

A plan for a small, self-contained feature may fit in a single file. For anything larger, split into focused files — each readable in under three minutes (~400–600 words).

Typical split strategy:

| File | Covers |
|------|--------|
| `<feature>-overview.md` | Goals, scope, non-goals, high-level approach |
| `<feature>-architecture.md` | System diagram (ASCII or described), components, infrastructure |
| `<feature>-data-model.md` | Schemas, migrations, storage decisions |
| `<feature>-api.md` | Endpoints or interfaces, request/response shapes |
| `<feature>-components.md` | Frontend or service-level breakdown, responsibilities |
| `<feature>-infra.md` | Cloud resources, networking, IAM, deployment |
| `<feature>-tasks.md` | Ordered list of coding tasks derived from the plan |

Omit files that don't apply. Add files when a concern doesn't fit any category above.

## Step 4: Write each file

### Frontmatter format

Every plan file must begin with YAML frontmatter matching the product-spec format:

```markdown
---
title: "Feature Name — Aspect"
version: 1.0.0
date: YYYY-MM-DD
authors:
  - Your Name
changelog:
  - version: 1.0.0
    date: YYYY-MM-DD
    author: Your Name
    changes: Initial version
---
```

When **updating** an existing file, increment the version (patch `x.x.1` for small edits, minor `x.1.0` for new sections, major `2.0.0` for significant rewrites), set today's date, and append a new changelog entry.

### Content guidelines

**Be technically precise.** Name the actual technology: not "a database" but "PostgreSQL 16 on Cloud SQL"; not "a job runner" but "Cloud Run Jobs triggered by Cloud Scheduler". Vague language produces vague tasks.

**Include enough detail to write code from.** A developer reading this plan should know what to build without needing to ask follow-up questions. Concrete data schemas, API shapes, and component responsibilities are the minimum bar.

**One concern per file.** Each file answers one clear question about the implementation. If a file is covering two distinct concerns, split it.

**Use diagrams where they help.** Whenever a diagram would help readers understand a concept more quickly — system topology, component relationships, data flows, entity-relationship models, sequence flows — draw it in Mermaid format inside a fenced code block (` ```mermaid `). A diagram beats prose for structural relationships every time.

**Flag decisions explicitly.** When a significant technical choice was made (e.g., chosen Postgres over DynamoDB, chosen polling over webhooks), note it with a brief rationale. This prevents revisiting settled decisions.

**Tasks file format.** The `-tasks.md` file should list discrete, independently executable coding tasks in dependency order. Each task should be implementable by one developer in one sitting. Format:

```markdown
## Tasks

- [ ] Task description (e.g., "Create `users` table migration with columns: id, email, created_at")
- [ ] Task description
...
```

Group tasks under phase headings (e.g., `### Phase 1: Data layer`) if the effort spans multiple stages.

## Step 5: Name and place files

- Store all plan files in `docs/plans/`
- Use lowercase kebab-case: `user-auth-overview.md`, `user-auth-data-model.md`
- Group related files with a shared prefix matching the feature or initiative name

## Step 6: Update the README index

`docs/plans/README.md` is the entry point for all plans. Keep it current whenever you add, rename, or remove a file.

Format:

```markdown
# Implementation Plans

| Document | Description |
|----------|-------------|
| [Feature — Aspect](filename.md) | One-line description of what this file covers |
```

If there are more than ~6 files, group related plans under subheadings. The README itself should also have YAML frontmatter tracking its own version.

## Step 7: Confirm with the user

Briefly list what you created or changed — file names, version bumped from/to, and a one-sentence summary of what each file covers. If you made assumptions to fill gaps, call them out explicitly so the user can correct them.
