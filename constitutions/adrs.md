# Architecture decision records

What an ADR records about a technical decision, and what keeps it worth reading years
later.

An ADR captures *why* a choice was made, not how it was built: one recording "use
PostgreSQL" does not describe table schemas. Product and business stakeholders read them,
so plain words win wherever they carry the meaning.

## Files

ADRs live in `docs/adrs/` as `NNNN-short-title.md`, taking the next number after the
highest already there. An H1 naming the decision opens the file; the filename is that
title in kebab-case — the decision, never the problem or the question:

> `0003-use-event-sourcing.md`, `0007-adopt-graphql-for-client-api.md`

not

> `0003-database-decision.md`, `0007-should-we-use-graphql.md`

Frontmatter carries `adr: NNNN` and `status`, and nothing else — the Decision section
records who agreed. `status` is one of **Proposed**, **Accepted**, **Deprecated**, or
**Superseded by [ADR-NNNN]**.

A record running past the length budget usually holds more than one decision. Splitting
the file does not split the decision: moving Options onto a page of its own answers the
length and leaves the second decision where it was, in whatever shape it was already in.
A second decision takes a record of its own or a comparison of its own, and a paragraph
is neither.

## Sections

Motivation, Decision Drivers, Options, and Decision carry the record; Consequences joins
them wherever the decision costs something, which is nearly always. Links appears when
there is something to link.

**Motivation** — the pressure that makes the decision necessary *now*, and what stays
blocked while it is open.

**Decision Drivers** — a `Name: criterion` list, each criterion specific enough to settle
an argument: *Performance: response time under 100 ms at p99*, not *Performance: fast
enough*. The drivers are the ones the deciders actually named; invented ones read exactly
like real ones.

**Options** — one subsection per option seriously considered, headed
`Option <letter>: <title>` with the letters running in heading order. Its pros and cons are
labelled with those driver names verbatim, so every option is argued on the same axis and
the reader compares options rather than the cases made for them. That letter is the handle
the rest of the record cites, and the chosen option's heading — and no other — carries
`(chosen)`:

```markdown
### Option A: PostgreSQL (chosen)

**Performance** (+) Excellent query planner; handles our projected 50k rows/day easily  
**Operational cost** (-) Managed service at ~$80/month, or self-hosted ops overhead  
**Team familiarity** (+) Three engineers have production PostgreSQL experience  
**Compliance** (+) Row-level security; EU-region managed options available
```

The trailing double spaces are load-bearing — without them the rows render as one
paragraph, and the source looks correct to the eye either way. An editor that trims trailing
whitespace takes them out silently, so the check is a command rather than a reading:

```bash
# a driver row that is followed by another row and has lost its break
awk 'prev ~ /^\*\*/ && prev !~ /  $/ && /^\*\*/ { print NR-1": "prev } { prev = $0 }' FILE
```

It prints nothing once every row but each block's last carries its break, and the built site
confirms the render.

A comparison written as prose is advocacy. A paragraph granting each rejected alternative one
dismissing clause is the case for the winner, and it is where a finding against the choice
goes to be buried. Every set of alternatives a record weighs takes the labelled rows,
wherever in the record it sits.

A decision that only arises once an option is chosen is compared inside that option, under
its own heading, in the same shape. Lettering its candidates alongside the options they
depend on reads as one comparison where the record made two. It is argued on whichever
drivers tell its candidates apart, and the drivers every candidate satisfies identically are
named and set aside rather than repeated as rows that decide nothing. Each comparison marks
its own winner: a page holding two comparisons carries two markers, one to each.

The marker earns its place once a record grows enough to split: Options becomes a page of
its own, and a comparison carrying no marker is read to its end without ever saying which
way it went. A record whose options are spread across sibling files marks the winner on
whichever page its heading lives. Those siblings sit in a folder of the record's own: a
record over the budget splits the way any document does
([file-organization.md](documentation/file-organization.md) rule 1), into
`NNNN-short-title/` whose `README.md` is the record and replaces the original file. `adr`
and `status` go there with it; a page beside it is not a record and carries neither. Its
Links section lists those pages, so the record is not also a directory index. The parent
index keeps one row per record, pointing at the folder.

**Decision** — opens by naming the chosen option by **both** its letter and its title —
*Adopt Option B: managed PostgreSQL* — and goes on to who agreed, which drivers tipped it,
and what the rejected options give up. A statement of direction alone does not satisfy the
section: *use PostgreSQL as the sole database* says what happens next while leaving the
reader to work out which of the compared options that was. A decision that takes a
different option per surface names each one, and says which surface it was chosen for.

**Consequences** — what gets easier and what gets harder, both. A record listing only
benefits is advocacy.

**Links** — related ADRs, RFCs, and design docs, cross-referenced as
`[ADR-NNNN](NNNN-title.md)`.

Boundaries, data flows, and topology are what a record draws.

## Facts with a shelf life

Version numbers, maintenance status, breaking changes, and licensing terms are verified
against current sources before entering an Options section: an ADR outlives the facts it
was written from, and a library abandoned last quarter changes the comparison. Findings
that cut against the choice already made go in as well — a record that only assembles
support for its conclusion misleads the reader it was written for.

## The index

`docs/adrs/README.md` lists every record in ascending order, with the status and the reason
in the row:

```markdown
| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-postgresql.md) | Use PostgreSQL | Accepted | Chosen for ACID compliance and team familiarity over SQLite and MongoDB |
```

Superseding a record sets `status` in the record itself as well as in its index row, in the
change that supersedes it — one still reading Accepted sends someone off after a decision
that was reversed.
