---
name: product-spec
description: |
  Write and maintain product specification documents in docs/specs/. Always use this skill when the user wants to: create a product spec, write a feature specification, document product requirements, update an existing spec, write a PRD (Product Requirements Document), describe how a feature or system should behave, or document user-facing functionality. Trigger on: spec, specification, product requirements, PRD, feature doc, feature behavior, product capability, system behavior, functional requirements, user stories (spec level). When the user describes a product feature and asks to "document it", "write it up", or "create a spec for it" — that's this skill.
---

# Product Specification Writer

You help write and maintain clear product specification documents that describe *what* a product does — not how it is built. These specs serve product managers, designers, and stakeholders as the authoritative description of intended behavior.

## Step 1: Survey existing specs

Before writing anything, check what already exists:

```bash
find docs/specs -name "*.md" 2>/dev/null | sort
```

If `docs/specs/` exists, read `docs/specs/README.md` and any specs that might overlap with what the user wants to document. The goal is to update rather than duplicate — a new feature might belong as a section in an existing spec rather than a standalone file.

If the directory doesn't exist yet, create it:

```bash
mkdir -p docs/specs
```

## Step 2: Decide what to create or update

Based on your survey:
- **Update** an existing file if the topic is covered there (even partially)
- **Create** a new file if the topic is genuinely new and distinct
- **Split** an existing file if updating it would push it beyond comfortable reading length (~500 words)

## Step 3: Write the spec content

### File format

Every spec file must begin with YAML frontmatter that tracks its version history:

```markdown
---
title: "Feature Name"
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

When **updating** an existing file, increment the version (patch `x.x.1` for small edits, minor `x.1.0` for new sections, major `2.0.0` for significant rewrites), set today's date, and append a new entry to the changelog array.

### Content guidelines

**Describe behavior, not implementation.** Every sentence should answer "what does it do?" or "why does it do that?" — never "how is it built?" Avoid mentioning specific programming languages, frameworks, cloud services, databases, or infrastructure. If you catch yourself writing technical specifics, step back and describe the user-visible outcome instead.

Good: "Users receive an email notification when their application status changes."
Not this: "A Lambda function triggers an SES call when the applications table is updated."

**Write for a 3-minute read.** Each file should stay around 400–600 words — enough to cover one feature or concern thoroughly, short enough that a reader can absorb it in a single sitting. If you find yourself writing more, that's a signal to split the content into two focused files.

**One concern per file.** A good spec file answers one clear question. Use a common filename prefix to show relationships: `payment-overview.md`, `payment-refunds.md`, `payment-disputes.md`.

**Use plain language.** Specs should be readable by product managers, business stakeholders, and designers — not just engineers.

### Suggested structure

There is no rigid required structure, but most specs benefit from:
- A one-sentence summary at the top (after the frontmatter)
- An **Overview** section (context and purpose)
- A **Behavior** or **Features** section (the substance — what happens, under what conditions)
- An **Edge Cases** or **Constraints** section (boundaries and exceptions, if relevant)

Keep sections short and use bullet points freely — dense paragraphs are harder to scan.

## Step 4: Name and place the file

- Store all specs in `docs/specs/`
- Use lowercase kebab-case: `property-search.md`, `user-authentication.md`
- Group related specs with a shared prefix: `onboarding-overview.md`, `onboarding-email-verification.md`

## Step 5: Update the README index

`docs/specs/README.md` is the entry point for all specs. Keep it current whenever you add, rename, or remove a file.

Format:

```markdown
# Product Specifications

| Document | Description |
|----------|-------------|
| [Feature Name](filename.md) | One-line description of what this covers |
```

If there are more than ~6 files, group related specs under subheadings. The README itself should also have YAML frontmatter tracking its own version.

## Step 6: Confirm with the user

Briefly tell the user what you created or changed — file names, version bumped from/to, and a one-sentence summary of what each file covers.
