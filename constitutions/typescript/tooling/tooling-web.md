# TypeScript tooling for the web

The runtime, package manager, compiler, formatter and bundler used by every TypeScript
package that targets the web.

## Rules

### Runtime and package manager: Bun

1. **Bun** is the sole runtime, package manager, bundler, and test runner. Node.js, npm,
   yarn, pnpm and Vite are not used as primary tools. **Exception:** a React Native package
   bundles with Metro — see [tooling-react-native.md](tooling-react-native.md). Bun remains
   the package manager there; only the bundler is carved out.
2. Dependencies are declared in `package.json`, and the lock file (`bun.lock`, Bun's
   text-based format) is committed.
3. Commands go through `bun`, never bare `node`, `npx`, or `npm`:

```bash
bun install                       # install dependencies
bun add react react-dom           # add a dependency
bun add -d @types/react typescript
bun run dev                       # run a package.json script
bun run src/index.ts              # run a file directly, TypeScript included
bunx biome check .                # execute a one-off tool
```

### The compiler

4. Bun runs TypeScript natively by stripping type annotations — it does **not** type-check,
   so `bun run tsc --noEmit` runs separately. Nothing else in the toolchain will notice a
   type error.
5. That type check is a required step in CI and in a pre-commit hook.
6. The minimum TypeScript version is **5.5**, kept at the latest stable release.

### tsconfig.json

7. Every project carries a `tsconfig.json` with these settings:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

`moduleResolution: "bundler"` aligns TypeScript's resolution with Bun's own.
`isolatedModules: true` catches module-level constructs a transpiler — Bun included — would
silently break. `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` catch bugs
`strict: true` alone misses.

### Formatter and linter: Biome

8. **Biome** is the sole formatter and linter. ESLint, Prettier, and a separate config file
   for each are not used. Biome replaces all three plus import sorting: one config file, one
   tool.
9. A `biome.json` sits at the project root, in the Biome 2.x config format —
   `organizeImports` lives under `assist.actions.source`, and lint presets are set through
   `rules.preset` rather than a `recommended` boolean:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.0/schema.json",
  "assist": {
    "actions": { "source": { "organizeImports": { "level": "on" } } }
  },
  "linter": {
    "enabled": true,
    "rules": { "preset": "recommended" }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  },
  "files": {
    "includes": ["**", "!node_modules", "!dist", "!coverage"]
  }
}
```

10. Biome runs before every commit — `bunx biome check --write .` to format, lint and apply
    the fixes it can, and `bunx biome check .` as the CI gate.

### Bundling

11. Production bundling is `bun build`. Webpack, Rollup and Vite enter only where a specific
    plugin has no Bun equivalent. **Exception:** a React Native package — see
    [tooling-react-native.md](tooling-react-native.md).
12. The `build` script in `package.json` does not invoke `bun build` directly. It runs a
    `scripts/build.ts` that HTML-entrypoint-bundles `index.html` and passes environment
    values in through `--define`: unlike Vite, `bun build` only rewrites
    `import.meta.env.KEY` expressions explicitly named in a `--define` flag. It does not
    polyfill `import.meta.env` itself, so a key missing from the define list leaves the raw
    expression in the bundle instead of failing the build.

```typescript
// scripts/build.ts (abridged)
import { $ } from "bun";

const defines = ["--define", `import.meta.env.VITE_API_BASE_URL=${JSON.stringify(apiBaseUrl)}`];
// process.env.NODE_ENV must also be defined explicitly — Bun does not set it the
// way webpack and Vite do in production mode, so a library that branches on it
// (React, for one) ships its development build otherwise.
defines.push("--define", `process.env.NODE_ENV=${JSON.stringify("production")}`);

await $`bun build index.html --outdir dist --target browser --minify ${defines}`;
```

13. Those two `--define` traps are the reason the build is a script rather than a line in
    `package.json`: both fail silently, producing a bundle that builds cleanly and misbehaves
    at runtime.
