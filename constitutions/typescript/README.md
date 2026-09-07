# TypeScript

Standards and conventions for TypeScript and React code: the toolchain, how the type system
is used, and the shape of the code under it.

## Index

| Document | Covers |
|---|---|
| [Tooling](tooling/README.md) | Bun as runtime, package manager and bundler; the compiler; `tsconfig.json`; Biome |
| [Type system](type-system.md) | `strict` mode, no `any`, `interface` versus `type`, enums, narrowing |
| [React](react.md) | Function components, props, hooks, state, context, accessibility |
| [Testing](testing/README.md) | The Bun test runner, React Testing Library, coverage, test design |
| [Project structure](project-structure.md) | Directory layout, naming, import aliases, module boundaries |

Tooling and testing are folders because each carries a React Native carve-out beside its web
rules, and the two are read at different moments. A project with no React Native package
installs the web half of each and skips the other.
