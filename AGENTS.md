# AGENTS.md

## Commands

```
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Type-check + production build (vue-tsc -b && vite build)
npm run preview   # Preview production build
```

No lint, test, or format scripts configured.

## Architecture

Vue 3 + Vite + TypeScript + TailwindCSS v4 + Element Plus todo app. Single-page, client-side only.

### State management

`src/composables/useTodos.ts` uses **module-level singleton** pattern — state (`ref`/`computed`) is defined at module scope, not inside the function. All components calling `useTodos()` share the same reactive state. **Do not** move state variables inside the `useTodos()` function body; that was a bug that broke cross-component state sharing.

### Element Plus

Used for the tree widget (`el-tree`) in `TodoList.vue` and `ElMessageBox` in `App.vue`. Imported globally in `src/main.ts` with full CSS (`element-plus/dist/index.css`).

**Critical:** `TodoList.vue` has a **non-scoped** `<style>` block that overrides Element Plus CSS variables (e.g. `--el-color-primary`, `--el-fill-color-blank`) on `.todo-tree`. Adding `scoped` to this block will silently break the overrides.

Dark mode uses Tailwind `class` strategy — toggle `dark` class on `<html>`. The tree overrides use `.dark .todo-tree` to switch variables.

### Key files

| Path | Purpose |
|------|---------|
| `src/composables/useTodos.ts` | All app state and business logic (singleton) |
| `src/utils/storage.ts` | localStorage wrapper, key prefix `vue-todo-app` |
| `src/types/todo.ts` | `Todo` interface, `FilterType` union |
| `src/components/TodoList.vue` | Uses Element Plus `el-tree` with `@node-drop` for reorder; non-scoped `<style>` overrides tree CSS variables |
| `src/components/TodoInput.vue` | Input form for new todos |
| `src/components/TodoFilter.vue` | Filter buttons and clear-completed |
| `src/main.ts` | App entry; registers Element Plus globally |
| `src/style.css` | Only contains `@import "tailwindcss"` |

### TailwindCSS v4

Uses `@tailwindcss/vite` plugin in `vite.config.ts`. No `tailwind.config.js` or `postcss.config.js`. Directives: `@import "tailwindcss"` in `src/style.css`.

### TypeScript

Strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch` are all enabled. Project references: `tsconfig.app.json` (src) + `tsconfig.node.json` (vite config).
