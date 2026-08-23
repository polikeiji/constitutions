# Architecture decision records

What an ADR records about a technical decision, and what keeps it worth reading years
later.

An ADR captures *why* a choice was made, not how it was built. One recording "use
PostgreSQL" does not describe table schemas, and one recording "adopt event-driven
architecture" does not describe queue configuration. The readers are engineers,
architects, and sometimes product or business stakeholders, so plain words win wherever
they carry the meaning.

## Files

ADRs live in `docs/adrs/` as `NNNN-short-title.md`, zero-padded and numbered from the
highest number already in the directory. The title names the *decision*:

> `0003-use-event-sourcing.md`, `0007-adopt-graphql-for-client-api.md`

not

> `0003-database-decision.md`, which names the problem, or
> `0007-should-we-use-graphql.md`, which names the question

Frontmatter carries `adr: NNNN` and `status`, and nothing else — date, authors, and
changelog are what git already records, and a changelog kept by hand rots the first time
someone edits without updating it. `status` is one of **Proposed**, **Accepted**,
**Deprecated**, or **Superseded by [ADR-NNNN]** — the one fact about the record git
cannot reconstruct, which is why it stays in the file.

About 400–600 words, a three-minute read. Running past that usually means the record holds
more than one decision.

## Sections

Motivation, Decision Drivers, Options, and Decision carry the record. Consequences and
Links appear where there is something to put in them.

**Motivation** — the pressure that makes the decision necessary *now*, and what stays
blocked while it is open.

**Decision Drivers** — the criteria a good choice is judged against, specific enough to
settle an argument: *response time under 100 ms at p99*, not *good performance*; *no Rust
expertise on the team*, not *team familiarity*.

**Options** — one subsection per option seriously considered, its pros and cons labelled
with the driver names from Decision Drivers, verbatim. Every option is then argued on the
same axis, so the reader compares options rather than the cases made for them. One option
from an ADR that goes on to cover three more:

```markdown
### Option A: PostgreSQL

**Performance** (+) Excellent query planner; handles our projected 50k rows/day easily
**Operational cost** (-) Managed service at ~$80/month, or self-hosted ops overhead
**Team familiarity** (+) Three engineers have production PostgreSQL experience
**Compliance** (+) Row-level security; EU-region managed options available
```

**Decision** — the chosen option in one sentence, then which drivers tipped it and which
trade-offs were accepted.

**Consequences** — what gets easier and what gets harder, both. A record listing only
benefits is advocacy.

**Links** — related ADRs, RFCs, design docs. Cross-references take the form
`[ADR-NNNN](NNNN-title.md)`.

A decision about system boundaries, data flows, or topology takes a Mermaid diagram in a
fenced block where the alternative is a paragraph of dense prose.

## Facts with a shelf life

Version numbers, maintenance status, recent breaking changes, and licensing terms are
verified against current sources before they enter an Options section. An ADR outlives the
facts it was written from, and a library abandoned last quarter or a competitor that has
since closed the gap changes the comparison it records. Findings that cut against the
choice already made go in as well — a record that only assembles support for its
conclusion misleads the reader it was written for.

## The index

`docs/adrs/README.md` lists every record in ascending order, updated in the change that
adds or supersedes one:

```markdown
| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-postgresql.md) | Use PostgreSQL | Accepted | Chosen for ACID compliance and team familiarity over SQLite and MongoDB |
```

Status is the column that rots: a superseded record still showing Accepted sends a reader
off after a decision that was reversed. Past roughly ten records the table takes
thematic subheadings.
