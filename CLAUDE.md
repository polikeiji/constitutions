# CLAUDE.md

## Constitutions

The rules for work in this repository are the ones it authors: `constitutions/`, indexed in
[constitutions/README.md](constitutions/README.md). Read them before writing code or
documentation. Where a task and a constitution disagree, raise the conflict rather than
working around it.

## Default project board

All ticket work in this repository uses the following GitHub Project as the default
board. Do not ask which project to use — use this one unless the user names another.

- **URL:** https://github.com/users/polikeiji/projects/9/
- **Title:** Personal software delivery workflows with coding agents
- **Owner:** `polikeiji` (user-scoped project, not org-scoped)
- **Project number:** `9`

Where a rule asks for `<project-number>` and `<owner>`, substitute `9` and `polikeiji`. For
example:

```bash
gh project item-list 9 --owner polikeiji --format json
gh project field-list 9 --owner polikeiji --format json
```

How the board is used — the `--owner` requirement, the `project` OAuth scope, the status
transitions, and the rest — is in
[constitutions/github-projects/](constitutions/github-projects/README.md), which governs
where that document and this file read differently.
