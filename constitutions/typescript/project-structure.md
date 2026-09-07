# TypeScript project structure

The layout a TypeScript project takes, how things are named, and the seams between the
modules.

## Rules

### Directory layout

1. Source code lives in `src/`. Test files sit next to the source they test, not in a
   separate `__tests__` folder.

```text
my-project/
├── src/
│   ├── main.tsx              # app entry point
│   ├── app.tsx               # root App component
│   ├── components/           # reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.module.css
│   │   └── index.ts          # barrel re-export
│   ├── hooks/                # custom React hooks
│   ├── services/             # business logic, API clients
│   ├── types/                # shared types and interfaces
│   └── utils/                # pure utility functions
├── public/
├── biome.json
├── tsconfig.json
├── package.json
└── bun.lock
```

2. A project that grows large groups files by feature domain rather than by type:

```text
src/
  users/
    UserList.tsx
    UserList.test.tsx
    userService.ts
    userService.test.ts
    types.ts
```

### package.json scripts

3. Every project defines at minimum these scripts:

```json
{
  "scripts": {
    "dev": "bun run src/main.tsx",
    "build": "bun run scripts/build.ts",
    "typecheck": "tsc --noEmit",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "test": "bun test",
    "test:coverage": "bun test --coverage"
  }
}
```

`build` runs a project script rather than invoking `bun build` directly — see
[tooling/tooling-web.md](tooling/tooling-web.md) rule 12 for why.

### Naming

4. Files and directories are `kebab-case` for utilities, services and hooks, and
   `PascalCase` for React component files and their directories (`Button/Button.tsx`).
5. Components are `PascalCase` (`UserProfile`, `NavigationBar`).
6. Functions and variables are `camelCase`.
7. Types and interfaces are `PascalCase` (`UserResponse`, `ApiError`).
8. Constants are `UPPER_SNAKE_CASE` where they are module-level primitives. Object-shaped
   constants are `camelCase`.
9. Custom hooks are `camelCase` prefixed with `use` (`useAuthSession`, `useDebounce`).
10. Boolean variables and props read as a statement: `isLoading`, `hasError`, `canSubmit` —
    not `loading`, `error`, `submit`.

### Imports

11. Imports are absolute from `src/` through tsconfig path aliases, not deep relative paths.
    A relative path breaks the moment the file moves:

```json
// tsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

```typescript
// Good
import { Button } from "@/components/Button";

// Bad — fragile deep relative import
import { Button } from "../../../components/Button";
```

12. A barrel file (`index.ts`) carries the intended public surface of a component API, not a
    blind re-export of everything in the folder.

### Module boundaries

13. Services do not import from components. Components reach services through hooks.
14. `types/` holds only type and interface definitions, and no runtime code.
15. `utils/` holds only pure functions, with no side effects and no React dependencies.
