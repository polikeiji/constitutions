# TypeScript tooling for React Native

Rules that apply only to a React Native package, where Expo and Metro replace part of the
toolchain the web packages use.

## Rules

14. React Native code bundles with **Metro**, not `bun build`. The carve-out is scoped to
    that package: everywhere else rules 1 and 11 of [tooling-web.md](tooling-web.md) stand
    unchanged, and Metro does not appear outside that tree.

Metro is not a preference here. React Native resolves platform-specific modules at bundle
time (`Component.ios.tsx`, `Component.android.tsx`, `module.native.ts`) and ships the result
as a Hermes bytecode bundle; `bun build` implements neither. Expo's toolchain invokes Metro
itself — `expo start` in development, EAS Build for release binaries — with no seam to
substitute another bundler. The package therefore relies on the Metro configuration Expo
supplies by default, and a `metro.config.js` is committed only where it needs customising.

15. Every other rule in the constitution still applies inside that package:

- **Bun stays the package manager and script runner** — `bun install`, `bun add`,
  `bun run <script>` — and `bun.lock` is committed. Expo and EAS are invoked through it
  (`bun run dev` → `expo start`, `bunx eas-cli`), never via `npx` or `npm`.
- **Biome stays the sole formatter and linter**, per rules 8–10.
- **`tsc --noEmit` stays the type check**, per rules 4–5. The package's `tsconfig.json`
  extends `expo/tsconfig.base` for React Native's own defaults instead of restating rule 7's
  block verbatim, and layers rule 7's strictness flags on top.

Its `lib` is the one setting worth a comment in the file itself. A native-only app narrows
to `["ESNext"]`, because React Native has no DOM and a browser global is then a compile
error worth catching. A package that also sources a web build through `react-native-web`
cannot be typed without `DOM`, so it takes `["ESNext", "DOM"]` and gives up that guard;
`.web.ts` file naming is what then keeps browser-only code out of the native bundles. Which
of the two applies is a fact about the project, so it is recorded on the `lib` line rather
than left for the next reader to infer.

The matching test-runner carve-out is in
[testing-react-native.md](../testing/testing-react-native.md). That carve-out and rule 15
above are the whole concern-by-concern comparison — package manager, bundler, test runner,
formatter, type checking — and no document outside them restates it.
