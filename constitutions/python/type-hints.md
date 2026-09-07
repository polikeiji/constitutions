# Python type hints

The annotation policy, which is what makes the strict mypy run in
[tooling.md](tooling.md) mean anything.

## Rules

### Coverage

1. Every function and method carries type annotations on all parameters and on the return
   type. A private method or a lambda assigned to a variable is no exception.
2. Every module-level variable and class attribute is annotated.
3. `Any` appears only at the interface to a third-party library that provides no type
   information, and is wrapped in a typed alias even there, so the untyped surface has one
   name and one place to fix.

### Syntax

4. Generics are the built-in types (`list[str]`, `dict[str, int]`, `tuple[int, ...]`), not
   `typing.List` or `typing.Dict`.
5. Unions are `X | Y`, not `typing.Union[X, Y]`; an optional is `X | None`, not
   `typing.Optional[X]`.
6. `from __future__ import annotations` appears only where a forward reference is
   unavoidable and neither a string literal nor restructuring resolves it.

### Complex types

7. A complex type used more than once gets a `TypeAlias`:

```python
from typing import TypeAlias

JsonDict: TypeAlias = dict[str, "JsonValue"]
JsonValue: TypeAlias = str | int | float | bool | None | list["JsonValue"] | JsonDict
```

8. A generic function takes a `TypeVar`; decorator typing takes a `ParamSpec`.
9. A callback parameter is `Callable[[ArgType], ReturnType]`. A complex callable signature
   is a `Protocol` instead, which gives the argument names as well as the types.

### Return types

10. A function that never returns is annotated `-> NoReturn`.
11. A function returning nothing is annotated `-> None` explicitly.
12. A generator function is annotated `Generator[YieldType, SendType, ReturnType]`, or
    `Iterator[YieldType]` / `AsyncIterator[YieldType]`.

## Examples

```python
# Good
def fetch_user(user_id: int, active_only: bool = True) -> User | None:
    ...

async def list_items(
    category: str,
    limit: int = 20,
    offset: int = 0,
) -> list[Item]:
    ...

# Bad — missing annotations
def fetch_user(user_id, active_only=True):
    ...

# Bad — legacy typing imports
from typing import Optional, List
def fetch_user(user_id: int) -> Optional[List[User]]:
    ...
```
