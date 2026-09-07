# Documenting a workflow

What is written down beside a pipeline, once the YAML is the artifact.

A markdown file restating a workflow's trigger, jobs, and permissions is deleted rather
than maintained — it is a second copy of the design, and the copy drifts from the file that
actually runs. What survives is what the YAML cannot hold:

- **One-time human procedures** — creating a federated credential, granting a role, binding
  a custom domain. These are runbooks, and belong to the area they configure.
- **Rationale and rejected alternatives** — why the deploy runs at one scope rather than
  another, why an approval gate was deliberately omitted, why a job runs on a hosted runner
  rather than the self-hosted pool.

A file mixing the two is split along that line, not deleted whole.

The one exception is a **generated pipeline inventory**: a single document listing every
pipeline with its triggers, the environment it deploys to, and the secrets and variables it
names. The prohibition is aimed at a second copy that drifts, and a derived file cannot
drift from what it was derived from — provided all three of these hold:

- a script in the repository produces it from `.github/workflows/*.yml`;
- CI regenerates it; and
- CI fails when the committed copy differs from the freshly generated one.

The third condition is the one carrying the exception, because a generated document nothing
checks is a hand-written one with extra steps. The document opens with a banner naming the
script that writes it, so an editor is told before they edit rather than after. One such
document is permitted rather than a pattern to reach for: a second inventory is two answers
to the same question.
