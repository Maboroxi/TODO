<script setup lang="ts">
import { useTodos } from '../composables/useTodos'

const {
  newTodoText,
  newTodoPriority,
  newTodoCategory,
  categories,
  addTodo
} = useTodos()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') addTodo()
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
    <div class="flex gap-2 flex-wrap">
      <input
        v-model="newTodoText"
        @keydown="handleKeydown"
        type="text"
        placeholder="添加新的待办事项..."
        class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
      />
      <select
        v-model="newTodoPriority"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
      >
        <option value="low">低优先级</option>
        <option value="medium">中优先级</option>
        <option value="high">高优先级</option>
      </select>
      <input
        v-model="newTodoCategory"
        type="text"
        placeholder="分类"
        :list="categories.length > 0 ? 'categories-list' : undefined"
        class="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
      />
      <button
        @click="addTodo"
        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        添加
      </button>
    </div>
    <datalist id="categories-list">
      <option v-for="cat in categories" :key="cat" :value="cat" />
    </datalist>
  </div>
</template>
