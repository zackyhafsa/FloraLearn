export interface CourseItem {
  id: string
  title: string
  subject: string
  teacher: string
  description: string
  progress: number
  totalModules: number
  completedModules: number
  remainingTime: string
  currentTopic: string
  lastAccessed: string
  category: 'active' | 'completed'
}

export interface ModuleItem {
  id: string
  title: string
  duration: string
  status: 'done' | 'active' | 'locked'
}
