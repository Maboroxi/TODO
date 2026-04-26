# AGENTS.md

## Commands

```
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Type-check + production build (vue-tsc -b && vite build)
npm run preview   # Preview production build
```

No lint, test, or format scripts configured.

## Architecture

Vue 3 + Vite + TypeScript + TailwindCSS v4 todo app. Single-page, client-side only.

### State management

`src/composables/useTodos.ts` uses **module-level singleton** pattern — state (`ref`/`computed`) is defined at module scope, not inside the function. All components calling `useTodos()` share the same reactive state. **Do not** move state variables inside the `useTodos()` function body; that was a bug that broke cross-component state sharing.

### Key files

| Path | Purpose |
|------|---------|
| `src/composables/useTodos.ts` | All app state and business logic (singleton) |
| `src/utils/storage.ts` | localStorage wrapper, key prefix `vue-todo-app` |
| `src/types/todo.ts` | `Todo` interface, `FilterType` union |
| `src/components/TodoList.vue` | Uses `VueDraggable` from `vue-draggable-plus`; listens to `@end` (not `@update`) for reorder |
| `src/style.css` | Only contains `@import "tailwindcss"` — TailwindCSS v4 uses Vite plugin, not PostCSS |

### TailwindCSS v4

Uses `@tailwindcss/vite` plugin in `vite.config.ts`. No `tailwind.config.js` or `postcss.config.js`. Directives: `@import "tailwindcss"` in `src/style.css`.

### TypeScript

Strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch` are all enabled. Project references: `tsconfig.app.json` (src) + `tsconfig.node.json` (vite config).
