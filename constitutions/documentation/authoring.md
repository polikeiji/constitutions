# Authoring a constitution

How the rule documents in `constitutions/` are written. The rest of this folder governs
every document in a repository; this file governs only these.

## What goes in

A constitution carries the non-obvious constraints, the gotchas, and the decisions already
taken along with the reason each went that way. What the coding agent reads off the
repository — its layout, its dependencies, its existing patterns — stays out, because a rule
restating what the code already shows goes stale the moment the code moves.

Procedure stays out too. A fixed sequence of calls with an exact right answer is a script,
and a constitution growing one has found a script worth extracting.

There is no trigger-phrase list and no passage explaining when to reach for the document. It
is in context already.

The index in [../README.md](../README.md) is the check against writing a second document on
a concern one of these already covers. It is short enough to read before starting.

## Voice

A rule about the artifact takes the present indicative. It is shorter than `must` and reads
as a statement of fact about correct output rather than as pressure on the reader:

> ADR file names are `NNNN-kebab-case-title.md`, numbered from the last one in the directory.

not

> You must always name ADR files `NNNN-kebab-case-title.md`. Never forget to check the last
> number first.

`should` survives only where the latitude is real and the exception is named. Without a
documented exception it is a hedge, and the indicative is the honest form.

A rule whose grammatical subject is the coding agent comes out. If the sentence collapses
once the agent stops being its subject, it was procedure wearing a rule's clothes.

## Shape

The rules follow the title and its one sentence, with the `Upstream:` line between them
where the document is an installed copy. A rule carries its reason wherever that reason is
not obvious — one clause is usually enough, and it is what stops a later reader from tidying
the rule away.

A right/wrong pair goes where a rule is hard to apply without seeing it, as the voice rule
above does. A rule that lands on first reading does not need one.

Rules are numbered where something outside the document cites them — a sibling file, a
source comment, a merged pull request. A numbered set that splits across two files carries
on one numbering, as [diagrams-style.md](diagrams-style.md) resumes
[diagrams.md](diagrams.md) at 12, so no number ever means two things.

## Vendor neutrality

These documents are dropped into projects driven by different tools, so the body says "the
coding agent" rather than a product name. A specific tool is named only where it is a
genuine dependency: `gh` in a GitHub Projects constitution is a real requirement, an
assistant named in a style rule is not.

## The upstream line

A document does without a `version` or a `date` because git records both — and a copy leaves
that history behind. One line under the title buys it back, pinned to the commit the copy
was taken from, so it still resolves to what was actually copied and diffs against the
current tip:

> Upstream: https://github.com/polikeiji/constitutions/blob/9d9e77d/constitutions/specs.md

A branch name in that URL always resolves to tip and so can never show drift. The commit sha
is the part that makes the line worth writing.

A copy that diverges deliberately says so in the document, at the rule that diverges, and
says why. A divergence nobody recorded is indistinguishable from a mistake the next time
someone diffs the copy against its upstream.

## Size

One domain per file: a constitution answers *what are the rules for X?* A domain that
outgrows a single file becomes a folder named for it, indexed by its own `README.md`, as
this folder and `github-projects/` did. The budget and the split are
[document-sizing.md](document-sizing.md) and
[file-organization.md](file-organization.md) — a constitution is a document like any other,
and the rules it lives under are the ones it publishes.

[../README.md](../README.md) has the procedure for installing one into a project.
