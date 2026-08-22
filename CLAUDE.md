# CLAUDE.md

## Default project board

All ticket work in this repository uses the following GitHub Project as the default
board. Do not ask which project to use — use this one unless the user names another.

- **URL:** https://github.com/users/polikeiji/projects/9/
- **Title:** Personal software delivery workflows with coding agents
- **Owner:** `polikeiji` (user-scoped project, not org-scoped)
- **Project number:** `9`

When a skill or command asks for `<project-number>` and `<owner>`, substitute `9` and
`polikeiji`. For example:

```bash
gh project item-list 9 --owner polikeiji --format json
gh project field-list 9 --owner polikeiji --format json
```

The board is user-scoped, so `--owner polikeiji` is required on every `gh project`
call; omitting it makes `gh` guess the wrong scope.

Project board mutations (`gh project item-edit`, `item-add`) need the `project` OAuth
scope. If a call fails on scope, ask the user to run:

```bash
gh auth refresh -s project
```
