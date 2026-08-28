# Documents

What every document in a repository looks like, whatever kind of document it is.

These rules hold for specs, ADRs, runbooks, guides, and READMEs alike. A constitution for
one kind of document adds what is particular to it; where that document says nothing, this
one governs.

## Markdown

Documents are markdown files kept in the repository, beside what they describe. Markdown
diffs line by line, so a document is reviewed the way code is and a review comment lands on
the sentence it disputes; every code host renders it and every agent entry point reads it
without a plugin. A document kept in a wiki, a `.docx`, or a shared drive is invisible to
the change that makes it wrong, which is how it stays wrong. Where another format is the
deliverable, the markdown is the source and the deliverable is generated from it.

Formatting stays to what renders on the code host and in a plain viewer both: headings,
lists, tables, links, fenced code, and Mermaid. Raw HTML renders in some viewers and shows
as markup in the rest.

## Five minutes

A document is readable in five minutes — roughly a thousand words. Past that a reader
skims, and a skimmed document is one whose contents get applied from a memory of its
headings.

Running past the budget is the signal to split, not to compress. Reasons are what compress
first, and a rule stripped of its reason is the one a later reader tidies away.

One subject per file, and the title says which. A subject an existing document already
covers becomes a section in that document rather than a second file — two documents on one
subject is how a set starts contradicting itself. Related documents share a filename prefix
so the directory sorts into groups: `onboarding-overview.md`,
`onboarding-email-verification.md`. A single subject too large for one file becomes a
directory named for it, holding the split files plus its own `README.md` indexing only
those.

## Diagrams

Structure and sequence are drawn rather than described. Flows, state machines, lifecycles,
topology, boundaries, and who calls whom go in a ` ```mermaid ` fenced block: a reader takes
a diagram in at a glance and its prose equivalent a paragraph at a time, which is most of
what makes five minutes reachable. A branching flow written out as prose is where readers
stop reading.

```mermaid
flowchart TD
  accTitle: Choosing between a diagram and a sentence
  accDescr: Content that is neither structural nor sequential stays prose. Content that is becomes a diagram, unless one sentence already carries it, in which case the sentence wins.
  Start["Something to explain"] --> Struct{"Structural or sequential?"}
  Struct -->|no| Prose["Prose"]
  Struct -->|yes| Short{"Does one sentence carry it?"}
  Short -->|yes| Prose
  Short -->|no| Diagram["Mermaid diagram"]
```

`accTitle` and `accDescr` are part of the diagram, as above. The rendered SVG tells a
screen reader nothing, and the description is what every reader gets on the day the block
fails to render. The prose beside a diagram does not restate it: a diagram captioned with
its own contents is the paragraph it was drawn to replace, back again.

## Shape

An H1 naming the subject opens the file, and one sentence under it says what the document
covers — a reader who opened the wrong file finds that out in the first line.

The headings below come from the subject rather than from a template; Overview / Details /
Conclusion imposed on a short document is three headings and no content. Where a document
type fixes its sections instead, its own constitution says so, and the reason is that
readers compare across files — an ADR's Options section is in the same place in every
record.

## Files

Lowercase kebab-case with a `.md` extension, named for the subject.

No YAML frontmatter — no `version`, `date`, `authors`, or `changelog`. Git records all
four, a hand-kept changelog rots the first time someone edits without updating it, and none
of the agent entry points parse frontmatter, so it reads as noise wherever it is not
stripped. Where a document type needs a fact git cannot reconstruct — an ADR's `status` —
its own constitution names that field, and the frontmatter carries it and nothing else.

## The index

Every directory of documents carries a `README.md` indexing it: a link, and one line on
what each document covers, so a reader arriving at the directory gets a map rather than a
listing.

```markdown
| Document | Covers |
|---|---|
| [Email verification](onboarding-email-verification.md) | How a new account confirms its address |
```

A row lands in the change that adds, renames, or removes the document rather than
afterwards — an index written later is written from the filenames. Past roughly ten rows
the table takes subheadings by area; a flat list of thirty is a directory listing with
extra steps.

## Kept true

A document is edited in the change that makes it wrong, and deleted in the change that
removes what it described. Git keeps the history, so a deleted document costs a reader
nothing — while a stale one costs them what they were willing to believe about the
documents next to it.

A record of something that happened is the exception: it is marked rather than removed,
because an ADR whose decision was later reversed still describes the choice that was made,
and that is what the reader came for.
