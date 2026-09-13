# Writing tickets

What a ticket on a GitHub Projects board contains, and how much work belongs in one.

## Title and body

The title names the thing being built and leads with the verb — *Convert task-tickets into
the GitHub Projects constitution*, not *Constitution work*. It is the only part of the
ticket a board column shows.

The body carries six sections, in this order: Context, Objective, Technical guidance,
Acceptance criteria, Testing requirements, PR instructions.

- **Context** — the initiative this belongs to, opening with a markdown link to the source
  the ticket was cut from: a plan, a spec, an ADR, a discussion. The link is the route back
  to the reasoning; a ticket drawing on several sources links all of them.
- **Objective** — one sentence on what done looks like.
- **Technical guidance** — the specifics lifted from that source. Technology names, schema
  and payload shapes, constraints, and the decisions already taken, including the ones
  taken by deliberately deferring something.
- **Acceptance criteria** — observable conditions, each checkable against the finished
  branch.
- **Testing requirements** — what to unit test and what to mock, what behaviour the
  integration tests cover, and what infrastructure they need. A ticket with no testable
  surface names the checks that stand in for tests instead of dropping the section.
- **PR instructions** — target branch, PR title, the file count the diff is expected to
  reach, and what the description contains.

A ticket carries enough of its source to be implemented without opening it. The link in
Context is for a reader who wants the reasoning; anyone who has to follow it before they
can start is reading an incomplete ticket.

## Size

One ticket is exactly one pull request, sized so one person can review the whole diff in
one sitting. A reviewer who cannot hold a change in their head approves what they skimmed,
which is a review that did not happen and still reads as one that did. A ticket that would
take two is split; one too small to justify a PR merges into the ticket beside it. The
board's statuses describe the life of a PR, and that one-to-one mapping is what keeps
*In review* a true statement about the ticket rather than about a fraction of it.

**More than twenty changed files is over the limit.** The files a change touches are
mostly known before it is written, so a ticket's PR instructions state the file count it
expects, and one expecting more than twenty is split before it is registered. The figure is
a limit to split against, not a quota to fill.

Every file in the diff counts: source, tests, docs, and each deletion and rename, since a
reviewer still has to confirm that each was meant. Two kinds do not. Output that a
committed script regenerates and CI compares against the committed copy, such as a coverage
page or `openapi.json`, is checked by that comparison, and a
[UI test report](../documentation/ui-test-reports.md) by looking at it; neither is read
line by line. One-off tool output, such as a codemod or updated snapshots, is read like any
other change and counts.

A ticket does not grant itself an exception. A body arguing that its change does not split,
that the halves are not shippable, or that the diff is mostly tests has not found its seam
yet, and none of those is a reason to pass the limit —
[Splitting a ticket](tickets-splitting.md) has the seams such a change splits along. The
limit does not apply to a **mechanical** pull request, a pure move, rename, deletion or
regeneration that contains nothing else and says so in its description, because one check
covers every file in it. A mechanical PR carries no behavioural change: among a hundred
moved files, the one that changed behaviour is the one nobody reviews.

A ticket has no sub-items — no child issues, and no task-list checklist standing in for
them. The one-PR rule already fixes the size, so a split into sub-items restates the commit
history in the tracker and adds rows whose status nobody keeps true. A ticket that looks
like it needs them is two tickets.

## Registering

A ticket joins the board as it is created, landing in the intake column, so the board and
the issue list never disagree about what exists. A board whose auto-add workflow is on does
this itself; otherwise `gh project item-add` does.

Every ticket carries `ai-agent` plus one component label naming the area it touches. Labels
that do not exist yet are created before the issue that needs them.

New tickets land in the intake column, which is accepted work not yet scheduled; the column
after it is what has been picked for the next pass. A blocked column, where the board has
one, is not an intake column — it holds a ticket something outside it is in the way of, and
a ticket parked there names what it is waiting on, because the column records only that
something is. The full path is in [From board to reviewed PR](board-to-pr.md).

Prerequisites are named in the description **and registered on the issue as a dependency**,
and tickets are created in dependency order, so the board reads in the order the work can
actually happen. The two records carry different halves of one fact: the description says
why a ticket waits on another, the dependency field says that it does, and only the field is
visible where the board is read rather than opened. Depending on another ticket is not a
status — a ticket waiting on one stays in the intake column, since the blocked column means
blocked by something outside the ticket set. The endpoint and its traps are in
[From board to reviewed PR](board-to-pr.md).

The board's own coordinates — its number, its owner, whether it is user-scoped or
org-scoped — live in the project's agent entry point. This document travels between
projects with different boards and names none of them.
