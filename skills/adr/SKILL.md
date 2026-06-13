---
name: adr
description: |
  Write and maintain Architecture Decision Records (ADRs) in docs/adrs/. Always use this skill when the user wants to: record an architecture decision, document why a technology was chosen, write an ADR, capture a technical decision with trade-offs, document why a design approach was selected over alternatives, or create a record of a significant engineering choice. Trigger on: ADR, architecture decision, decision record, "why did we choose X", "document this decision", "record our choice of", technical trade-off documentation, design decision, "we decided to use". When the user describes a technical choice they've made or are making and wants to document it — that's this skill.
---

# Architecture Decision Record Writer

You help write and maintain ADRs — short documents that capture the context, options, and rationale behind significant technical decisions. ADRs serve engineers, architects, and stakeholders as a durable record of *why* things are the way they are.

## Step 1: Survey existing ADRs

Before writing anything, check what already exists:

```bash
find docs/adrs -name "*.md" 2>/dev/null | sort
```

If `docs/adrs/` exists, scan the filenames and read `docs/adrs/README.md` to:
- Find the next available sequence number (next integer after the highest `NNNN` prefix)
- Spot any related decisions the new ADR should reference

If the directory doesn't exist yet, create it:

```bash
mkdir -p docs/adrs
```

## Step 2: Gather context

A good ADR requires: motivation, the decision drivers that matter, a realistic set of options, and the chosen decision with rationale. If the user hasn't supplied these, ask targeted questions rather than guessing:

- What problem or need is prompting this decision *right now*?
- What criteria matter most (performance, cost, team familiarity, operational simplicity, etc.)?
- What options were seriously considered?
- What was chosen, and why?

If the user has provided enough detail, proceed directly to the next step.

## Step 3: Research the options

Before writing, search for current information on each option. ADRs are long-lived documents — stale version numbers, outdated licensing details, or superseded deprecation notices will quietly mislead future readers. A few targeted searches now prevent that.

Search for each option to verify:
- Current version, release cadence, and maintenance status (actively developed? recently abandoned?)
- Known limitations or breaking changes that have emerged recently
- Community reception: notable shifts in adoption, complaints, or endorsements
- Any pricing or licensing changes relevant to the decision drivers

**How to search effectively:** Use queries like `"<option> 2024 OR 2025"`, `"<option> vs <alternative>"`, `"<option> deprecation OR abandoned OR maintenance"`, or `"<option> limitations"`. Focus searches on facts that directly affect your decision drivers — don't enumerate every feature, just the ones that tip the balance.

**What to do with what you find:** Weave verified, current facts into the Options section. If a search reveals something the user didn't mention — for example, that a library they chose just went unmaintained, or that a competing option now has a native feature that closes the gap — surface it in the ADR and flag it to the user. The goal is accuracy, not rubber-stamping the user's stated choice.

## Step 4: Write the ADR

### File format

Every ADR begins with YAML frontmatter:

```markdown
---
title: "Short Decision Title"
adr: NNNN
status: Proposed
date: YYYY-MM-DD
authors:
  - Name
deciders:
  - Name
changelog:
  - version: 1.0.0
    date: YYYY-MM-DD
    author: Name
    changes: Initial version
---
```

`status` must be one of: **Proposed** / **Accepted** / **Deprecated** / **Superseded by [ADR-NNNN]**

When **updating** an existing ADR (e.g., superseding it or recording an outcome), increment the version (patch for minor edits, minor for new sections) and append a changelog entry.

### Mandatory sections

#### Motivation

One short paragraph explaining *why this decision needs to be made now* — the pressure, problem, or opportunity driving it. Answer: what breaks or stays blocked if we don't decide?

#### Decision Drivers

A bulleted list of the criteria and constraints that will determine a good choice. Be specific:

- Performance: response time under 100 ms at p99
- Operational cost: must run within current infrastructure budget
- Team familiarity: TypeScript preferred; no Rust expertise on team
- Compliance: data must stay within EU region

#### Options

One subsection per option considered. For each option, list pros and cons *organized by decision driver* — this makes it easy to compare options on the same axis. Use the exact driver names from the Decision Drivers section as labels.

```markdown
### Option A: PostgreSQL

**Performance** (+) Excellent query planner; handles our projected 50k rows/day easily  
**Operational cost** (-) Requires managed service (~$80/month) or self-hosted ops overhead  
**Team familiarity** (+) Three engineers have production PostgreSQL experience  
**Compliance** (+) Supports row-level security; EU-region managed options available  
```

#### Decision

State the chosen option in one sentence. Then explain briefly *why* it wins — which drivers tipped the balance, and what acceptable trade-offs were made.

### Recommended additional sections

#### Consequences

What becomes easier, harder, or different once this decision is adopted. Include both good and bad:

- **Good:** We can use battle-tested ORM support; migrations tooling is mature.
- **Bad:** We now carry operational risk if the managed service has outages; team must learn schema migration discipline.

#### Links

Related ADRs, RFCs, design docs, or external references. Use `[ADR-NNNN](NNNN-title.md)` format for cross-references.

### Content guidelines

**Describe the decision, not the implementation.** Focus on *why*, not *how*. An ADR for "use PostgreSQL" shouldn't describe table schemas — that belongs in technical docs. An ADR for "adopt event-driven architecture" shouldn't describe specific queue configurations.

**Write for a 3-minute read.** Each ADR should stay around 400–600 words — enough to capture the reasoning completely, short enough that an engineer can absorb it quickly. If you find yourself writing more, check whether the scope is too broad.

**Use plain language.** ADRs are read by engineers, architects, and sometimes product or business stakeholders. Avoid jargon where plain words work.

**Use bullet points freely.** Dense paragraphs slow scanning. Bullets work especially well in Decision Drivers, Options, and Consequences.

**Use diagrams when they help.** For decisions involving system boundaries, data flows, or topology choices, a Mermaid diagram can convey structure faster than prose. Put it in a fenced code block (` ```mermaid `).

## Step 5: Name and place the file

- Store all ADRs in `docs/adrs/`
- Use zero-padded sequential numbers: `NNNN-short-title.md`
- Short title: lowercase kebab-case summary of the decision (not the problem)
  - Good: `0003-use-event-sourcing.md`, `0007-adopt-graphql-for-client-api.md`
  - Avoid: `0003-database-decision.md` (too vague), `0007-should-we-use-graphql.md` (frame the decision, not the question)

## Step 6: Update the README index

`docs/adrs/README.md` is the entry point for all ADRs. Keep it current whenever you add, supersede, or deprecate a record.

Format:

```markdown
# Architecture Decision Records

| ADR | Title | Status | Summary |
|-----|-------|--------|---------|
| [0001](0001-use-postgresql.md) | Use PostgreSQL | Accepted | Chosen for ACID compliance and team familiarity over SQLite and MongoDB |
```

List ADRs in ascending order by number. Update the Status column when an ADR is superseded or deprecated. If there are more than ~10 ADRs, group them under thematic subheadings.

The README itself should carry YAML frontmatter tracking its version.

## Step 7: Confirm with the user

Tell the user: the filename, ADR number, status, and a one-sentence summary of what was decided.
