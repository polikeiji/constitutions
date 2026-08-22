# skills

Personal rules and tooling for Claude Code across my projects.

**This repository is being renewed.** It used to be a marketplace of eight prompt-only
skills. It is becoming a set of **constitutions** (portable rule documents I drop into
each project) plus a much smaller set of **skills** that earn their place by carrying
deterministic logic and a passing eval suite.

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

## What survives as a skill

Both conditions, not either:

1. **It contains deterministic logic that can be written as a script.** Fixed sequences of
   CLI/API calls, ID lookups, state transitions, file transforms. Things where an exact
   answer exists and the model should not be re-deriving it each run.
2. **It has an eval suite.** If I can't measure whether the skill beats no-skill, I have no
   way to notice when the next model release makes it redundant — which is exactly the
   failure mode both posts describe. Quarterly re-runs are the point.

Everything failing either test becomes a constitution.

## Migration status

Nothing has been moved yet — this README is step one. Planned disposition of the current skills:

| Current skill | Disposition | Rationale |
|---|---|---|
| [product-spec](skills/product-spec/) | → constitution | Prompt + document template only. |
| [impl-plan](skills/impl-plan/) | → constitution | Prompt + document template only. |
| [devops-plan](skills/devops-plan/) | → constitution | Prompt + document template only. |
| [adr](skills/adr/) | → constitution | Has evals (`evals/adr-evals.json`), but no deterministic logic — fails condition 1. |
| [eval-pipeline-plan](skills/eval-pipeline-plan/) | → constitution | 458 lines of prompt; the LangSmith/Azure ML choices are project defaults, i.e. rules. |
| [constitution](skills/constitution/) | → folded into the format itself | A skill for writing rule documents becomes the authoring convention for this repo. |
| [task-tickets](skills/task-tickets/) | under review | The `gh`/Linear/Notion/Jira registration calls are deterministic; the task-extraction half is judgment. Keep only the registration script, if anything. |
| [handle-ticket](skills/handle-ticket/) | strongest keep candidate | Auth-scope pre-flight, Project GraphQL node/field/option ID resolution, sub-item→item-ID mapping, status transitions. Real deterministic logic the model should not improvise — but it has to ship as scripts with evals, not as 445 lines of prose. |

## Target structure

```
constitutions/          # portable rule documents, one per concern
  <topic>.md
skills/                 # only skills meeting both conditions
  <name>/
    SKILL.md            # thin: when to reach for it, and what the scripts do
    scripts/            # the deterministic part
evals/
  <name>-evals.json     # required for every skill in skills/
```

### Constitutions

A constitution is a plain markdown rule document, copied or symlinked into a target project
(`docs/constitutions/`, or referenced from `CLAUDE.md`). It states what good output looks
like for one concern — specs, ADRs, plans, CI pipelines, code style — and stops there.

Written for a model with judgment, which means:

- Describe the target, not the procedure. No `Step 1 / Step 2` choreography.
- No compliance language — `always`, `you must`, `never forget to`.
- No trigger-phrase lists. The document is in context; it does not need to be summoned.
- Prefer a real example or a rubric over a description of one.
- Record the gotchas, the non-obvious constraints, the decisions already made. Skip
  anything the model can infer from the repository itself.

If a constitution starts growing procedure, that procedure is a script — extract it.

### Skills

What is left of a skill after the prompt moves out: a short `SKILL.md` saying when it
applies and what its scripts do, plus the scripts. The model decides *whether* and
*how* to use it; the script guarantees the mechanical parts are right.

## Shelf life

Both posts land on the same point: this is a fitted curve against one vendor's current
models, and it will drift. So the criteria above are also the maintenance schedule —
re-run the evals on each significant model or harness release, and delete whatever no
longer beats the model working from the constitution alone.

## Current state

The marketplace still ships the eight skills as they are today:

```
/plugin marketplace add polikeiji/skills
/plugin install <skill>@keiji-personal-skills
```

That stays working until each skill is either retired into a constitution or rebuilt
around scripts and evals.
