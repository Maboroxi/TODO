export interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  createdAt: number
  children?: Todo[]
}

export type FilterType = 'all' | 'active' | 'completed'
