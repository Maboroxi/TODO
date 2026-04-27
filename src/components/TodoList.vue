<script setup lang="ts">
import type { Todo } from '../types/todo'

const props = defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  addChild: [parentId: number]
  reorder: [todos: Todo[]]
}>()

const treeProps = {
  children: 'children',
  label: 'text'
}

const handleCheckChange = (data: Todo) => {
  emit('toggle', data.id)
}

const handleNodeDrop = () => {
  emit('reorder', props.todos)
}

const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
}

const priorityLabels: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高'
}
</script>

<template>
  <div v-if="todos.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-500">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <p>暂无待办事项</p>
    <p class="text-sm">添加一个新的待办事项开始吧！</p>
  </div>

  <el-tree
    v-else
    ref="treeRef"
    :data="todos"
    :props="treeProps"
    node-key="id"
    show-checkbox
    draggable
    default-expand-all
    :expand-on-click-node="false"
    @check-change="handleCheckChange"
    @node-drop="handleNodeDrop"
    class="todo-tree"
  >
    <template #default="{ node, data }">
      <div class="flex items-center justify-between w-full pr-2 group">
        <div class="flex items-center gap-2">
          <span :class="{ 'line-through text-gray-400': data.completed }" class="text-gray-800 dark:text-gray-200">
            {{ node.label }}
          </span>
          <span
            v-if="data.category"
            class="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full"
          >
            {{ data.category }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <span :class="priorityColors[data.priority]" class="px-2 py-0.5 text-xs rounded-full">
            {{ priorityLabels[data.priority] }}
          </span>
          <button
            @click.stop="emit('addChild', data.id)"
            class="text-blue-500 hover:text-blue-600 text-sm px-1"
          >
            添加子项
          </button>
          <button
            @click.stop="emit('delete', data.id)"
            class="text-red-500 hover:text-red-600 text-sm px-1"
          >
            删除
          </button>
        </div>
      </div>
    </template>
  </el-tree>
</template>


<style>
.todo-tree {
  --el-color-primary: #7c3aed;
  --el-color-primary-light-3: #a78bfa;
  --el-color-primary-light-5: #c4b5fd;
  --el-color-primary-light-7: #ddd6fe;
  --el-color-primary-light-8: #ede9fe;
  --el-color-primary-light-9: #f5f3ff;
  --el-fill-color-blank: transparent;
  --el-bg-color: transparent;
  --el-tree-node-hover-bg-color: rgba(124, 58, 237, 0.08);
  --el-text-color-regular: #1f2937;
  --el-border-color-lighter: transparent;
}

.dark .todo-tree {
  --el-color-primary: #a78bfa;
  --el-color-primary-light-3: #7c3aed;
  --el-color-primary-light-5: #6d28d9;
  --el-color-primary-light-7: #5b21b6;
  --el-color-primary-light-8: #4c1d95;
  --el-color-primary-light-9: #3b0764;
  --el-tree-node-hover-bg-color: rgba(167, 139, 250, 0.12);
  --el-text-color-regular: #e5e7eb;
}
</style>