# Constitutions

Portable rule documents. Each states what good output looks like for a single concern, in
enough detail that a coding agent produces the right artifact from it without further
instruction.

## Index

| Constitution | Covers |
|---|---|
| [Documentation](documentation/README.md) | What every document looks like — shape, size, splitting, cross-referencing, diagrams — and how these rule documents are written |
| [Product specs](specs.md) | What a product spec covers, and what it leaves to the code |
| [Architecture decision records](adrs.md) | What an ADR records about a decision, and what keeps it readable later |
| [GitHub Projects](github-projects/README.md) | How tickets are written, and how one gets from the board to a reviewed PR |
| [CI/CD pipelines](ci-cd.md) | Which pipelines a repository carries, and what each one guarantees |
| [Python](python/README.md) | Python standards: uv, ruff, mypy, Pydantic v2, FastAPI, pytest |
| [TypeScript](typescript/README.md) | TypeScript and React standards: Bun, Biome, strict types, React 19 |
| [Bicep](bicep/README.md) | Azure infrastructure-as-code: CAF naming, linting, modules, security |

Rows appear here as documents do.

## Where these live

`constitutions/` in this repository is where the documents are authored.
`docs/constitutions/` is where a copy or symlink lands in a consuming project. A topic
document names neither: the paths in its rules belong to the project it governs, and where
the document itself sits is the installer's business. This file names both because it is
the index and has to describe the layout — that exemption belongs to the index, not to a
topic document.

Everything in `constitutions/` is copy surface, so repo-internal tooling stays out of it: a
folder-shaped constitution travels as a folder, and fixtures kept inside one would install
themselves into every project that takes those rules. Tooling groups by kind at the
repository root instead, and takes the name of the constitution it serves — an
`evals/adrs-evals.json` would grade `adrs.md`. A topic folder inside `constitutions/` holds
documents and nothing else.

Installing one means placing the copy, adding a row for it to `docs/constitutions/README.md`
in that project — the same index table used here, so an agent arrives at a map rather than
a directory listing — and pointing the project's agent entry points at that index. Entry
points are a list: `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `copilot-instructions.md`. A
project may carry several. One that carries none gets an `AGENTS.md`, the entry point no
single vendor owns.

```markdown
## Constitutions

Project rules live in `docs/constitutions/`, indexed in
[docs/constitutions/README.md](docs/constitutions/README.md). Read them before writing code
or documentation. Where a task and a constitution disagree, raise the conflict rather than
working around it.
```

The copy carries an `Upstream:` line under its title, pinned to the commit it was taken
from. [documentation/authoring.md](documentation/authoring.md) has that line's shape, the
voice these documents are written in, and the rest of the authoring convention.
