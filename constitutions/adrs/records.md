# Writing a record

Where an ADR lives, what its name and frontmatter carry, and the index it is listed in.

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

