# constitutions

Portable rule documents for coding agents.

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

The list says what exists. Where one of its lines and the matching row in
`constitutions/README.md` drift apart, that file governs.

## Copying one into a project

A constitution is not installed, it is copied. Take the file, drop it in the target project's
`docs/constitutions/`, add its row to that project's index, and point the project's agent
entry points at that index — `CLAUDE.md`, `AGENTS.md`, `.cursorrules`,
`copilot-instructions.md`, whichever the project carries; one that carries none gets an
`AGENTS.md`, the entry point no single vendor owns.
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
models, and it will drift. So the maintenance schedule is to re-read these documents on each
significant model release and delete whatever no longer earns its context — a rule the model
now gets right unprompted is noise, and cutting noise is the whole argument above.

That judgement is made in use rather than measured. Nothing here is scored: a suite that
could settle *does this document still earn its context?* needs a task corpus and a grader
per constitution, which is more apparatus than five markdown files justify. The reading comes
off the artifact instead — whether the ADR or the spec came out right from the document
alone. The eval condition in the bar above is a condition on skills, which carry an exact
right answer to grade; a constitution does not.
