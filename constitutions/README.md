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
| [CI/CD pipelines](ci-cd.md) | Which pipelines a repository carries, and what each one guarantees |
| [Documents](documents.md) | What every document looks like, whatever kind it is — what the others assume |

Rows appear here as documents do.

## Where these live

`constitutions/` in this repository is where the documents are authored.
`docs/constitutions/` is where a copy or symlink lands in a consuming project. A topic
document names neither: the paths in its rules belong to the project it governs, and where
the document itself sits is the installer's business. This file names both because it is
the index and has to describe the layout — that exemption belongs to the index, not to a
topic document.

Everything in `constitutions/` is copy surface, so repo-internal tooling stays out of it: a
folder-shaped constitution travels as a folder, and fixtures kept inside one would install
themselves into every project that takes those rules. Tooling groups by kind at the
repository root instead, and takes the name of the constitution it serves —
`evals/adrs-evals.json` grades `adrs.md`. A topic folder inside `constitutions/` holds
documents and nothing else.

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

The index at the top of this file is the check against writing a second document on a
concern one of these already covers — short enough to read before starting.

### Shape

The rules follow the title and its one sentence; in a copy installed into a project, the
`Upstream:` line goes directly under the title. A rule carries its reason where the reason
is not obvious; one clause is usually enough, and it is what stops a later reader from
tidying the rule away.

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

### The upstream line

A document does without a `version` or a `date` because git records both — and a copy
leaves that history behind. One line under the title buys it back, pinned to the commit the
copy was taken from, so it still resolves to what was actually copied and diffs against the
current tip:

> Upstream: https://github.com/polikeiji/constitutions/blob/9d9e77d/constitutions/specs.md

A branch name in that URL would always resolve to tip and so could never show drift. The
commit sha is the part that makes the line worth writing.

### Vendor neutrality

These documents are dropped into projects driven by different tools. The body says "the
coding agent", not a product name, and names a specific tool only where that tool is a
genuine dependency — `gh` in a GitHub Projects constitution is a real requirement; a
particular assistant named in a style rule is not.

### Size

One domain per file: a constitution answers *what are the rules for X?* — `adrs.md`,
`commit-messages.md` — and a domain that outgrows a single file becomes a folder named for
it, as `github-projects/` did here.

This README is the one document here allowed past the length budget: it carries both the
index and this convention, and splitting the convention out would leave the index pointing
at something that no longer explains itself.
