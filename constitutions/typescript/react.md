# React

Conventions for building UI with React 19 and TypeScript.

## Rules

### Components

1. Components are function components. **Exception:** an error boundary, which implements
   `componentDidCatch` or `getDerivedStateFromError`, is a class component — React has no
   hook-based equivalent for those lifecycle methods. That is the only class component a
   codebase needs, and it justifies no others.
2. Components are **not** annotated `React.FC<Props>` or `React.FunctionComponent<Props>`.
   Those types carried an implicit `children` before React 18 removed it, and what is left
   is noise. The return type is inferred, or annotated `React.ReactElement | null`:

```typescript
// Good — props typed via an interface, return type inferred
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// Bad
const Button: React.FC<ButtonProps> = ({ label }) => ...;
```

3. Components are named exports. A default export appears only on a route-level page
   component, where the framework requires one.

### Props

4. Props are an `interface` named `<ComponentName>Props`, in the same file as the component.
5. Props are destructured in the function signature, not reached as `props.foo` inside the
   body.
6. An optional prop takes its default in the destructuring, not from `defaultProps`, which
   React 19 deprecated.
7. An event handler prop carries the correct DOM event type:

```typescript
interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### Hooks

8. Built-in hooks come first. Stateful behaviour needed in more than one component becomes a
   custom hook.
9. A custom hook starts with `use`, which React's linting rules enforce; is named for what
   it does (`useUserSession`, not `useData`); lives in `src/hooks/`, or beside the component
   where it is single-use; and is typed, with no implicit `any` in its return value.
10. **`useEffect` is an escape hatch**, not a default tool. A value derivable from state, a
    custom hook, or an event handler covers most of what it gets reached for; what is left
    is genuine side effects — subscriptions, DOM measurements, external synchronisation.
11. Where the React Compiler is not in the build — Bun's bundler does not apply it, and it
    needs `babel-plugin-react-compiler` — memoisation is **not** automatic, so `useMemo`,
    `useCallback` and `React.memo` are the real tools for avoiding unnecessary re-renders
    and recomputation. They are applied deliberately, where a value is expensive to
    recompute or a child's re-renders are an actual problem, not to every derived value and
    callback prop.

### State

12. State sits as close to its use as possible, and lifts only where two sibling components
    genuinely share it.
13. Independent fields are separate `useState` calls. A single object state is for fields
    that always change together.
14. State transitions with complex logic, or more than two or three interdependent fields,
    are a `useReducer`.

### Context

15. React Context carries genuinely global state — auth, theme, locale. It is not a
    performance optimisation: every change re-renders all consumers.
16. Context is consumed through an exported typed custom hook, never through a raw
    `useContext` call, so the missing-provider case fails once and loudly rather than as a
    null dereference in each consumer:

```typescript
const UserContext = React.createContext<User | null>(null);

export function useUser(): User {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUser must be used within UserProvider");
  return user;
}
```

### Styling, keys, accessibility

17. Styles sit beside their components, as CSS Modules (`.module.css`) or a utility-first
    framework, rather than in global stylesheets or inline `style` props.
18. A rendered list carries a stable, unique `key` prop. An array index serves only where
    the list is static and never reordered.
19. Interactive elements carry accessible roles and labels, and are semantic HTML
    (`<button>`, `<nav>`, `<main>`) rather than a `<div>` with a click handler.
