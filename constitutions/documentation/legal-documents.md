# Legal documents

What a legal document — terms of service, a privacy policy, a statutory notice — carries
besides its prose for the build that publishes it: one frontmatter key, and the markers
around notes the published page leaves out.

## Rules

### The acceptance version

1. A document a person accepts — terms they agree to, a policy they consent to — carries one
   frontmatter key, an acceptance version: an integer from 1, raised only for a change that
   everyone who accepted has to accept again. An acceptance is recorded against that
   number, and a raise is what puts the consent step back in front of them. Git cannot
   supply it, because a commit counts every edit and a corrected typo asks nobody to accept
   anything.
2. The key is named for what it counts, as `acceptance_version` is, and the build refuses
   anything but a whole number. A plain `version`, `date` or changelog stays forbidden, as
   [file-organization.md](file-organization.md) rule 13 has it: git records those, and a
   key spelled like one invites a raise on every edit.
3. The document's own text says which changes raise the number, so the person who accepted
   it reads the same rule the build applies.
4. The document is the number's one home. Where the build commits a copy for code that
   cannot read the document at run time, a check fails once the copy no longer matches it.
5. A document nobody accepts — a statutory notice, a disclosure — carries no frontmatter at
   all.

### Strip markers

6. A note for the repository only — why the draft banner is there, a reviewer's caveat, a
   link into the rest of the documentation tree the published page cannot follow — sits
   between a start marker and an end marker, each an HTML comment on a line of its own and
   named for the surface that drops them, `<!-- app:strip-start -->` and
   `<!-- app:strip-end -->` in one project. The build drops every line from a start to its
   end, markers included, along with the frontmatter. The comments render as nothing, so
   the note still reads in place on the code host and the docs site.
7. A marker counts only on a line of its own, inside a blockquote or not, so a note that
   quotes the markers in backticks stays text. Blocks do not nest. A start inside a block,
   an end without a start, or a block left open fails the build, since publishing would
   either show the note or drop the terms after it.

These are the keys [file-organization.md](file-organization.md) rule 14 lets a legal
document carry, and the markup [document-shape.md](document-shape.md) rule 3 lets it carry;
it invents no others. Its length is exempt from the budget under
[document-sizing.md](document-sizing.md) rule 10.
