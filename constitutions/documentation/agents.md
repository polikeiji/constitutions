# AI agent documentation

What an application's `agents/` section says about its agents: what they are built on, how
they interact, what they are given to work with, which models run them, and how they are
evaluated. The stack and pipeline rules in [applications.md](applications.md) hold here too,
and this file extends them rather than repeating them.

## Rules

### The stack

1. The agents' pieces join the application's `tech-stack.md` under
   [applications.md](applications.md) rules 1–3: the agent framework or SDK; the store behind
   each kind of memory — conversation history, long-term memory, embeddings — with what it
   holds and how long it keeps it; and the model provider, with any gateway between it and
   the agents. Retention is stated because agent memory is where user data piles up without
   a schema change for anyone to review.

### The agent map

2. Where the application has more than one agent, `agents/` opens with the agent map, a
   `.drawio.svg` under [diagrams.md](diagrams.md) rule 2. It shows every agent, which one
   calls or hands off to which and what passes between them, what starts each one — a user,
   an event, a schedule, another agent — and the stores the agents share. A shared store is
   drawn because two agents writing to one memory interact whether or not either calls the
   other.
3. An application with one agent carries no map: its architecture drawing already shows the
   agent and what it talks to, and a map of one box is a section with no subject.

### Prompts, tools and skills

4. Each agent has one inventory table of its prompts, tools and skills — the name, one line
   on what it is for, and a link to the file that defines it. Prompt text and tool schemas
   are not pasted in: they live in the repository, and
   [cross-referencing.md](cross-referencing.md) rule 5 links them. A pasted prompt is the
   copy that drifts first, because prompts are the part of an agent edited most often and
   with the least ceremony.
5. A tool that reaches outside the application — an MCP server, a third-party API, a write
   to a store another application reads — names the system it reaches and the identity and
   permissions it acts with. That row is the one a security reviewer reads the table for.
6. The inventory may be generated instead, on the conditions the CI/CD constitution's
   [Documenting a workflow](../ci-cd/documenting-workflows.md) sets for the pipeline
   inventory: a script in the repository writes it from the definitions, CI regenerates it,
   and CI fails when the committed copy differs.

### Models

7. Each agent names its model by the exact ID it is configured with, linked to the
   configuration that sets it, and links the parameters that change its behaviour —
   temperature, output limit, reasoning effort — the same way rather than copying them. One
   line says why that model, because whoever weighs a cheaper or newer one has to know what
   the current one was chosen for.
8. A model choice weighed against alternatives is an ADR, and the agent links it. A model
   swap changes behaviour without changing a line of the agent's code, so the evaluations
   below are the only record of whether it held.

### Evaluations

9. `agents/` carries the evaluation-pipeline design [tree-shape.md](tree-shape.md) places
   there, one entry per evaluation suite:
   - **what it evaluates** — the behaviours, the graders that score them (exact match, a
     rubric, a model acting as judge, named by its own model ID), and the threshold a run
     has to meet;
   - **the dataset** — where it lives, how many cases, how they were collected and are
     refreshed, and how a version of it is pinned, so two runs compare the same cases;
   - **when it runs** — on a pull request touching prompts, tools, or model configuration,
     on a schedule, or by hand — in one sentence, with a link to the workflow;
   - **what a failure does** — whether it blocks a merge or only reports, and who reads the
     report.
10. A dataset built from real conversations says how they were anonymised and under what
    consent they were kept. A dataset is copied, shared, and attached to bug reports far
    more freely than the database it was drawn from.
11. Scores follow [applications.md](applications.md) rule 10: the latest run is linked,
    never typed in. A score in prose outlives the prompt that earned it.
12. The evaluation workflows are listed in the Pipelines section that
    [applications.md](applications.md) rule 7 requires, beside the application's other
    pipelines, so a reader looking for what runs against the application finds all of it in
    one place.

## Rationale

An agent's behaviour is set by text and configuration rather than by code a type checker
reads: a prompt, a tool description, a model ID, a temperature. Each can change in a
one-line diff that no test outside the evaluations notices. The rules above keep those
things linked from one place, and the evaluations beside them, so that a reviewer reading a
one-line prompt change can see both what it touches and what would catch it going wrong.
