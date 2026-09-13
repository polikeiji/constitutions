# Splitting a ticket

What a ticket over the size limit in [Writing tickets](tickets.md) splits along, and how the
pull requests of its pieces reach the default branch.

## Seams that ship without a feature

Shippable does not mean user-visible. A change whose parts do not each deliver a feature
still splits, and its seams usually land in this order:

- a preparatory change that alters no behaviour and leaves the old path working: a refactor,
  or new code nothing calls yet;
- the tooling the change is verified with: stubs, fixtures, and any harness that does not
  render the new path;
- the behavioural switch itself, with any harness that does, since that harness cannot build
  before the path exists;
- removing what the switch orphaned: dead code, and the tests that folded into the new ones.

Each seam is its own ticket with its own PR, registered with its dependencies in that order,
unless it is too small to justify a PR and merges into the ticket beside it. They are
separate tickets rather than sub-items, so the rule against sub-items in
[Writing tickets](tickets.md) still stands: each piece carries its own six sections and
walks the board on its own.

A seam that is still over the limit splits again, and most often that seam is the switch.
Its new path lands first, beside the old one and reached by nothing, so the default branch
keeps working; a second PR then points callers at it and unhooks what it replaces, leaving
deletion to the removal seam.

Merging two list screens into one, shipped as a single PR of 88 files, cuts into seven:

- **Refactor**, while both screens still exist: the shared list takes its card, spacing and
  labels per row; separately, every writer invalidates the shared cache through one call.
- **Tooling**: the stub API serves the merged list.
- **Switch**: the new screen, its reads and its device harness land at a route nothing links
  to, then the navigation moves to it and the old routes go.
- **Removal**: the orphaned per-kind screens and hooks go, their tests folded into the new
  screen's; then the comments that still describe two screens are corrected.

## How the pieces merge

By default a piece's PR opens against the default branch once its prerequisite has merged,
so its branch starts from one that already holds that prerequisite. A PR that cannot wait is
based on the prerequisite's branch instead, since against the default branch it would show
the prerequisite's files as its own.

When the prerequisite merges, a PR stacked on it is rebased onto the default branch by hand
and retargeted there. A rebase or squash merge lands the prerequisite's commits under new
hashes, so a PR that is only retargeted still shows them as its own. GitHub retargets a PR
by itself only when the branch beneath it is deleted after that branch's PR merges, so in a
repository running with `delete_branch_on_merge` off the retarget is done by hand as well.

While a stacked PR targets that branch its `Closes` does nothing, because GitHub registers
the keyword only on a PR whose base is the default branch. Merged there, it lands in a
branch that has already landed, so its change never reaches the default branch and its
ticket never closes.
