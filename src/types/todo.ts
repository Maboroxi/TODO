export interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
