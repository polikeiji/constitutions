# GitHub Projects

Rules for work tracked on a GitHub Projects board: what a ticket contains, what happens to
it between the board and a pull request a human can review, and what that pull request
meets before it merges.

| Document | Covers |
|---|---|
| [Writing tickets](tickets.md) | Title and body, the size limit and what counts toward it, registering, labels |
| [Splitting a ticket](tickets-splitting.md) | The seams a ticket over the size limit splits along, and how the pieces' PRs merge |
| [From board to reviewed PR](board-to-pr.md) | Branch, commits, a branch past the size limit, PR, status transitions, self-review, `gh` constraints |
| [Reviewing and merging a PR](reviewing-and-merging.md) | The description covered item by item, every workflow finished and green, a human's review of any ADR, who merges |

Tickets, the path to a PR, and the merge are separate files because they are read at
different moments — when work is written down, when it is picked up, and when a finished PR
is about to land — and together they run past what one document holds.
