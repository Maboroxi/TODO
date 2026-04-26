<script setup lang="ts">
import type { FilterType } from '../types/todo'

defineProps<{
  currentFilter: FilterType
  stats: {
    total: number
    active: number
    completed: number
  }
}>()

const emit = defineEmits<{
  filter: [f: FilterType]
  clearCompleted: []
}>()

const filters: { label: string; value: FilterType }[] = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'completed' }
]
</script>

<template>
  <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
    <div class="flex gap-2">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="emit('filter', f.value)"
        :class="{
          'bg-purple-600 text-white': currentFilter === f.value,
          'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600': currentFilter !== f.value
        }"
        class="px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        {{ f.label }}
        <span class="ml-1 text-xs opacity-75">
          ({{ f.value === 'all' ? stats.total : f.value === 'active' ? stats.active : stats.completed }})
        </span>
      </button>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        剩余 {{ stats.active }} 项
      </span>
      <button
        v-if="stats.completed > 0"
        @click="emit('clearCompleted')"
        class="text-sm text-red-500 hover:text-red-600 transition-colors"
      >
        清空已完成
      </button>
    </div>
  </div>
</template>
