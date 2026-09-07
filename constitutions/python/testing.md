# Python testing

The test framework, what coverage is required, and what a test looks like.

## Rules

### Framework

1. **pytest** is the test framework. Tests are pytest functions; `unittest` appears only
   where a library reaches for it internally.
2. Async tests run under `pytest-asyncio`, configured in `pyproject.toml`:

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

3. API integration tests use `httpx.AsyncClient` with FastAPI's `ASGITransport`. The
   synchronous `TestClient` is for a synchronous endpoint only.

```python
import pytest
from httpx import ASGITransport, AsyncClient
from mypackage.app import app

@pytest.fixture
async def client() -> AsyncClient:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
```

### Coverage

4. Minimum line coverage is **80%**, enforced in `pyproject.toml` rather than checked by
   eye:

```toml
[tool.coverage.run]
source = ["src"]

[tool.coverage.report]
fail_under = 80
```

5. Coverage runs as `uv run pytest --cov=src --cov-report=term-missing`.

### File structure

6. Tests live in a top-level `tests/` directory, and each non-trivial `src/` subpackage —
   services, agents, workers, background jobs — has its own mirrored test subdirectory:

```text
src/mypackage/services/user_service.py  →  tests/services/test_user_service.py
```

Router and endpoint tests, and top-level app tests covering the app factory, settings, and
dependency wiring, may sit flat at the top of `tests/`. Where a project already has a
flat-versus-nested split, that is the one to match.

7. Test file names and test function names both start with `test_`.

### Test design

8. Each test function tests **one behaviour**. An omnibus test checking several unrelated
   conditions reports one failure for several causes, and the first one to fail hides the
   rest.
9. Repetition across inputs is `pytest.mark.parametrize`, not a loop inside a test function
   — a loop reports one failure for the whole set.
10. Tests do not depend on execution order. Setup and teardown go through fixtures, never
    module-level state.
11. Mocking happens at the boundary — external HTTP calls, database clients, queue producers
    — not on internal functions. A mock on an internal function tests that the code called
    what it called, which is a restatement of the implementation rather than of the
    behaviour. Mocks are built with `unittest.mock` (`AsyncMock`, `MagicMock`, `patch`)
    unless a project has already standardised on `pytest-mock`'s `mocker` fixture; a new
    test matches whichever the suite already uses.

### Fixtures

12. Shared fixtures live in `tests/conftest.py`, scoped `function` by default and `session`
    for expensive setup such as a database connection.
13. Fixtures carry a type annotation on their return type.

```python
import pytest

@pytest.fixture
def sample_user() -> User:
    return User(id=1, name="Alice", email="alice@example.com")
```

### Running tests

```bash
uv run pytest                                        # everything
uv run pytest --cov=src --cov-report=term-missing    # with coverage
uv run pytest tests/users/test_service.py            # one file
uv run pytest -k "test_create_user"                  # by keyword
```
