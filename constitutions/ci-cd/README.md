# CI/CD pipelines

Which pipelines a repository carries, what each one guarantees, how long a pull request may
wait on them, and the choices that cannot be read off the code.

| Document | Covers |
|---|---|
| [The pipeline set](pipeline-set.md) | The workflow as the artifact, the default set, and the `<component>-<stage>` naming |
| [Writing a workflow](writing-a-workflow.md) | What the repository already answers, what has to be settled first, which pull requests a pipeline runs on, and the two rules a pipeline cannot soften |
| [Documenting a workflow](documenting-workflows.md) | What is written down beside a pipeline, and the one generated document permitted |
| [How long a pull request's pipelines take](pipeline-duration.md) | The three-minute target, how it is measured, what may close the gap and what may not, and the time excepted because the repository does not control it |

Four files because they are read at different moments — naming a new pipeline, writing its
YAML, deciding what prose survives beside it, and finding one too slow — and together they
run past what one document holds.
