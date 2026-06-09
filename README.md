# skills

Personal Claude Code skills for use across projects.

## Usage

### Add the marketplace

```
/plugin marketplace add polikeiji/skills
```

### Install individual skills

```
/plugin install eval-pipeline-plan@keiji-personal-skills
/plugin install impl-plan@keiji-personal-skills
/plugin install devops-plan@keiji-personal-skills
# etc.
```

Then run `/reload-plugins` to activate.

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
| [implement-ticket](skills/implement-ticket/) | Implement a GitHub project ticket with per-sub-item commits, live status tracking, and automatic PR creation | — |
| [review-pr](skills/review-pr/) | Review a GitHub PR using the official code-review skill and post findings as inline review comments with one-click code suggestions | code-review@claude-plugins-official |
| [eval-pipeline-plan](skills/eval-pipeline-plan/) | Generate evaluation pipeline plans for GenAI agents and skills, with LangSmith tracking and Azure ML deployment | — |

## Adding a skill

1. Create a folder under `skills/` with a kebab-case name.
2. Add a `SKILL.md` file with the required frontmatter (`name`, `description`) and instruction body.
3. Load it in any project via `/plugin marketplace`.
