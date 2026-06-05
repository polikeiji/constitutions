# skills

Personal Claude Code skills for use across projects.

## Usage

Load skills in Claude Code with the `/plugin marketplace` command, then select from this repository.

## Structure

Each skill lives in its own folder following the [anthropics/skills](https://github.com/anthropics/skills) convention:

```
skills/
└── skill-name/
    └── SKILL.md
```

`SKILL.md` contains a YAML frontmatter block followed by the skill instructions:

```markdown
---
name: skill-name
description: What this skill does and when to use it.
---

Skill instructions...
```

## Skills

| Plugin | Description | Depends on |
|---|---|---|
| [product-spec](skills/product-spec/) | Write and maintain product specification documents in docs/specs/ | — |
| [impl-plan](skills/impl-plan/) | Create and maintain implementation plan documents in docs/plans/ | — |
| [devops-plan](skills/devops-plan/) | Generate DevOps pipeline plans as markdown documents in .github/workflows/ | — |
| [task-tickets](skills/task-tickets/) | Generate and register task tickets from impl/devops plans to a kanban tool (GitHub Projects, Linear, Notion, Jira) | impl-plan, devops-plan |
| [constitution](skills/constitution/) | Write and maintain project constitutions — coding standards, documentation policies, and team conventions in docs/constitutions/ | — |

## Adding a skill

1. Create a folder under `skills/` with a kebab-case name.
2. Add a `SKILL.md` file with the required frontmatter (`name`, `description`) and instruction body.
3. Load it in any project via `/plugin marketplace`.
