const STORAGE_KEY = 'vue-todo-app'

export const storage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`${STORAGE_KEY}:${key}`)
      return item ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(value))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
  },
  clear: (): void => {
    localStorage.clear()
  }
}
