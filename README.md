# constitutions

Personal rules and tooling for Claude Code across my projects.

A constitution states what good output looks like for one concern — product specs, ADRs,
tickets, CI pipelines — in enough detail that an agent produces the right artifact from it
without further instruction, and stops there. It describes the target rather than the
procedure, records the gotchas and the decisions already taken, and leaves out whatever a
model can read off the repository itself. Each one is plain markdown, copied into whichever
project needs it.

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

## Copying one into a project

A constitution is not installed, it is copied. Take the file, drop it in the target project's
`docs/constitutions/`, add its row to that project's index, and point the project's agent
entry points at that index — `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, whichever the project
carries; one that carries none gets an `AGENTS.md`, the entry point no single vendor owns.
[`constitutions/README.md`](constitutions/README.md) has the full procedure and the
`Upstream:` line that keeps a copy traceable to the commit it came from.

## Why rules rather than prompt-skills

Models got good enough that most of what a prompt-only skill carries is noise. Two pieces
make the case:

- [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) —
  Anthropic reports cutting over 80% of Claude Code's system prompt with no loss in
  performance. The shifts it names: **rules → judgment**, **examples → interface design**,
  **upfront context → progressive disclosure**, **repetition → simplicity**.
- [I killed my agent team](https://innerloopai.substack.com/p/i-killed-my-agent-team) (Mike Lanzetta) —
  a 16-agent review team decayed into unanimous approval because it had been tuned to an
  older model's temperament. His test: *"If most of a file is about getting the model to
  cooperate rather than about the job, the file is a fitted curve wearing a name badge."*
  And the framing worth keeping: *"The answer has a shelf life."*

Strip the model-compliance scaffolding out of a prompt-only skill — `Always use this skill
when…`, `You must…`, step numbering that restates the obvious order of work — and what
remains is either a statement of what good output looks like, which is a **rule**, or a
sequence of CLI calls, which is a **script**. A skill that is only a prompt is a rule with
extra indirection, and one the model sees only when the trigger phrasing happens to match.

So the bar for a skill here is both conditions, not either: it contains deterministic logic
with an exact right answer the model should not be re-deriving each run, and it has an eval
suite that can say whether it beats no skill at all. Nothing in this repository clears that
bar today, which is why it holds constitutions only. The bar stays written down because it
is the test for anything added later.

## Shelf life

Both posts land on the same point: this is a fitted curve against the current generation of
models, and it will drift. So the bar is also the maintenance schedule — re-run the evals on
each significant model or harness release, and delete whatever no longer beats an agent
working from the constitution alone.

`evals/adr-evals.json` is the only suite here. It grades
[`constitutions/adrs.md`](constitutions/adrs.md) in project context against an agent working
from nothing, which makes it the one place where *does this document still earn its context?*
is a measurement rather than an opinion. The percentages it produced while it still graded a
skill are not a baseline for that — they were scored by an assertion the constitution
deliberately drops — so the first re-run establishes the baseline rather than beating one.
