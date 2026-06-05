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

## Adding a skill

1. Create a folder under `skills/` with a kebab-case name.
2. Add a `SKILL.md` file with the required frontmatter (`name`, `description`) and instruction body.
3. Load it in any project via `/plugin marketplace`.
