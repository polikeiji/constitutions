# Python

Standards and conventions for Python code: the toolchain, the type policy, and the shape of
the code under it.

## Index

| Document | Covers |
|---|---|
| [Tooling](tooling.md) | Python version, uv, ruff as formatter and linter, mypy |
| [Type hints](type-hints.md) | The annotation policy: coverage, syntax, aliases, return types |
| [Data models](data-models.md) | Pydantic v2 for all structured data |
| [Web APIs](web-api.md) | FastAPI conventions: routers, schemas, dependency injection, error handling |
| [Testing](testing.md) | pytest, pytest-asyncio, coverage, test design |
| [Project structure](project-structure.md) | Directory layout, `pyproject.toml`, naming, layer separation |

The rules are numbered per file. A project that does not build an HTTP API installs every
document but [web-api.md](web-api.md).
