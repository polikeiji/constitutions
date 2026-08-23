# From board to reviewed PR

What a ticket looks like on its way from the board to a pull request that is ready for a
human, and the board mechanics that are easy to get wrong.

Upstream: https://github.com/polikeiji/constitutions/blob/b8aad7c/constitutions/github-projects/board-to-pr.md

## Branch, commits, PR

One branch per ticket, named `<issue-number>-<short-slug>`, and one pull request from it. A
second PR against the same ticket means the ticket was two tickets.

Commits reference their sub-item with `Refs #<number>` rather than a closing keyword: a
sub-item is finished when the PR merges, not when its commit lands on the branch, and a
closing keyword would claim otherwise. A checkbox sub-item has no issue number of its own,
so its commit references the parent ticket instead.

The PR body closes the parent ticket (`Closes #<number>`), summarises what changed, and
carries a test plan whose boxes are checked one at a time as each check actually passes. An
unchecked box on an open PR is worth more than a checked one nobody ran.

Pull requests are not added to the board by hand. Whether they belong on it is set by that
project's own auto-add workflows; inserting one manually overrides a decision the project
already made the other way.

## Status

Three transitions, made while the work is happening rather than reconstructed afterwards:

- **In progress** — before the first commit, so the board shows work starting rather than
  work landing.
- **Done**, per sub-item — once its commit exists. Checkbox sub-items have no board row and
  no status of their own.
- **In review** — when the PR opens.

Self-review, the fixes it produces, and the replies it draws all happen on that same open
PR and move nothing further. *In review* is already true: the ticket is waiting on a human.

## Self-review

A PR gets one honest pass over its own diff before a human is asked for one. Findings land
as inline comments on the PR rather than in the chat, so the fixes that follow read as a
review thread a later reviewer can retrace.

Every comment gets a reply: the ones acted on name the commit that fixed them, the ones
left alone give the reason. A finding quietly fixed leaves the next reader diffing against
a comment that no longer matches the code, and one quietly dropped is indistinguishable
from one that was missed.

The pass is a first pass. It does not stand in for the human review, which is what the
ticket is waiting on.

## Driving the board with `gh`

- Board mutations need the `project` OAuth scope, which `gh auth login` does not grant by
  default; `gh auth refresh -s project` adds it. Checking `gh auth status` before the first
  status change beats discovering the gap three commits in, with a board still reading
  *Backlog*.
- A user-scoped board needs `--owner <user>` on every `gh project` call. Without it `gh`
  guesses the scope, and the guess is wrong.
- A sub-issue missing from `gh project item-list` is unenrolled, not absent — being the
  child of an enrolled parent does not put an issue on the board. Enrol it, then take its
  item ID from the mutation's own response. Reading the empty row as "this sub-item has no
  item ID" is what produced two bug-fix commits here.
- Field and option IDs are opaque and per-board, and option names differ between boards —
  *In progress* on one is *In Progress* on the next. They are resolved per run and matched
  case-insensitively rather than hardcoded.
