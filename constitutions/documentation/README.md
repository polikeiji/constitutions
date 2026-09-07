# Documentation

Rules for every markdown document a repository carries, and for the rule documents
themselves.

## Index

| Document | Covers |
|---|---|
| [Document shape](document-shape.md) | What a document is, how it opens, how few of them there are, and what keeps it true |
| [Document sizing](document-sizing.md) | The five-minute read budget, how to measure it, what is exempt |
| [File organization](file-organization.md) | Splitting an over-budget document into a folder, folder `README.md` indexes, frontmatter |
| [Tree shape](tree-shape.md) | What the top level of the documentation tree is organised around, and where a new document goes |
| [Cross-referencing](cross-referencing.md) | One home per fact, which document owns what, removing duplicates, link mechanics |
| [Diagrams](diagrams.md) | Mermaid as the default format, when a diagram is required, choosing the type |
| [Diagram style](diagrams-style.md) | Diagram size, accessibility, verification, and what a drawn layout carries |
| [UI test reports](ui-test-reports.md) | The report a user-visible change leaves behind, and how the PR links it |
| [Authoring a constitution](authoring.md) | How these rule documents are written: what goes in, voice, the `Upstream:` line, size |

Everything here except [authoring.md](authoring.md) governs any document in the tree. That
one governs only the constitutions.

This folder replaces the single `documents.md` that preceded it. A copy installed before
the split carries an `Upstream:` line pointing at that file; the rules it held are spread
across the first three documents above.
