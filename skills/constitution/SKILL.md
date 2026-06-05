---
name: constitution
description: |
  Write and maintain project constitutions — coding standards, documentation policies, and team conventions — in docs/constitutions/. Always use this skill when the user wants to: create a constitution, write coding standards, define documentation policies, establish team conventions, create a style guide, write contribution guidelines, or document engineering principles. Trigger on: constitution, coding standards, coding policy, documentation policy, style guide, team conventions, engineering principles, contribution guidelines, rules for code, rules for docs. When the user describes a policy or rule set and says "write a constitution", "create standards for", "define our conventions", or "document our policies" — that's this skill.
---

# Constitution Writer

You help write and maintain project constitutions — authoritative policy documents that define coding standards, documentation conventions, and team practices. These documents are enforced by AI agents and serve as the ground rules for all work in the project.

## Step 1: Survey existing constitutions

Before writing anything, check what already exists:

```bash
find docs/constitutions -name "*.md" 2>/dev/null | sort
```

If `docs/constitutions/` exists, read `docs/constitutions/README.md` and any constitutions that might overlap with what the user wants to document. Update rather than duplicate — a new rule might belong as a section in an existing constitution rather than a standalone file.

If the directory doesn't exist yet, create it:

```bash
mkdir -p docs/constitutions
```

## Step 2: Clarify scope before writing

A constitution is only enforceable if it is specific. Before writing, confirm:

- **What domain does it cover?** (e.g., TypeScript coding style, API documentation, git commit messages, testing policy)
- **Who is the primary audience?** (human developers, AI coding agents, or both)
- **Are there existing implicit conventions** in the codebase that should be made explicit? (scan the codebase if helpful)
- **Are there any hard constraints** the constitution must accommodate? (linter config, CI rules, existing tooling)

Infer reasonable answers from the codebase if the user doesn't specify — name your assumptions when confirming.

## Step 3: Decide on file structure

A simple constitution fits in one file. For comprehensive policies (e.g., a full coding standards guide), split into focused files — each readable in under three minutes (~400–600 words).

When splitting, create a dedicated folder named after the constitution:

```
docs/constitutions/
  coding-standards/
    README.md           ← index of files in this constitution
    naming-conventions.md
    error-handling.md
    testing-policy.md
  documentation-policy.md   ← single-file constitution
  README.md                 ← index of all constitutions
```

The folder README lists only the files in that constitution. The top-level README lists all constitutions.

## Step 4: Write each file

### Frontmatter format

Every constitution file must begin with YAML frontmatter:

```markdown
---
title: "Constitution Name — Section"
version: 1.0.0
date: YYYY-MM-DD
authors:
  - Your Name
changelog:
  - version: 1.0.0
    date: YYYY-MM-DD
    author: Your Name
    changes: Initial version
---
```

When **updating** an existing file, increment the version (patch `x.x.1` for small edits, minor `x.1.0` for new sections, major `2.0.0` for significant rewrites), set today's date, and append a new changelog entry.

### Content guidelines

**Write rules, not essays.** A constitution is a set of enforceable rules. Each rule should be a clear, unambiguous statement that can be checked. Prefer bullet points and short declarative sentences over paragraphs.

**Good:** "Function names must use camelCase. No abbreviations unless the abbreviation is universally understood (e.g., `id`, `url`)."
**Not this:** "We generally try to use camelCase for function names and prefer readable names."

**Explain the why for non-obvious rules.** When a rule exists because of a past incident, a constraint, or a subtle invariant — note it briefly. One line is enough.

**Write for a 3-minute read.** Each file should stay around 400–600 words. If a file is growing beyond that, split it.

**One domain per file.** A good constitution file answers one clear question: "What are the rules for X?" Don't mix naming conventions with error handling in the same file.

**Use "must", "must not", "should", "should not" consistently** to signal whether a rule is mandatory or advisory. Avoid vague language like "prefer" or "try to" unless you mean "should not".

### Suggested structure

Most constitution files benefit from:

- A one-sentence purpose statement at the top (after the frontmatter)
- A **Rules** section — the core content, as a numbered or bulleted list
- A **Rationale** section (optional) — for non-obvious rules that need a brief explanation
- A **Examples** section (optional) — concrete right/wrong pairs for rules that are hard to apply without seeing them

## Step 5: Name and place files

- Store all constitutions under `docs/constitutions/`
- Use lowercase kebab-case: `coding-standards.md`, `commit-message-policy.md`
- Group related files under a shared-prefix folder: `docs/constitutions/coding-standards/`
- The folder README must list all files it contains with one-line descriptions

## Step 6: Update the constitutions README index

`docs/constitutions/README.md` is the single entry point for all constitutions. Keep it current whenever you add, rename, or remove a file or folder.

Format:

```markdown
# Project Constitutions

| Constitution | Description |
|--------------|-------------|
| [Constitution Name](path/to/file-or-folder/) | One-line description of what this covers |
```

The README itself must also have YAML frontmatter tracking its version.

## Step 7: Inject constitution references into AI agent entry points

After writing or updating a constitution, find all AI agent entry point files in the repository:

```bash
find . \( -name "CLAUDE.md" -o -name "copilot-instructions.md" -o -name "github-instructions.md" -o -name ".cursorrules" -o -name "AGENTS.md" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  2>/dev/null
```

For each entry point file found, check whether it already contains a reference to `docs/constitutions`. If it does not, append the following block at the end of the file:

```markdown
## Project Constitutions

All coding, documentation, and process policies are defined in `docs/constitutions/`. Read and follow these constitutions before writing any code or documentation:

- Index: [docs/constitutions/README.md](docs/constitutions/README.md)

Every AI agent session must treat the constitutions as hard constraints, not suggestions. If a task would require violating a constitution, flag the conflict to the user rather than proceeding silently.
```

If no agent entry point file exists, note this to the user and suggest creating a `CLAUDE.md` at the project root.

## Step 8: Confirm with the user

Briefly tell the user what you created or changed:
- File names created or updated, with version bumped from/to
- A one-sentence summary of what each file covers
- Which agent entry point files were updated (or created)
- Any assumptions you made about domain rules or conventions
