# What each section says

The sections that carry a record, and what belongs in each.

Motivation, Decision Drivers, Options, and Decision carry the record; Consequences joins
them wherever the decision costs something, which is nearly always. Links appears when
there is something to link.

**Motivation** — the pressure that makes the decision necessary *now*, and what stays
blocked while it is open.

**Decision Drivers** — a `Name: criterion` list, each criterion specific enough to settle
an argument: *Performance: response time under 100 ms at p99*, not *Performance: fast
enough*. The drivers are the ones the deciders actually named; invented ones read exactly
like real ones.

**Options** — [Comparing the options](options.md) has this one: the subsection shape, the
driver labels, the marker, and what a comparison written any other way costs.

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
