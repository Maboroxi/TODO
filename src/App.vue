<script setup lang="ts">
import { useTodos } from './composables/useTodos'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoFilter from './components/TodoFilter.vue'

const {
  filteredTodos,
  filter,
  stats,
  toggleTodo,
  deleteTodo,
  updateTodo,
  clearCompleted,
  setFilter,
  reorderTodos
} = useTodos()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          待办事项
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          高效管理你的每一天
        </p>
      </header>

      <TodoInput />

      <TodoFilter
        :current-filter="filter"
        :stats="stats"
        @filter="setFilter"
        @clear-completed="clearCompleted"
      />

      <TodoList
        :todos="filteredTodos"
        @toggle="toggleTodo"
        @delete="deleteTodo"
        @update="updateTodo"
        @reorder="reorderTodos"
      />
    </div>
  </div>
</template>
