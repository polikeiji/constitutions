# Constitutions

Portable rule documents. Each states what good output looks like for a single concern, in
enough detail that a coding agent produces the right artifact from it without further
instruction.

## Index

| Constitution | Covers |
|---|---|
| [Authoring convention](#the-authoring-convention) | How the documents in this directory are written |
| [Product specs](specs.md) | What a product spec covers, and what it leaves to the code |
| [Architecture decision records](adrs.md) | What an ADR records about a decision, and what keeps it readable later |
| [GitHub Projects](github-projects/README.md) | How tickets are written, and how one gets from the board to a reviewed PR |

The CI/CD constitution lands with its own ticket.
Rows appear here as they do.

## Where these live

`constitutions/` in this repository is where the documents are authored.
`docs/constitutions/` is where a copy or symlink lands in a consuming project. A topic
document names neither: the paths in its rules belong to the project it governs, and where
the document itself sits is the installer's business. This file names both because it is
the index and has to describe the layout — that exemption belongs to the index, not to a
topic document.

Installing one means placing the copy, adding a row for it to `docs/constitutions/README.md`
in that project — the same index table used here, so an agent arrives at a map rather than
a directory listing — and pointing the project's agent entry points at that index. Entry
points are a list: `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `copilot-instructions.md`. A
project may carry several. One that carries none gets an `AGENTS.md`, the entry point no
single vendor owns.

```markdown
## Constitutions

Project rules live in `docs/constitutions/`, indexed in
[docs/constitutions/README.md](docs/constitutions/README.md). Read them before writing code
or documentation. Where a task and a constitution disagree, raise the conflict rather than
working around it.
```

## The authoring convention

### What goes in

The non-obvious constraints, the gotchas, and the decisions already taken along with the
reason they went that way. What a model can read off the repository — its layout, its
dependencies, its existing patterns — stays out.

Procedure stays out too. A fixed sequence of calls with an exact right answer is a script,
and a constitution that starts growing one has found a script worth extracting.

No trigger-phrase list, and no passage explaining when to reach for the document. It is in
context already; it does not need summoning.

A concern an existing constitution already covers becomes a section in that document rather
than a second file. Two documents on one concern is how a rule set starts contradicting
itself, and the index at the top of this file is the check — short enough to read before
starting.

### Shape

Title, then one sentence on what the document governs, then the rules — and in a copy
installed into a project, the `Upstream:` line under the title. A rule carries its reason
where the reason is not obvious; one clause is usually enough, and it is what stops a
later reader from tidying the rule away.

A right/wrong pair goes where a rule is hard to apply without seeing it — as the modal verb
rule below does. A rule that lands on first reading does not need one.

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

No YAML header — no `version`, `date`, `authors`, `changelog`. In this repository git
records all four, and a hand-maintained changelog inside a document rots the first time
someone edits without updating it. None of the agent entry points parse frontmatter either,
so it would be visible noise in every consuming project.

A copy leaves that history behind, which is the one thing the frontmatter did buy. One line
under the title buys it back — pinned to the commit the copy was taken from, so it still
resolves to what was actually copied and diffs against the current tip:

> Upstream: https://github.com/polikeiji/constitutions/blob/9d9e77d/constitutions/specs.md

A branch name in that URL would always resolve to tip and so could never show drift. The
commit sha is the part that makes the line worth writing.

The sha is filled in by whoever takes the copy. A document cannot carry the hash of the
commit that contains it, and a branch rebased onto `main` renames every commit it had, so
a pin written upstream names a commit that either predates the text below it or never
lands at all — the documents here carry the `main` URL and the copy pins it. Index files
carry no Upstream line: this one and a folder `README.md` list documents rather than state
rules, and the documents they list carry their own.

### Vendor neutrality

These documents are dropped into projects driven by different tools. The body says "the
coding agent", not a product name, and names a specific tool only where that tool is a
genuine dependency — `gh` in a GitHub Projects constitution is a real requirement; a
particular assistant named in a style rule is not.

### Files and size

Lowercase kebab-case, one domain per file: `adrs.md`, `commit-messages.md`. A file answers
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
  adrs.md
  README.md
```

This README is the one exception to the word budget: it carries both the index and this
convention, and splitting the convention into its own document would leave the index
pointing at something that no longer explains itself.

### The index

The table at the top of this file lists every constitution — a link, and one line on what
it covers. It is updated in the change that adds, renames, or removes a document, not
afterwards. A consuming project keeps the same table at `docs/constitutions/README.md`,
listing what was installed there.
