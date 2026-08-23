# Constitutions

Portable rule documents. Each states what good output looks like for a single concern, in
enough detail that a coding agent produces the right artifact from it without further
instruction.

## Index

| Constitution | Covers |
|---|---|
| [Authoring convention](#the-authoring-convention) | How the documents in this directory are written |

The spec, ADR, CI/CD, and GitHub Projects constitutions each land with their own ticket.
Rows appear here as they do.

## Where these live

`constitutions/` in this repository is where the documents are authored.
`docs/constitutions/` is where a copy or symlink lands in a consuming project. A document
that writes either path into its own body is wrong in one of the two places, so it writes
neither — paths inside a constitution refer to the project it governs, and placing the copy
is the installer's job.

Installing one means pointing the project's agent entry points at it. Those are a list —
`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `copilot-instructions.md` — and a project may
carry several of them or none:

```markdown
## Constitutions

Project rules live in `docs/constitutions/`. Read them before writing code or
documentation. Where a task and a constitution disagree, raise the conflict rather than
working around it.
```

## The authoring convention

### What goes in

The non-obvious constraints, the gotchas, and the decisions already taken along with the
reason they went that way. What a model can read off the repository — its layout, its
dependencies, its existing patterns — stays out.

Procedure stays out too. A fixed sequence of calls with an exact right answer is a script,
and a constitution that starts growing one has found a script worth extracting.

### Modal verbs

The retired `constitution` skill required consistent `must` / `must not` / `should` /
`should not`. The repository's style bar bans compliance language. The two reconcile once
rules are sorted by what they are about.

A rule about the artifact takes the present indicative. It is shorter than `must` and reads
as a statement of fact about correct output rather than pressure on the reader:

> ADR file names are `NNNN-kebab-case-title.md`, numbered from the last one in the
> directory.

not

> You must always name ADR files `NNNN-kebab-case-title.md`. Never forget to check the last
> number first.

`should` survives only where the latitude is real and the exception is named. Without a
documented exception it is a hedge, and the indicative is the honest form.

A rule whose grammatical subject is the agent comes out. If the sentence collapses once the
agent stops being its subject, it was procedure wearing a rule's clothes.

### No frontmatter

No YAML header — no `version`, `date`, `authors`, `changelog`. Git records all four, a
hand-maintained changelog inside a document rots the first time someone edits without
updating it, and none of the agent entry points parse frontmatter, so it would be visible
noise in every consuming project.

A copy leaves its git history behind, so provenance is one line under the title instead:

> Upstream: https://github.com/polikeiji/constitutions/blob/main/constitutions/adr.md

### Vendor neutrality

These documents are dropped into projects driven by different tools. The body says "the
coding agent", not a product name, and names a specific tool only where that tool is a
genuine dependency — `gh` in a GitHub Projects constitution is a real requirement; a
particular assistant named in a style rule is not.

### Files and size

Lowercase kebab-case, one domain per file: `adr.md`, `commit-messages.md`. A file answers
one question — *what are the rules for X?* — and runs about 400–600 words, a three-minute
read.

A topic that outgrows that becomes a folder named for it, holding the split files plus its
own `README.md` indexing only those files:

```
constitutions/
  coding-standards/
    README.md
    naming.md
    error-handling.md
  adr.md
  README.md
```

This README is the one exception to the word budget: it carries both the index and this
convention, and splitting the convention into its own document would leave the index
pointing at something that no longer explains itself.

### The index

The table at the top of this file lists every constitution — a link, and one line on what
it covers. It is updated in the change that adds, renames, or removes a document, not
afterwards.
