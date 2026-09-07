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

A record running past the length budget usually holds more than one decision.

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
paragraph, and the source looks correct either way, so it is checked in the built site.

The marker earns its place once a record grows enough to split: Options becomes a page of
its own, and a comparison carrying no marker is read to its end without ever saying which
way it went. A record whose options are spread across sibling files marks the winner on
whichever page its heading lives.

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
