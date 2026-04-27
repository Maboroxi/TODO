import { ref, computed } from 'vue'
import type { Todo, FilterType } from '../types/todo'
import { storage } from '../utils/storage'

const todos = ref<Todo[]>(storage.get('todos', []))
const filter = ref<FilterType>('all')
const newTodoText = ref('')
const newTodoPriority = ref<'low' | 'medium' | 'high'>('medium')
const newTodoCategory = ref('')

function findNodeById(id: number, list: Todo[]): Todo | null {
  for (const todo of list) {
    if (todo.id === id) return todo
    if (todo.children?.length) {
      const found = findNodeById(id, todo.children)
      if (found) return found
    }
  }
  return null
}

function removeNodeById(id: number, list: Todo[]): Todo[] {
  return list
    .filter(t => t.id !== id)
    .map(t => ({
      ...t,
      children: t.children ? removeNodeById(id, t.children) : []
    }))
}

function updateNodeInTree(id: number, updater: (todo: Todo) => void, list: Todo[]): boolean {
  for (const todo of list) {
    if (todo.id === id) {
      updater(todo)
      return true
    }
    if (todo.children?.length && updateNodeInTree(id, updater, todo.children)) {
      return true
    }
  }
  return false
}

function toggleNodeAndChildren(id: number, checked: boolean, list: Todo[]) {
  for (const todo of list) {
    if (todo.id === id) {
      todo.completed = checked
      if (todo.children?.length) {
        toggleNodeAndChildren(id, checked, todo.children)
      }
      return
    }
    if (todo.children?.length) {
      toggleNodeAndChildren(id, checked, todo.children)
    }
  }
}

function countActiveNodes(list: Todo[]): number {
  let count = 0
  for (const todo of list) {
    if (!todo.completed) count++
    if (todo.children?.length) {
      count += countActiveNodes(todo.children)
    }
  }
  return count
}

function countCompletedNodes(list: Todo[]): number {
  let count = 0
  for (const todo of list) {
    if (todo.completed) count++
    if (todo.children?.length) {
      count += countCompletedNodes(todo.children)
    }
  }
  return count
}

function countTotalNodes(list: Todo[]): number {
  let count = 0
  for (const todo of list) {
    count++
    if (todo.children?.length) {
      count += countTotalNodes(todo.children)
    }
  }
  return count
}

function filterActiveNodes(list: Todo[]): Todo[] {
  return list
    .filter(todo => !todo.completed || (todo.children?.some(c => !c.completed)))
    .map(todo => ({
      ...todo,
      children: todo.children ? filterActiveNodes(todo.children) : []
    }))
}

function filterCompletedNodes(list: Todo[]): Todo[] {
  return list
    .filter(todo => todo.completed || (todo.children?.some(c => c.completed)))
    .map(todo => ({
      ...todo,
      children: todo.children ? filterCompletedNodes(todo.children) : []
    }))
}

const categories = computed(() => {
  const cats = new Set<string>()
  function collect(list: Todo[]) {
    for (const t of list) {
      if (t.category) cats.add(t.category)
      if (t.children?.length) collect(t.children)
    }
  }
  collect(todos.value)
  return Array.from(cats)
})

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return filterActiveNodes(todos.value)
    case 'completed':
      return filterCompletedNodes(todos.value)
    default:
      return todos.value
  }
})

const stats = computed(() => ({
  total: countTotalNodes(todos.value),
  active: countActiveNodes(todos.value),
  completed: countCompletedNodes(todos.value)
}))

function save() {
  storage.set('todos', todos.value)
}

function addTodo() {
  const text = newTodoText.value.trim()
  if (!text) return

  const todo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    priority: newTodoPriority.value,
    category: newTodoCategory.value,
    createdAt: Date.now(),
    children: []
  }

  todos.value.unshift(todo)
  newTodoText.value = ''
  newTodoCategory.value = ''
  save()
}

function addChildTodo(parentId: number, childText: string, priority: 'low' | 'medium' | 'high' = 'medium', category: string = '') {
  const parent = findNodeById(parentId, todos.value)
  if (!parent) return

  if (!parent.children) parent.children = []

  const child: Todo = {
    id: Date.now(),
    text: childText.trim(),
    completed: false,
    priority,
    category,
    createdAt: Date.now(),
    children: []
  }

  parent.children.push(child)
  save()
}

function toggleTodo(id: number) {
  const todo = findNodeById(id, todos.value)
  if (todo) {
    const newChecked = !todo.completed
    toggleNodeAndChildren(id, newChecked, todos.value)
    save()
  }
}

function deleteTodo(id: number) {
  todos.value = removeNodeById(id, todos.value)
  save()
}

function updateTodo(id: number, text: string) {
  updateNodeInTree(id, (todo) => {
    todo.text = text.trim()
  }, todos.value)
  save()
}

function clearCompleted() {
  function removeCompleted(list: Todo[]): Todo[] {
    return list
      .filter(t => !t.completed)
      .map(t => ({
        ...t,
        children: t.children ? removeCompleted(t.children) : []
      }))
  }
  todos.value = removeCompleted(todos.value)
  save()
}

function setFilter(f: FilterType) {
  filter.value = f
}

function reorderTodos(newOrder: Todo[]) {
  todos.value = newOrder
  save()
}

export function useTodos() {
  return {
    todos,
    filter,
    newTodoText,
    newTodoPriority,
    newTodoCategory,
    categories,
    filteredTodos,
    stats,
    addTodo,
    addChildTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    setFilter,
    reorderTodos
  }
}
