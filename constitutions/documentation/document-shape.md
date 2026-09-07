# Document shape

What a document is, how it opens, how few of them there are, and what keeps it true — the
rules that hold whatever kind of document it is.

Specs, ADRs, runbooks, guides, READMEs: a constitution for one kind of document adds what
is particular to it, and where that document says nothing, this one governs.

## Rules

### Markdown, in the repository

1. A document is a markdown file kept in the repository, beside what it describes. Markdown
   diffs line by line, so a document is reviewed the way code is and a review comment lands
   on the sentence it disputes; every code host renders it and every agent entry point reads
   it without a plugin. A document kept in a wiki, a `.docx`, or a shared drive is invisible
   to the change that makes it wrong, which is how it stays wrong.
2. Where another format is the deliverable, the markdown is the source it is generated from.
   A [UI test report](ui-test-reports.md) is the exception: the rendered page with its
   screenshots embedded is itself the artifact, and there is no markdown it could be
   generated from.
3. Formatting stays to what renders on the code host and in a plain viewer both: headings,
   lists, tables, links, fenced code, and Mermaid — see [diagrams.md](diagrams.md). Raw HTML
   renders in some viewers and shows as markup in the rest. This governs the markup inside a
   document, not rule 2's standalone artifact that is itself a rendered page.

### The opening

4. An H1 naming the subject opens the file, and one sentence under it says what the document
   covers. A reader who opened the wrong file finds that out in the first line. In a copy
   installed from upstream the `Upstream:` line sits between the two — see
   [authoring.md](authoring.md).
5. The headings below that come from the subject rather than from a template. Overview /
   Details / Conclusion imposed on a short document is three headings and no content. The
   exception is a document type whose own constitution fixes its sections, because its
   readers compare across files — an ADR's Options section is in the same place in every
   record.

### Kept true

6. A document is edited in the change that makes it wrong, and deleted in the change that
   removes what it described. Git keeps the history, so a deleted document costs a reader
   nothing — while a stale one costs them what they were willing to believe about the
   documents next to it.
7. A record of something that happened is the exception, and is marked rather than removed.
   An ADR whose decision was reversed still describes the choice that was made, which is
   what the reader came for.

### The fewest documents

The tree carries the smallest set of documents that holds the facts.
[cross-referencing.md](cross-referencing.md) governs a fact that appears twice; the rules
here govern a document that exists twice.

8. Extending the document that owns a subject is how material is added, and creating a
   document is the exception. A subject no document owns is what justifies a new file —
   never a new audience, a different altitude, or a fresh angle on a subject already
   covered. The same material carried by an architecture page, a guide and a specification
   is three documents to keep true and three answers a reader has to reconcile, each of them
   comfortably inside the budget.
9. A document whose subject another document already owns is deleted rather than kept beside
   it. Where both carry material worth keeping, one of them becomes the owner and absorbs
   what it was missing, and the other is deleted in that same change.
10. A section that has become a restatement of another document is deleted by the change
    that noticed it. A restatement is not stale, which is what makes it expensive: it reads
    as true, and it stops being true the first time the owner is edited without it.
11. A folder index lists and links, and the explanation lives in the documents it points at
    — [file-organization.md](file-organization.md) rule 10. A README that explains is a
    second document on the folder's subject, and no row of its own table declares it.

## Rationale

Rules 1 and 6 are the same rule seen from two ends. A document only stays true if the change
that invalidates it can see it, and the change can only see it if it lives in the
repository. Everything else here follows from that: a format the code host renders, an
opening that lets a reader leave early, and a deletion that is as ordinary a part of a diff
as an edit.

Rules 9 and 10 are rule 6 read against the tree instead of against one file. A document is
deleted once what it described is gone; a document that never owned its subject describes
what a second one already does, and goes stale in the same way for the same reason. Rule 8
is what keeps that from arising, because the count is the part that compounds — each further
document is one more place a reader can land on the copy nobody maintained.
