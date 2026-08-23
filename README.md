# constitutions

Personal rules and tooling for Claude Code across my projects.

**This repository has been renewed.** It used to be a marketplace of prompt-only skills.
It is now a set of **constitutions** — portable rule documents I drop into each project —
with skills kept only where they carry deterministic logic and a passing eval suite, which
nothing here currently does.

## Why

Models got good enough that most of what I wrote into skills is now noise.

Two pieces make the case:

- [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) —
  Anthropic reports cutting over 80% of Claude Code's system prompt with no loss in
  performance. The shifts it names: **rules → judgment**, **examples → interface design**,
  **upfront context → progressive disclosure**, **repetition → simplicity**.
- [I killed my agent team](https://innerloopai.substack.com/p/i-killed-my-agent-team) (Mike Lanzetta) —
  a 16-agent review team decayed into unanimous approval because it had been tuned to an
  older model's temperament. His test: *"If most of a file is about getting the model to
  cooperate rather than about the job, the file is a fitted curve wearing a name badge."*
  And the framing I want to keep: *"The answer has a shelf life."*

Reading my own skills against that test, most of each file was model-compliance
scaffolding — `Always use this skill when…`, `You must…`, step numbering that restates the
obvious order of work, templates the model would produce anyway. Strip that out and what
remains is either (a) a statement of what good output looks like in my projects, which is a
**rule**, not a skill, or (b) a sequence of CLI calls, which is a **script**.

A skill that is only a prompt is a rule with extra indirection — and a rule the model only
sees if the trigger phrasing happens to match. Better to state it once, in the project, as
something the model reads as context and applies with judgment.

## The bar for a skill

Both conditions, not either:

1. **It contains deterministic logic that can be written as a script.** Fixed sequences of
   CLI/API calls, ID lookups, state transitions, file transforms. Things where an exact
   answer exists and the model should not be re-deriving it each run.
2. **It has an eval suite.** If I can't measure whether the skill beats no-skill, I have no
   way to notice when the next model release makes it redundant — which is exactly the
   failure mode both posts describe. Quarterly re-runs are the point.

Everything failing either test became a constitution. That was everything, so the
repository is constitutions-only. The bar stays documented because it is the test for
anything added later, not because something is waiting behind it.

## What moved where

The migration is finished. Six skills became five constitutions — `task-tickets` and
`handle-ticket` were the same document — and two were deleted rather than converted. The
table is the record of it; the rationale column is why each one went the way it did, which
the constitutions index cannot show.

| Skill | Became | Why |
|---|---|---|
| product-spec | [spec constitution](constitutions/specs.md) | Prompt + document template only. |
| devops-plan | [CI/CD constitution](constitutions/ci-cd.md) | Prompt + document template only. |
| adr | [ADR constitution](constitutions/adrs.md) | Has evals (`evals/adr-evals.json`), but no deterministic logic — fails condition 1. |
| task-tickets | [GitHub Projects](constitutions/github-projects/README.md) | How tickets get written and registered is a convention, not a procedure to replay. |
| handle-ticket | [GitHub Projects](constitutions/github-projects/README.md) | Same document — how a ticket goes from board to reviewed PR. |
| constitution | [the authoring convention](constitutions/README.md) | A skill for writing rule documents becomes the format itself. |
| impl-plan | **deleted** | Implementation planning moved onto the board, so there is no plan document left to describe. |
| eval-pipeline-plan | **deleted** | Prompt and templates for one stack (LangSmith, Azure ML, MLflow): no deterministic logic, no evals, and no live project for a constitution to govern. |

Implementation planning lives on GitHub Projects rather than in checked-in plan documents,
so the GitHub Projects constitution covers that ground too.

Deletion has a cost the table cannot show: `eval-pipeline-plan`'s LangSmith and Azure ML
choreography now lives in the history and nowhere else. If that stack comes back, what
gets written is a constitution about the evaluation approach, not this file restored.

`handle-ticket` carried the most genuinely deterministic content here — auth-scope
pre-flight, Project GraphQL node/field/option ID resolution, sub-item→item-ID mapping,
status transitions. It went into the constitution as prose anyway, and the fiddly parts
are now re-derived per run. If that proves to cost more than it saves, the mechanics can
come back as a script with evals, which is what the bar above is for.

## Where the content lives

```
constitutions/          # portable rule documents, one per concern
  README.md             # the index, and the authoring convention in full
  <topic>.md
  <topic>/              # a topic that outgrew one file
    README.md
    <part>.md
evals/
  adr-evals.json        # the one retained suite, now grading against the constitution
```

The site machinery — `_layouts/`, `assets/`, `_config.yml` — and `adr-workspace/`, which
holds the eval scratch output, are not shown; the two directories above are the content.

There is no `skills/`. If something ever clears the bar it comes back, in the shape the
[Skills](#skills) section below describes.

### Constitutions

A constitution is a plain markdown rule document, copied or symlinked into a target project
(`docs/constitutions/`, or referenced from `CLAUDE.md`). It states what good output looks
like for one concern — specs, ADRs, tickets, CI pipelines, code style — and stops there.

Written for a model with judgment, which means:

- Describe the target, not the procedure. No `Step 1 / Step 2` choreography.
- No compliance language — `always`, `you must`, `never forget to`.
- No trigger-phrase lists. The document is in context; it does not need to be summoned.
- Prefer a real example or a rubric over a description of one.
- Record the gotchas, the non-obvious constraints, the decisions already made. Skip
  anything the model can infer from the repository itself.

If a constitution starts growing procedure, that procedure is a script — extract it.

[`constitutions/README.md`](constitutions/README.md) is the authoring convention in full —
the bullets above, worked out, plus document shape, modal verbs, frontmatter, naming, file
size, and how a document is installed into a project. The bullets here are the summary; if
the two ever read differently, that document governs.

### Skills

Nothing in this repository is a skill today. If something ever clears both conditions,
`skills/` comes back in this shape:

```
skills/
  <name>/
    SKILL.md            # thin: when to reach for it, and what the scripts do
    scripts/            # the deterministic part
evals/
  <name>-evals.json     # the suite condition 2 asks for
```

The model decides *whether* and *how* to use it; the script guarantees the mechanical parts
are right.

## Shelf life

Both posts land on the same point: this is a fitted curve against one vendor's current
models, and it will drift. So the criteria above are also the maintenance schedule —
re-run the evals on each significant model or harness release, and delete whatever no
longer beats the model working from the constitution alone.

`evals/adr-evals.json` is the only suite here, and it outlived the skill it was written
for because of that sentence — it is the one place where *does this document still earn
its context?* is a measurement rather than an opinion. It now grades against
[`constitutions/adrs.md`](constitutions/adrs.md), which means it is no longer a
skill-creator `evals.json`: there is no skill to toggle on and off, and the comparison it
runs is the constitution in project context against an agent working from nothing.

That re-run does not yet have a baseline it can be measured against. `adr-workspace/`
holds two iterations, but only iteration-1 has a from-nothing arm (skill 100%, nothing
33%) — iteration-2 compared two skill versions. Both were graded by an assertion requiring
`title`/`date`/`authors`/`changelog` frontmatter, which the constitution drops, so a
fully conforming run now fails one of the seven assertions those percentages were built
on. The first re-run establishes the new baseline rather than beating the old one.

## Current state

Constitutions only. There is nothing here to install as a plugin, and the marketplace that
used to ship one is gone — `.claude-plugin/marketplace.json` was deleted along with the last
skill. An empty `plugins` array would have left
`/plugin marketplace add polikeiji/constitutions` succeeding and then offering nothing,
which reads as a working marketplace rather than an empty one. Anyone who added it can drop
it by name (`keiji-personal-skills`) or by the repository they added it as
(`polikeiji/constitutions`); the file comes back, numbered from 1.0.0, on the day something
clears the bar.

A constitution is not installed, it is copied. Take the file, drop it in the target
project's `docs/constitutions/`, add its row to that project's index, and point the agent
entry points at the index —
[`constitutions/README.md`](constitutions/README.md) has the full procedure and the
`Upstream:` line that keeps a copy traceable to the commit it came from.
