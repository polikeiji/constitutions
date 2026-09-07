# Python data models

How structured data is represented, using Pydantic v2.

## Rules

### When a model is a model

1. A data structure crossing a boundary — an API request or response, a config file, a
   database row, an inter-service message — is a Pydantic `BaseModel`. A plain `dict`,
   `dataclass`, or `NamedTuple` carries no validation across that boundary, which is the
   only place validation is worth anything.
2. An internal-only structure with no serialization needs may be a `dataclass`; `BaseModel`
   is the consistent choice.

### BaseModel usage

3. Models inherit from `pydantic.BaseModel` (v2). Nothing imports from `pydantic.v1`.
4. Every field carries a type annotation, with `pydantic.Field` supplying metadata,
   defaults, and validation constraints:

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    id: int
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(pattern=r"^[^@]+@[^@]+\.[^@]+$")
    role: str = "viewer"
    tags: list[str] = Field(default_factory=list)
```

5. A field with no sensible default is required, carrying no default value at all. `None` as
   a default papers over a missing required value and moves the failure to whatever reads it
   later.
6. `Field(alias=...)` carries an external name that differs from the Python name, and
   `model_config = ConfigDict(populate_by_name=True)` accepts both.

### Validation

7. Validation goes through v2 validators (`@field_validator`, `@model_validator`) instead of
   `__init__` overrides or post-init hooks.
8. Validators are annotated and free of side effects — no I/O, no database calls. A
   validator that reaches out turns constructing a model into an operation that can fail for
   reasons that have nothing to do with the data.

```python
from pydantic import BaseModel, field_validator

class UserCreate(BaseModel):
    username: str

    @field_validator("username")
    @classmethod
    def username_must_be_lowercase(cls, v: str) -> str:
        return v.lower()
```

### Config

9. Configuration is `model_config = ConfigDict(...)`, the v2 style, never an inner
   `class Config`.
10. A value object that is immutable sets `frozen=True`.
11. A model where silent coercion would be dangerous — financial data, for instance — sets
    `strict=True`.

### Serialization

12. Serialization uses `.model_dump()` and `.model_validate()`, the v2 API, never `.dict()`
    or `.parse_obj()` from v1.
13. `.model_dump(mode="json")` produces JSON-serializable dicts, handling `datetime`,
    `UUID`, and the rest.

### Settings

14. Application configuration is a `pydantic_settings.BaseSettings`, read from environment
    variables by default. `.env` files are for local development only.

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str
    api_key: str
    debug: bool = False
```
