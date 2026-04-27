<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { useTodos } from './composables/useTodos'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoFilter from './components/TodoFilter.vue'
import {ref, onMounted,onUnmounted } from 'vue'

const {
  filteredTodos,
  filter,
  stats,
  toggleTodo,
  deleteTodo,
  addChildTodo,
  clearCompleted,
  setFilter,
  reorderTodos
} = useTodos()


const handleAddChild = async (parentId: number) => {
  try {
    const { value } = await ElMessageBox.prompt('输入子事项内容', '添加子事项', {
      confirmButtonText: '添加',
      cancelButtonText: '取消',
      inputPlaceholder: '子事项...'
    })
    if (value?.trim()) {
      addChildTodo(parentId, value)
    }
  } catch {
    // 用户取消
  }
}
const getCurrentTime = ()=>{
  return new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
}

var currentTime = ref(getCurrentTime())

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => { currentTime.value = getCurrentTime() }, 1000)
})
onUnmounted(() => clearInterval(timer))


</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          待办事项
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          今天是{{ currentTime }},高效管理你的每一天
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
        @add-child="handleAddChild"
        @reorder="reorderTodos"
      />
    </div>
  </div>
</template>
