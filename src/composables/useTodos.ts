import { ref, computed } from 'vue'
import type { Todo, FilterType } from '../types/todo'
import { storage } from '../utils/storage'

const todos = ref<Todo[]>(storage.get('todos', []))
const filter = ref<FilterType>('all')
const newTodoText = ref('')
const newTodoPriority = ref<'low' | 'medium' | 'high'>('medium')
const newTodoCategory = ref('')

const categories = computed(() => {
  const cats = new Set(todos.value.map(t => t.category).filter(Boolean))
  return Array.from(cats)
})

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(t => !t.completed)
    case 'completed':
      return todos.value.filter(t => t.completed)
    default:
      return todos.value
  }
})

const stats = computed(() => ({
  total: todos.value.length,
  active: todos.value.filter(t => !t.completed).length,
  completed: todos.value.filter(t => t.completed).length
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
    createdAt: Date.now()
  }

  todos.value.unshift(todo)
  newTodoText.value = ''
  newTodoCategory.value = ''
  save()
}

function toggleTodo(id: number) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    save()
  }
}

function deleteTodo(id: number) {
  todos.value = todos.value.filter(t => t.id !== id)
  save()
}

function updateTodo(id: number, text: string) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.text = text.trim()
    save()
  }
}

function clearCompleted() {
  todos.value = todos.value.filter(t => !t.completed)
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
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    setFilter,
    reorderTodos
  }
}
