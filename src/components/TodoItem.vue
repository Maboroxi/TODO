<script setup lang="ts">
import { ref } from 'vue'
import type { Todo } from '../types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  update: [id: number, text: string]
}>()

const isEditing = ref(false)
const editText = ref(props.todo.text)

const startEdit = () => {
  isEditing.value = true
  editText.value = props.todo.text
}

const saveEdit = () => {
  if (editText.value.trim()) {
    emit('update', props.todo.id, editText.value)
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = props.todo.text
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
}

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高'
}
</script>

<template>
  <div
    class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all group cursor-move"
    :class="{ 'opacity-60': todo.completed }"
  >
    <span class="drag-handle text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    </span>

    <input
      type="checkbox"
      :checked="todo.completed"
      @change="emit('toggle', todo.id)"
      class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
    />

    <div class="flex-1 min-w-0">
      <input
        v-if="isEditing"
        v-model="editText"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
        @blur="saveEdit"
        type="text"
        class="w-full px-2 py-1 border border-purple-500 rounded focus:outline-none bg-gray-50 dark:bg-gray-700 dark:text-white"
        autofocus
      />
      <div
        v-else
        @dblclick="startEdit"
        class="cursor-text"
      >
        <span
          :class="{ 'line-through text-gray-400': todo.completed }"
          class="text-gray-800 dark:text-gray-200"
        >
          {{ todo.text }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <span
        v-if="todo.category"
        class="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full"
      >
        {{ todo.category }}
      </span>
      <span
        :class="priorityColors[todo.priority]"
        class="px-2 py-1 text-xs rounded-full"
      >
        {{ priorityLabels[todo.priority] }}
      </span>
      <button
        @click="emit('delete', todo.id)"
        class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>
