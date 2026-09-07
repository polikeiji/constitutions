# TypeScript testing for React Native

Rules that apply only to a React Native package, where Jest and React Native Testing Library
replace part of the web setup.

## Rules

13. React Native component tests run on **`jest-expo`** with
    **`@testing-library/react-native`**. The carve-out is scoped to that package: rule 1 of
    [testing-web.md](testing-web.md) stands everywhere else, and neither package appears
    outside that tree.

Bun's runner cannot execute them. Rendering a React Native tree pulls in React Native's own
source, whose Flow-typed internals Bun does not strip, and it depends on Metro's
platform-specific resolution (`.ios.tsx`, `.android.tsx`, `.native.ts`) — which belongs to
Metro, not Bun. `jest-expo` is the preset Expo maintains for exactly this.
`@testing-library/react-native` is rule 8's React Testing Library for React Native, and rule
9 — test what the user sees and does, not implementation details — applies to it unchanged,
as do rules 10–12.

14. **`bun test` still owns the pure-TypeScript half** of the suite: services, hooks logic,
    token maths, geometry. The two runners are split by file **extension**, not by
    directory, which also keeps a file-based router's route tree on the Jest side, since
    every file there renders a component:

| Runner | Command | Files |
|---|---|---|
| Bun | `bun test --isolate` | `*.test.ts` |
| jest-expo | `bun run test:components` | `*.test.tsx` |

Bun's discovery matches `.test.tsx` as well, and it has no setting to narrow the extension
set, so the split is enforced from both sides — `pathIgnorePatterns = ["**/*.test.tsx"]` in
`bunfig.toml` and `testMatch: ["**/*.test.tsx"]` in `jest.config.js`. Without the first,
`bun test` loads the component tests and fails on React Native's internals. Both commands
pass before a commit; neither alone covers the suite.

Rule 6's 80% line coverage threshold is gated on the Bun half, through the same
`coverageThreshold` mechanism, and its `coveragePathIgnorePatterns` exclude `src/**/*.tsx`
and `src/types/**` because components are the Jest half's to cover. A file Bun cannot measure
correctly — an Expo `app.config.ts`, for one — is listed there too, and the reason goes in a
comment beside the entry: exempt from measurement is not the same as untested, and without
the comment the next reader deletes the line.

The matching bundler carve-out is in
[tooling-react-native.md](../tooling/tooling-react-native.md). These two carve-outs and rule
15 there — which records what the package keeps unchanged — are the whole concern-by-concern
comparison, and no document outside them restates it.
