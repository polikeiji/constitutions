# Python web APIs

Conventions for building HTTP APIs with FastAPI.

## Rules

### Application setup

1. The top-level `FastAPI` app lives in `src/<package>/app.py`, and routers in
   `src/<package>/routers/`.
2. Startup and shutdown logic goes in the `lifespan` context manager. The `on_event`
   handlers are deprecated.

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    # shutdown

app = FastAPI(title="My API", lifespan=lifespan)
```

### Routers

3. Related endpoints are grouped in an `APIRouter`, one resource domain per router file
   (`users.py`, `items.py`).
4. Routers are mounted with a prefix and tags: `APIRouter(prefix="/users", tags=["users"])`.

### Request and response models

5. Every endpoint declares an explicit `response_model` that is a Pydantic `BaseModel`.
   Nothing returns a raw dict.
6. Request and response schemas are separate models, never one model reused for both. Four
   suffixes name them, and which one applies follows from what the model is rather than from
   the endpoint it turns up on:
    - `…Read` — a resource the API reads back, whether it is the whole body or a record
      nested in one: `UserRead`, `MessageRead`.
    - `…Create` — a body that creates a resource: `SavedWordCreate`.
    - `…Patch` — a body that partially updates one: `UserPatch`.
    - `…Request` — a body that is no resource's projection, such as an action, a decision,
      or a batch query: `QueueEnqueueRequest`, `UsageLookupRequest`.

    A shape that is no resource of its own takes a descriptive noun and no suffix, wherever
    it sits: a value object giving one field its structure (`ProgressCount` inside
    `ProgressRead`), or a base the real schemas extend (`UserBase`). Nesting is not what
    decides this — `MessageRead` is nested too, and is a record.

    Output is `…Read` rather than `…Response` because these names are published: they become
    the `components/schemas` keys in the generated OpenAPI document and the type names in
    every generated client, so the suffix is an interface and renaming it breaks consumers.
    `…Create` and `…Patch` stay separate from `…Request` because they are projections of one
    named resource and sort beside its `…Read` under a shared prefix, which is what makes the
    three shapes of one resource visibly one thing; `…Request` marks a body with no `…Read`
    to pair with.

7. A sensitive field such as `password_hash` does not appear on a response model, however it
   exists on the internal one.

### Path and query parameters

8. Path parameters are function arguments with type annotations, and a constrained query
   parameter is a `Query(...)`:

```python
from fastapi import Query

@router.get("/")
async def list_users(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> UserListRead:
    ...
```

### Dependency injection

9. Shared logic — auth, database sessions, pagination, settings — arrives through `Depends`.
10. Dependencies are typed functions or classes, and they call service functions rather than
    carrying business logic themselves.

```python
from fastapi import Depends

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    ...

@router.get("/me")
async def get_me(user: User = Depends(get_current_user)) -> UserRead:
    ...
```

### Error handling

11. A client error (4xx) raises `fastapi.HTTPException`. An endpoint function does not catch
    and swallow exceptions.
12. Domain-specific errors get a global exception handler, so they map to consistent HTTP
    responses rather than to whatever each endpoint decided:

```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": str(exc)})
```

### Async and status codes

13. Endpoint functions are `async def`. Blocking I/O — database, file, external HTTP — goes
    through an async library, or into a thread pool via `asyncio.to_thread`. One blocking
    call in an `async def` stalls the whole event loop.
14. Routes carry an explicit `status_code`: `201` for a `POST` that creates, `204` for a
    successful deletion with no body, `200` for every other success.
