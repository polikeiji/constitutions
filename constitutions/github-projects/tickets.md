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
- **PR instructions** — target branch, PR title, and what the description contains.

A ticket carries enough of its source to be implemented without opening it. The link in
Context is for a reader who wants the reasoning; anyone who has to follow it before they
can start is reading an incomplete ticket.

## Size

One ticket is exactly one pull request. A ticket that would take two is split; one too
small to justify a PR merges into the ticket beside it. The board's statuses describe the
life of a PR, and that one-to-one mapping is what keeps *In review* a true statement about
the ticket rather than about a fraction of it.

That pull request changes around twenty files, a count the ticket can be checked against as
it is cut, since the files a change touches are mostly known before it is written. A ticket
whose diff runs well past twenty is carrying more than one change and splits along that
seam; the figure is a threshold to split against, not a quota to fill.

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

Prerequisites are named in the description, and tickets are created in dependency order, so
the board reads in the order the work can actually happen.

The board's own coordinates — its number, its owner, whether it is user-scoped or
org-scoped — live in the project's agent entry point. This document travels between
projects with different boards and names none of them.
