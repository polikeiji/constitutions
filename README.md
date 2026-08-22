# skills

Personal rules and tooling for Claude Code across my projects.

**This repository is being renewed.** It used to be a marketplace of prompt-only skills.
It is becoming a set of **constitutions** — portable rule documents I drop into each
project — with skills kept only where they carry deterministic logic and a passing eval
suite.

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

Everything failing either test becomes a constitution. As of this rewrite that is
everything, so the repository becomes constitutions-only. The bar stays documented because
it is the test for anything added later, not because something is waiting behind it.

## Migration status

Nothing has been moved yet — this README is step one. Planned disposition:

| Current skill | Becomes | Rationale |
|---|---|---|
| [product-spec](skills/product-spec/) | spec constitution | Prompt + document template only. |
| [devops-plan](skills/devops-plan/) | CI/CD constitution | Prompt + document template only. |
| [adr](skills/adr/) | ADR constitution | Has evals (`evals/adr-evals.json`), but no deterministic logic — fails condition 1. |
| [task-tickets](skills/task-tickets/) | GitHub Projects constitution | How tickets get written and registered is a convention, not a procedure to replay. |
| [handle-ticket](skills/handle-ticket/) | GitHub Projects constitution | Same document — how a ticket goes from board to reviewed PR. |
| [constitution](skills/constitution/) | the authoring convention for this repo | A skill for writing rule documents becomes the format itself. |

Implementation planning lives on GitHub Projects rather than in checked-in plan documents,
so the GitHub Projects constitution covers that ground too.

`handle-ticket` carries the most genuinely deterministic content here — auth-scope
pre-flight, Project GraphQL node/field/option ID resolution, sub-item→item-ID mapping,
status transitions. It still goes into the constitution first. If any of it proves worth
pinning down exactly, it can come back as a script with evals, which is what the bar above
is for.

## Target structure

```
constitutions/          # portable rule documents, one per concern
  <topic>.md
skills/                 # empty for now — only skills meeting both conditions
  <name>/
    SKILL.md            # thin: when to reach for it, and what the scripts do
    scripts/            # the deterministic part
evals/
  <name>-evals.json     # required for every skill in skills/
```

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

### Skills

If something ever clears the bar, this is the shape: a short `SKILL.md` saying when it
applies and what its scripts do, plus the scripts. The model decides *whether* and *how* to
use it; the script guarantees the mechanical parts are right. Nothing in this repository is
in that shape today.

## Shelf life

Both posts land on the same point: this is a fitted curve against one vendor's current
models, and it will drift. So the criteria above are also the maintenance schedule —
re-run the evals on each significant model or harness release, and delete whatever no
longer beats the model working from the constitution alone.

## Current state

The marketplace still ships the skills that have not been retired yet:

```
/plugin marketplace add polikeiji/skills
/plugin install <skill>@keiji-personal-skills
```

That stays working until each one has been folded into a constitution.
