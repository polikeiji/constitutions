# Tree shape

The top level of the documentation tree is organised around what the project runs — its
environments, its applications, its pipelines, its cloud account and the services it pays
for — so that a new document has exactly one obvious home.

## The top level

```text
docs/
  environments/        one entry per environment — what it is, its URLs, its resources, its docs
  local-development/   bringing the stack up on a laptop
  <application>/       one folder per application, each carrying the sections below
  devops/              the pipeline inventory: trigger, environment, secrets
  cloud/               the cloud architecture diagram and the monthly cost estimate
  saas/                paid services outside the cloud account, and their monthly cost
  specs/ adrs/ constitutions/ legal/ test-reports/   organised by document type
```

An application is a folder because that is the noun a reader arrives with. Someone asking
how the admin console is built does not know whether the answer was filed as architecture,
as a plan or as a guide, and under a tree organised by document type they have to open all
three and reconcile what they find. `specs/`, `adrs/`, `constitutions/`, `legal/` and
`test-reports/` are the folders that survive by document type, because they hold records
whose *kind* is what a reader searches by — a decision and why it beat the alternatives, a
rule, the evidence that one change was tested.

A runbook and a generated contract both fail that test. Nobody searches for *a guide*: they
search for the console they have to configure or the tenant they have to provision, and that
noun is an application or an area this tree already names. Nobody searches for *an API*
either; they search for a particular application's. Both are documentation of one thing the
project runs, and filing them by type is the shape this tree exists to avoid.

An application kept in its own sub-project directory joins the tree as a symlink to that
sub-project's `docs/`, so its documentation stays where it belongs and still renders as one
site. It carries the same section names as any other application folder.

There is no `plans/`, because how something is intended to be built is written in its ticket
rather than in a document; see [cross-referencing.md](cross-referencing.md).

## The sections an application folder carries

```text
  architecture/     a drawn layout, plus a short explanation of every element in it
  tech-stack.md     the stack drawn, with versions and why each piece is there
  software-design/  class, package, flow and sequence diagrams, in Mermaid
  agents/           where the application has AI agents: their map, interactions and triggers,
                    plus the evaluation-pipeline design
  data-design/      where the application owns a database: the ERD
  api/              where the application publishes a contract: the generated document and
                    the page that renders it
  ui-catalogue.md   where the application has UI: how the component catalogue is generated
  tests.md          the automated test suites and the current coverage
  guides/           the one-time procedures a human runs for it: consoles, accounts, registrations
```

The names are the same in every application folder. A reader who has found one application's
software design knows the path to the next one's without looking, and a new subject arrives
at a name that already exists instead of at a folder invented to hold it.

`architecture/` and `tech-stack.md` describe the system as deployed; `software-design/`
describes the code inside it. That seam is what keeps either from growing into the other.

An application carries `api/` only where it publishes a contract. `guides/` is the one of
these sections a top-level area carries too: a runbook about the estate, a paid service or
the pipelines belongs to `cloud/`, `saas/` or `devops/`.

There is no per-application `adrs/`. A decision taken inside one application is still
numbered in the project's `docs/adrs/`, because the number is how an ADR is cited and two
logs numbering independently give the repository two ADR-0001s. An application folder holds
what the application is; why it is that way is a project record.

## A section with no subject is absent

An application with no subject for a section carries no folder for it — no `agents/` where
there are none, no `data-design/` where it owns no database. An empty stub reads as a
document nobody has written yet rather than as a subject the application does not have, and
it costs a row in the folder index that makes the same claim a second time. The absence is
the answer.

## Depth

[file-organization.md](file-organization.md) rule 5 caps a folder two levels below the
documentation root, and an application's section folder sits exactly at that cap. A section
outgrowing one file splits into prefixed sibling files inside that same folder,
`software-design-session-flow.md` beside `software-design-hint-flow.md`, by rule 4 of the
same document. A third level is the sign that the section has become an area of its own, and
an area belongs at the top of the tree.

## What dissolves into it

There is no `docs/architecture/`. The shape of one application as deployed belongs to that
application's own `architecture/`, and the estate all of them run on belongs to `cloud/`; a
folder collecting those by document type is the shape this tree exists to avoid.

There is no `docs/api/`. A generated contract documents the application it was generated
from, so it is that application's `api/`; a top-level folder publishes one application's
file under a name that promised the project's.

There is no `docs/guides/`. Bringing the stack up is something every contributor does rather
than a procedure someone runs once, so it becomes the top-level `local-development/`. Every
other guide moves to the folder whose readers would be wrong without it —
[cross-referencing.md](cross-referencing.md) rule 7 read against a folder.

That a runbook is operational rather than descriptive is true, and is not the question. It
is still about one thing the project runs, and the reader who needs it arrives at that
thing's folder. A top-level `guides/` files it by how the document is written instead, which
is the one sort this tree rejects everywhere else.

## Indexes, and choosing between two homes

Every folder this shape adds carries the `README.md` index that
[file-organization.md](file-organization.md) requires — the top-level folders and every
application section alike.

Where a subject could sit in two of them, the owner is the folder whose readers would be
wrong without it, which is [cross-referencing.md](cross-referencing.md) rule 7 read against
a folder rather than a document. The tables an application reads and writes are its
`data-design/`; the database account they are billed under is `cloud/`.
