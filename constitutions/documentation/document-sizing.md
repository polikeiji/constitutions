# Document sizing

Every markdown document in the tree is readable in five minutes, and this file says how that
is measured and what happens when one is not.

## Rules

### The five-minute budget

1. A markdown document reads end to end in **five minutes or less** for a reader new to the
   topic. Past that a reader skims, and a skimmed document is one whose contents get applied
   from a memory of its headings.
2. The enforceable budget is **1000 words of prose** — everything outside fenced blocks,
   including headings, list items, and table cells. 1000 words is roughly five minutes at
   200 words per minute.
3. Fenced blocks (code samples and Mermaid diagrams) fall outside the word budget, but two
   line limits apply instead:
   - a document runs to no more than **650 lines** in total, and
   - no single fenced block exceeds **60 lines**. A longer sample lives in the repository and
     is linked by path rather than pasted in.
4. A document carries no YAML frontmatter, so there is none to exclude from the count. Where
   a project's docs-site generator forces one on a folder index — see
   [file-organization.md](file-organization.md) — that line does not count toward the budget.
5. In a folder index `README.md`, the file table falls outside the word count. Everything
   else in it counts.

### Measuring

6. Measure prose with:

````bash
# words of prose in one document (frontmatter and fenced blocks stripped)
awk 'NR==1&&/^---$/{fm=1;next} fm==1{if(/^---$/)fm=2;next} /^```/{f=!f;next} !f' FILE | wc -w

# every document in the tree, largest first
find docs -name '*.md' | while read -r f; do
  printf '%s %s\n' "$(awk 'NR==1&&/^---$/{fm=1;next} fm==1{if(/^---$/)fm=2;next} /^```/{f=!f;next} !f' "$f" | wc -w)" "$f"
done | sort -rn | head -20
````

### When a document is over budget

7. Running past the budget is the signal to **split**, not to compress. Deleting content the
   reader needs is not a fix; see [file-organization.md](file-organization.md) for how to
   split.
8. Reasons are what compress first, and a rule stripped of its reason is the one a later
   reader tidies away. Replacing prose with a Mermaid diagram is the one route back under
   budget that costs the reader nothing, and the preferred one where the content is
   structural — see [diagrams.md](diagrams.md).
9. Documents written before this constitution may exceed the budget. A substantial edit to
   one splits it as part of that change, and an already over-budget document takes no new
   sections.

### Exemptions

10. Legal documents — terms of service, privacy policies — are exempt. They are published
    whole and are not read for speed.
11. Generated artefacts (an OpenAPI document, a generated API reference), the
    [UI test reports](ui-test-reports.md), and any tree the docs-site build excludes are
    exempt. A report is a record of one test run rather than a document a reader keeps
    returning to, and splitting one would separate a screenshot from the case it belongs to.
12. There are no other exemptions. A document that feels indivisible almost always has an
    overview and a reference half.

## Rationale

The cap is a maintenance device, not an aesthetic one. A document nobody finishes is a
document nobody corrects, and stale docs cost more than missing ones. A five-minute file
also has one clear subject, which makes it obvious where a new fact belongs and obvious when
a fact has become wrong.
