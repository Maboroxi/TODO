# Backend 实现方案: JSON 文件持久化

## 概述

将当前前端 `localStorage` 持久化替换为 FastAPI 后端 + JSON 文件存储。前端保留所有业务逻辑（树的增删改查、过滤、排序），后端仅作为持久层。

## 技术栈

| 项目 | 选择 | 说明 |
|------|------|------|
| Web 框架 | FastAPI | 轻量、高性能、自动 OpenAPI 文档 |
| ASGI 服务器 | uvicorn | FastAPI 默认推荐 |
| 存储 | JSON 文件 | 单用户场景，零依赖，数据可读可编辑 |
| 前端 HTTP | 原生 fetch | 无额外依赖 |

## 目录结构

```
project3/
├── src/                        # 前端（已有）
│   ├── composables/useTodos.ts # 改为异步 save/load
│   ├── utils/
│   │   ├── storage.ts          # 删除
│   │   └── api.ts              # 新增：HTTP 请求层
│   └── App.vue                 # onMounted 时加载数据
│
├── backend/                    # 新增：后端
│   ├── requirements.txt        # Python 依赖
│   ├── main.py                 # FastAPI 应用 + 路由
│   └── data/
│       └── todos.json          # 运行时自动创建
│
└── vite.config.ts              # 添加开发代理
```

## 后端设计

### 依赖 (`backend/requirements.txt`)

```
fastapi>=0.115.0
uvicorn[standard]>=0.34.0
```

### 路由 (`backend/main.py`)

| 方法 | 路径 | 请求体 | 响应 | 说明 |
|------|------|--------|------|------|
| `GET` | `/api/todos` | — | `Todo[]` | 读取完整 Todo 树 |
| `PUT` | `/api/todos` | `Todo[]` | `{"ok": true}` | 覆盖存储完整 Todo 树 |

选择 GET/PUT 二端点的原因：前端 composable 已完整实现所有树操作逻辑（递归增删改查、过滤、排序），后端只做持久化，改动最小。

### 数据格式

`data/todos.json` 内容即 `Todo[]` 数组，与前端的类型定义完全对等：

```json
[
  {
    "id": 1714233600000,
    "text": "示例待办",
    "completed": false,
    "priority": "medium",
    "category": "工作",
    "createdAt": 1714233600000,
    "children": [
      {
        "id": 1714233700000,
        "text": "子事项",
        "completed": false,
        "priority": "high",
        "category": "",
        "createdAt": 1714233700000,
        "children": []
      }
    ]
  }
]
```

### 错误处理

- JSON 文件不存在 → 返回空数组 `[]`
- JSON 解析失败 → 返回 500，记录日志
- 文件写入失败 → 返回 500，记录日志

### CORS 配置

开发环境允许所有来源（生产环境应收紧）：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

或者通过 Vite 代理避免跨域（见下方 Vite 配置章）。

## 前端改动

### 1. 新增 `src/utils/api.ts`（替代 `storage.ts`）

```typescript
import type { Todo } from '../types/todo'

const BASE_URL = '/api' // Vite 代理到后端

export const api = {
  async getTodos(): Promise<Todo[]> {
    const res = await fetch(`${BASE_URL}/todos`)
    if (!res.ok) throw new Error(`GET /todos failed: ${res.status}`)
    return res.json()
  },

  async putTodos(todos: Todo[]): Promise<void> {
    const res = await fetch(`${BASE_URL}/todos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todos)
    })
    if (!res.ok) throw new Error(`PUT /todos failed: ${res.status}`)
  }
}
```

### 2. 修改 `src/composables/useTodos.ts`

改动点：

- 移除 `import { storage } from '../utils/storage'`
- 新增 `import { api } from '../utils/api'`
- `todos` 初始化为空数组：`const todos = ref<Todo[]>([])`
- `save()` 改为异步：

```typescript
async function save() {
  try {
    await api.putTodos(todos.value)
  } catch (e) {
    console.error('保存失败', e)
  }
}
```

- 新增 `loadTodos()`：

```typescript
async function loadTodos() {
  try {
    todos.value = await api.getTodos()
  } catch (e) {
    console.error('加载失败', e)
  }
}
```

- 在导出的返回值中新增 `loadTodos`

> **重要**：所有调用 `save()` 的函数（`addTodo`、`addChildTodo`、`toggleTodo`、`deleteTodo`、`updateTodo`、`clearCompleted`、`reorderTodos`）保持不变，因为它们已经在调用 `save()`。只需确保 `save()` 现在是 async 的，而它们不需要 await save（fire-and-forget 模式即可，因为失败时已 console.error）。

### 3. 修改 `src/App.vue`

```typescript
import { onMounted, ref } from 'vue'

const { ..., loadTodos } = useTodos()

const loading = ref(true)

onMounted(async () => {
  await loadTodos()
  loading.value = false
})
```

模板加入 loading 状态：

```html
<div v-if="loading" class="text-center py-12 text-gray-400">
  加载中...
</div>
<div v-else>
  <!-- 原有内容 -->
</div>
```

### 4. 修改 `vite.config.ts`

添加开发代理，将 `/api` 请求转发到 FastAPI：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

使用 Vite 代理的好处：
- 前端请求 `/api/todos`，无需写完整 URL
- 开发和生产同一路径，无需环境变量
- 自动处理 CORS，不依赖后端 CORS 中间件

### 5. 删除 `src/utils/storage.ts`

该文件不再需要。

## 文件变更清单

| 文件 | 操作 |
|------|------|
| `backend/requirements.txt` | 新建 |
| `backend/main.py` | 新建 |
| `backend/data/todos.json` | 运行时自动创建，无需手动创建 |
| `src/utils/api.ts` | 新建 |
| `src/utils/storage.ts` | 删除 |
| `src/composables/useTodos.ts` | 修改：初始化、save、新增 loadTodos |
| `src/App.vue` | 修改：onMounted 加载、loading 态 |
| `vite.config.ts` | 修改：添加 server.proxy |

## 启动流程

```bash
# 1. 安装后端依赖
cd backend
pip install -r requirements.txt

# 2. 启动后端（终端 1）
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 3. 启动前端（终端 2）
npm run dev

# 4. 访问 http://localhost:5173
```

后端 API 文档自动生成在 `http://localhost:8000/docs`（Swagger UI）。

## 注意事项

1. **并发安全**：当前设计不考虑并发写入安全。JSON 文件读写是原子的吗？不是。但对于单用户本地使用场景，用户只有一个人操作一个浏览器，不存在竞态条件。

2. **数据丢失风险**：每次 PUT 会覆盖整个文件。如果写入过程中崩溃，可能丢失数据。后续可考虑先写临时文件再 rename 的原子写入策略。

3. **构建产物**：`backend/data/` 目录包含运行时数据，应加入 `.gitignore` 或忽略 `*.json`。

4. **网络错误处理**：前端 catch 了所有错误并打印日志，但不会向用户展示。可后续添加 ElMessage 错误提示。

5. **离线使用**：一旦改为后端存储，离线时将无法加载/保存数据。可考虑保留 localStorage 作为 fallback 缓存。

## 后续扩展方向

- **原子写入**：先写 `.tmp` 文件，再 `os.replace` 到目标文件
- **备份**：定期复制 `todos.json` 为 `todos.backup.json`
- **导入导出**：提供 API 下载/上传 JSON 文件
- **多用户**：按用户 ID 分文件（`data/{user_id}/todos.json`）
- **SQLite 迁移**：数据量大时切换到 SQLite + 邻接表或物化路径
