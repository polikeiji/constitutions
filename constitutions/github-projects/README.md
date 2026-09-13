# GitHub Projects

Rules for work tracked on a GitHub Projects board: what a ticket contains, and what happens
to it between the board and a pull request a human can review.

| Document | Covers |
|---|---|
| [Writing tickets](tickets.md) | Title and body, the size limit and what counts toward it, registering, labels |
| [Splitting a ticket](tickets-splitting.md) | The seams a ticket over the size limit splits along, and how the pieces' PRs merge |
| [From board to reviewed PR](board-to-pr.md) | Branch, commits, a branch past the size limit, PR, status transitions, self-review, `gh` constraints |

Tickets and the path to a PR are separate files because they are read at different moments
— one when work is being written down, the other when it is picked up — and together they
run past what one document holds.
