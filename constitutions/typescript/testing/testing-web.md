# TypeScript testing on the web

The test runner, coverage, file layout and component tests in every TypeScript package that
targets the web.

## Rules

### Framework

1. **Bun's built-in test runner** is the framework. Jest, Vitest and Mocha are not added as
   dependencies — Bun's runner is Jest-compatible and needs no extra packages.
   **Exception:** React Native component tests run on `jest-expo` — see
   [testing-react-native.md](testing-react-native.md). `bun test` still owns the
   pure-TypeScript half of that suite.
2. `@types/bun` is a dev dependency, for type support.
3. Test files are named `*.test.ts` or `*.spec.ts`, which Bun auto-discovers.

### API

4. Imports come from `bun:test`, not `@jest/globals` or any other package:

```typescript
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
```

5. Bun's test API is Jest-compatible: `describe`, `it`/`test`, `expect`, `beforeAll`,
   `afterAll`, `beforeEach`, `afterEach`, `mock` and `spyOn` all behave as in Jest.

```bash
bun test                                          # everything
bun test src/services/userService.test.ts         # one file
bun test --test-name-pattern "fetchUser"          # by pattern
bun test --watch
bun test --coverage
```

### Coverage

6. Minimum line coverage is **80%**. The `test:coverage` script (`bun test --coverage`) only
   reports; `coverageThreshold` in `bunfig.toml` is what gates CI:

```toml
# bunfig.toml
[test]
coverageThreshold = { lines = 0.8, functions = 0 }
# functions = 0 must be set explicitly: Bun treats an omitted metric as
# requiring 100%, not "unchecked" — omitting it fails the build on function
# coverage even where only line coverage is the acceptance criterion.
coveragePathIgnorePatterns = [
  "src/**/*.tsx",   # components are exercised by integration and e2e, not unit coverage
  "src/test-setup.ts",
  "src/types/**",
]
```

### File structure

7. A test file sits next to the source file it tests, not in a separate top-level
   `__tests__` folder:

```text
src/services/userService.ts
src/services/userService.test.ts
src/components/Button.tsx
src/components/Button.test.tsx
```

### React component testing

8. Component tests use **React Testing Library**
   (`@testing-library/react`, `@testing-library/dom`). React Native components use its RN
   counterpart instead — see [testing-react-native.md](testing-react-native.md).
9. A component test covers behaviour — what the user sees and does — not implementation
   details such as internal state or method calls.

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

it("calls onClick when clicked", () => {
  const handler = mock(() => {});
  render(<Button label="Submit" onClick={handler} />);
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  expect(handler).toHaveBeenCalledTimes(1);
});
```

### Test design

10. Each test function tests **one behaviour**. An omnibus test reports one failure for
    several causes, and the first to fail hides the rest.
11. Tests do not depend on execution order. Mutable state shared between tests is reset in
    `beforeEach` or `afterEach`.
12. Mocking happens at the boundary — HTTP clients, database drivers, external SDKs — not on
    internal functions.
