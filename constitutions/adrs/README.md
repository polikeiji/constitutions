# Architecture decision records

What an ADR records about a technical decision, and what keeps it worth reading years
later.

An ADR captures *why* a choice was made, not how it was built: one recording "use
PostgreSQL" does not describe table schemas. Product and business stakeholders read them,
so plain words win wherever they carry the meaning.

| Document | Covers |
|---|---|
| [Writing a record](records.md) | Where the file goes, what its name and frontmatter carry, and the index every record has a row in |
| [What each section says](sections.md) | Motivation, Decision Drivers, Decision, Consequences and Links, and the facts checked before any of them |
| [Comparing the options](options.md) | The shape a comparison takes, the marker, the split, and the failures each rule exists to stop |

Options is a file of its own because it is the part that grows: every lesson about a
record that argued its alternatives badly lands there, and together with the rest it runs
past what one document holds.
