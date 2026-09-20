# Comparing the options

How a record argues the alternatives it weighed, and the failures each rule exists to stop.

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

