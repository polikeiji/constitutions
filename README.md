# constitutions

Personal rules and tooling for Claude Code across my projects.

A set of **constitutions** — portable rule documents I drop into each project — with skills
kept only where they carry deterministic logic and a passing eval suite, which nothing here
currently does.

## The constitutions

- **[Product specs](constitutions/specs.md)** — what a specification says about a product,
  and what it leaves to the code.
- **[Architecture decision records](constitutions/adrs.md)** — what an ADR records about a
  decision, and what keeps it worth reading years later.
- **[GitHub Projects](constitutions/github-projects/README.md)** — how tickets are written,
  and what happens to one between the board and a pull request a human can review.
- **[CI/CD pipelines](constitutions/ci-cd.md)** — which pipelines a repository carries, what
  each one guarantees, and the choices that cannot be read off the code.
- **[The authoring convention](constitutions/README.md)** — how these documents are written:
  what goes in, document shape, modal verbs, naming, size.

This list is what exists. [`constitutions/README.md`](constitutions/README.md) is the index
and the authoring convention in full, and governs anything about how a document is written.

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

The site machinery — `_layouts/`, `assets/`, `_config.yml` — is not shown; the two
directories above are the content.

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

That re-run does not yet have a baseline it can be measured against. The percentages this
suite produced while it still graded the retired skill do not serve as one: they were
scored by an assertion requiring `title`/`date`/`authors`/`changelog` frontmatter, which
the constitution drops, so a fully conforming run now fails an assertion those numbers
were built on — and only one of the two iterations compared against an agent working from
nothing at all. The first re-run establishes the new baseline rather than beating the old
one.

## Current state

Constitutions only. There is nothing here to install as a plugin.

A constitution is not installed, it is copied. Take the file, drop it in the target
project's `docs/constitutions/`, add its row to that project's index, and point the agent
entry points at the index —
[`constitutions/README.md`](constitutions/README.md) has the full procedure and the
`Upstream:` line that keeps a copy traceable to the commit it came from.
