# Python project structure

The layout a Python project takes, what `pyproject.toml` carries, and the seam between the
layers.

## Rules

### Layout

1. Source code lives under `src/<package_name>/` (src layout). This prevents accidental
   imports from the project root, and `uv` builds require it.
2. Tests live in a top-level `tests/` directory, not inside `src/`.

```text
my-project/
├── src/
│   └── mypackage/
│       ├── __init__.py
│       ├── app.py           # FastAPI app factory
│       ├── settings.py      # pydantic-settings config
│       ├── routers/         # HTTP concerns only
│       │   └── users.py
│       ├── models/          # Pydantic schemas
│       │   └── user.py
│       └── services/        # business logic, no HTTP concerns
│           └── user_service.py
├── tests/
│   ├── conftest.py
│   └── users/
│       └── test_user_service.py
├── pyproject.toml
├── uv.lock
└── .env.example
```

### pyproject.toml

3. Project metadata, dependencies, and tool configuration all live in `pyproject.toml`.
   There is no `setup.py`, no `setup.cfg`, and no separate config file for ruff, mypy, or
   pytest.
4. Dev and test tooling sits in `[dependency-groups]` (PEP 735), the uv-native mechanism
   `uv sync` installs — not `[project.optional-dependencies]`, which is for genuinely
   optional runtime extras an end user may or may not install.

```toml
[project]
name = "mypackage"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "pydantic>=2.7",
    "pydantic-settings>=2.3",
]

[dependency-groups]
dev = [
    "pytest>=8",
    "pytest-asyncio>=0.23",
    "pytest-cov>=5",
    "httpx>=0.27",
    "ruff>=0.4",
    "mypy>=1.10",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/mypackage"]
```

### Naming

5. Package and module names are `snake_case`, all lowercase.
6. Class names are `PascalCase`.
7. Function, method, and variable names are `snake_case`.
8. Constants are `UPPER_SNAKE_CASE`, defined at module level.
9. Private attributes and methods take a single leading underscore. A double underscore
   invokes name mangling, and appears only where that behaviour is explicitly wanted.

### Imports

10. Imports are sorted by ruff's `I` ruleset, ordered standard library → third-party →
    local, each group separated by a blank line.
11. There are no wildcard imports (`from module import *`).
12. Imports do not form cycles. Two modules needing each other means their shared types
    belong in a third module.

### Layer separation

13. Routers handle HTTP concerns only: parsing the request, returning the response, calling
    services.
14. Services contain business logic and have no knowledge of HTTP — no `Request`,
    `Response`, or `HTTPException` in a service function. A service that raises an
    `HTTPException` cannot be called from a worker or a CLI without dragging FastAPI in.
15. Models contain only data definitions and validators — no business logic, no I/O.
