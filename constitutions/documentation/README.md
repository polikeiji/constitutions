# Documentation

Rules for every markdown document a repository carries, and for the rule documents
themselves.

## Index

### Every document

| Document | Covers |
|---|---|
| [Document shape](document-shape.md) | What a document is, how it opens, how few of them there are, and what keeps it true |
| [Document sizing](document-sizing.md) | The five-minute read budget, how to measure it, what is exempt |
| [File organization](file-organization.md) | Splitting an over-budget document into a folder, folder `README.md` indexes, frontmatter |
| [Tree shape](tree-shape.md) | What the top level of the documentation tree is organised around, and where a new document goes |
| [Cross-referencing](cross-referencing.md) | One home per fact, which document owns what, removing duplicates, link mechanics |
| [Diagrams](diagrams.md) | Mermaid as the default format, when a diagram is required, choosing the type |
| [Diagram style](diagrams-style.md) | Diagram size, accessibility, verification, and what a drawn layout carries |

### Particular kinds of document

| Document | Covers |
|---|---|
| [Application documentation](applications.md) | What an application's tech stack, architecture, pipelines and tests sections contain |
| [AI agent documentation](agents.md) | What an application's `agents/` section contains: stack, agent map, prompts and tools, models, evaluations |
| [Batch process documentation](batch-processes.md) | What a batch process adds to an application's sections: trigger, schedule, where it runs, run history |
| [UI test reports](ui-test-reports.md) | The report a user-visible change leaves behind, and how the PR links it |

### The constitutions themselves

| Document | Covers |
|---|---|
| [Authoring a constitution](authoring.md) | How these rule documents are written: what goes in, voice, the `Upstream:` line, size |

The first group governs any document in the tree, the second only the kind it names, and
[authoring.md](authoring.md) only the constitutions.

This folder replaces the single `documents.md` that preceded it. A copy installed before
the split carries an `Upstream:` line pointing at that file; the rules it held are spread
across the first three documents above.
