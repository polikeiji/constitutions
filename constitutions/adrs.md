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

Frontmatter carries `adr: NNNN` and `status`, and nothing else — git records the author
and date, the Decision section records who agreed, and a hand-kept changelog rots the
first time someone edits without updating it. `status` is one of **Proposed**,
**Accepted**, **Deprecated**, or **Superseded by [ADR-NNNN]**, the one fact git cannot
reconstruct.

About 400–600 words. Running past that usually means the record holds more than one
decision.

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

**Options** — one subsection per option seriously considered, its pros and cons labelled
with those driver names verbatim, so every option is argued on the same axis and the
reader compares options rather than the cases made for them. One option from a longer
record:

```markdown
### Option A: PostgreSQL

**Performance** (+) Excellent query planner; handles our projected 50k rows/day easily  
**Operational cost** (-) Managed service at ~$80/month, or self-hosted ops overhead  
**Team familiarity** (+) Three engineers have production PostgreSQL experience  
**Compliance** (+) Row-level security; EU-region managed options available
```

The trailing double spaces are load-bearing — without them the rows render as one
paragraph.

**Decision** — the chosen option in one sentence, who agreed, and which drivers tipped it
against which accepted trade-offs.

**Consequences** — what gets easier and what gets harder, both. A record listing only
benefits is advocacy.

**Links** — related ADRs, RFCs, and design docs, cross-referenced as
`[ADR-NNNN](NNNN-title.md)`.

Boundaries, data flows, and topology go in a ` ```mermaid ` fenced block wherever the
alternative is a paragraph of dense prose.

## Facts with a shelf life

Version numbers, maintenance status, breaking changes, and licensing terms are verified
against current sources before entering an Options section: an ADR outlives the facts it
was written from, and a library abandoned last quarter changes the comparison. Findings
that cut against the choice already made go in as well — a record that only assembles
support for its conclusion misleads the reader it was written for.

## The index

`docs/adrs/README.md` lists every record in ascending order, updated in the change that
adds or supersedes one:

```markdown
| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-postgresql.md) | Use PostgreSQL | Accepted | Chosen for ACID compliance and team familiarity over SQLite and MongoDB |
```

Superseding a record sets `status` in the record itself as well as in its index row — one
still reading Accepted sends someone off after a decision that was reversed. Past roughly
ten records the table takes thematic subheadings.
