# TypeScript type system

How the type system is used, safely and consistently.

## Rules

### Strictness

1. `strict: true` is set. It activates `strictNullChecks`, `noImplicitAny`,
   `strictFunctionTypes`, and five other flags.
2. `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are enabled too; `strict`
   does not include them. The full config is in
   [tooling/tooling-web.md](tooling/tooling-web.md) rule 7.

### No escape hatches

3. There is no `any`. A genuinely unknown type is `unknown`, narrowed explicitly.
4. There is no `@ts-ignore` and no `@ts-nocheck`. A known, deliberate type conflict —
   testing invalid input, for instance — is `@ts-expect-error` with a comment saying why.
   `@ts-expect-error` fails once the error it suppresses is gone, which is the difference
   that matters.
5. A cast with `as SomeType` appears only at the interface to an external library that lacks
   types, isolated in a single typed wrapper function.

### `interface` versus `type`

6. An object shape that may be extended or implemented by a class is an `interface`.
7. Unions, intersections, tuples, and aliases for primitives are a `type`.
8. The two do not swap: no `type` for an extensible object shape, no `interface` for a
   union.

```typescript
// Good
interface User {
  id: number;
  name: string;
}

type UserId = number;
type Status = "active" | "inactive" | "pending";
type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

// Bad — type alias for a plain extensible object
type User = { id: number; name: string };
```

### Nullability

9. `null` and `undefined` are not interchangeable. An optional value is `undefined`; `null`
   marks a value explicitly absent, such as a nullable database column or an API that
   returns `null`.
10. Optional chaining (`?.`) and nullish coalescing (`??`) replace manual null guards.

### Generics

11. Type parameters carry meaningful names (`TItem`, `TResponse`) wherever the meaning is
    non-obvious. Single letters are fine in short utility types.
12. A type parameter with a known shape is constrained with `extends`:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Utility types

13. The built-in utility types (`Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`,
    `Readonly<T>`, `ReturnType<F>`) are used rather than re-invented.
14. No more than two utility types nest inline; deeper than that becomes a named type alias.

### Enums

15. There is no `enum`. TypeScript enums emit JavaScript, which surprises at runtime; a
    `const` object with `as const` carries the values and the type derives from it:

```typescript
// Good
const Direction = { Up: "up", Down: "down", Left: "left", Right: "right" } as const;
type Direction = (typeof Direction)[keyof typeof Direction];

// Bad
enum Direction { Up = "up", Down = "down" }
```

### Narrowing

16. Narrowing goes through type guards (`typeof`, `instanceof`, `in`, custom `is`
    predicates) rather than a cast. A guard is checked at runtime; a cast is a claim nothing
    verifies.

```typescript
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}
```
