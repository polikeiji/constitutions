# Python tooling

The toolchain every Python project in the repository runs on.

## Rules

### Python version

1. Python **3.12** is the minimum version, and the latest stable release is the one to be on
   where it is available.
2. That version is declared in `pyproject.toml` under
   `[project] requires-python = ">=3.12"`.

### Package manager: uv

3. **uv** is the sole package manager. `pip`, `pip-tools`, `poetry` and `conda` are not
   used.
4. Dependency declarations all live in `pyproject.toml`; no `requirements.txt` is committed.
5. The lock file (`uv.lock`) is committed.

```bash
uv init my-project              # create a new project
uv add fastapi pydantic         # add a dependency
uv add --dev pytest ruff mypy   # add a dev dependency
uv run python -m mypackage.cli  # run a module
uvx ruff check .                # run a tool without installing it
uv sync                         # sync dependencies from the lock file
```

6. A runnable Python command written into a code comment, README, or any other document is
   written as `uv run`, never as bare `python` or `python3`. A copied `python -m …` runs
   against whatever interpreter the shell happens to have.

### Formatter and linter: ruff

7. **Ruff** is the sole formatter and the sole linter. `black`, `autopep8`, `yapf`,
   `flake8`, `pylint` and `isort` are not used.
8. Configuration lives in `pyproject.toml`:

```toml
[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.format]
quote-style = "double"
indent-style = "space"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM", "ANN"]
ignore = []
```

`E`/`F` are pycodestyle and pyflakes, `I` is isort, `UP` is pyupgrade, `B` is bugbear, `SIM`
is simplify, and `ANN` enforces the annotations [type-hints.md](type-hints.md) requires.

9. A rule ruff has removed does not belong in `ignore` — it produces a warning on every run
   — so an ignore entry is checked against the ruff changelog before it is added.

### Type checker: mypy

10. **Mypy** is the type checker, and it runs in strict mode:

```toml
[tool.mypy]
python_version = "3.12"
strict = true
plugins = ["pydantic.mypy"]
```

11. A `# type: ignore` comment names a specific error code
    (`# type: ignore[assignment]`) and is never added speculatively — strict mode flags an
    unused ignore as an error of its own.

### Before a commit

12. All three commands run before a commit, each finishing with zero errors and zero
    warnings:

```bash
uv run ruff format .
uv run ruff check src/ tests/
uv run mypy src
```

The order matters: format first, because it applies in place and would otherwise invalidate
what the other two just read; then lint, then types. A command exiting non-zero or printing
a warning blocks the commit.

13. Those three are wired into pre-commit hooks or CI steps, so the check does not depend on
    remembering it.
