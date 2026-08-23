# Writing tickets

What a ticket on a GitHub Projects board contains, and how much work belongs in one.

Upstream: https://github.com/polikeiji/constitutions/blob/2bb7165/constitutions/github-projects/tickets.md

## The body

Six sections, in this order: Context, Objective, Technical guidance, Acceptance criteria,
Testing requirements, PR instructions.

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
- **PR instructions** — target branch, PR title, and what the description has to contain.

A ticket carries enough of its source to be implemented without opening it. The link in
Context is for a reader who wants the reasoning; anyone who has to follow it before they
can start is reading an incomplete ticket.

## Size

One ticket is exactly one pull request. A ticket that would take two is split; one too
small to justify a PR merges into the ticket beside it. The board's statuses describe the
life of a PR, and that one-to-one mapping is what keeps *In review* a true statement about
the ticket rather than about a fraction of it.

Sub-items are one commit each — child issues where the tracker offers them, a task-list
checklist in the body where it does not. Both are handled downstream. A checkbox sub-item
is the smaller record, not the lesser one: it has no issue number, so no commit references
it and no board row tracks it, and that is the whole of the difference.

## Labels and order

Every ticket carries `ai-agent` plus one component label naming the area it touches. Labels
that do not exist yet are created before the issue that needs them.

Prerequisites are named in the description, and tickets are created in dependency order, so
the board reads in the order the work can actually happen.

The board's own coordinates — its number, its owner, whether it is user-scoped or
org-scoped — live in the project's agent entry point. This document travels between
projects with different boards and names none of them.
