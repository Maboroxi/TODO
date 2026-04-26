<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { Todo } from '../types/todo'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  update: [id: number, text: string]
  reorder: [todos: Todo[]]
}>()
</script>

<template>
  <VueDraggable
    v-model="props.todos"
    @end="emit('reorder', props.todos)"
    :animation="200"
    ghost-class="opacity-50"
    handle=".drag-handle"
    class="space-y-2"
  >
    <TodoItem
      v-for="todo in props.todos"
      :key="todo.id"
      :todo="todo"
      @toggle="emit('toggle', $event)"
      @delete="emit('delete', $event)"
      @update="(id: number, text: string) => emit('update', id, text)"
    />
  </VueDraggable>
  <div
    v-if="props.todos.length === 0"
    class="text-center py-12 text-gray-400 dark:text-gray-500"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <p>暂无待办事项</p>
    <p class="text-sm">添加一个新的待办事项开始吧！</p>
  </div>
</template>
