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

export interface ObservationItem {
  id?: string
  name: string
  scientificName: string
  status: 'Terverifikasi' | 'Menunggu Review'
  date: string
  location: string
  icon: string
  notes?: string
  habitType?: string
}

export interface TaskItem {
  id: string
  title: string
  course: string
  deadline: string
  urgency: 'urgent' | 'normal'
  badgeLabel: string
}

export interface TeacherPendingReview {
  id: string
  studentName: string
  studentClass: string
  plantName: string
  scientificName: string
  location: string
  habitType: string
  notes: string
  icon: string
  submittedAt: string
  status: 'Menunggu Review' | 'Terverifikasi' | 'Perlu Revisi'
  score?: number
  feedback?: string
}

export interface TeacherAssignment {
  id: string
  title: string
  course: string
  deadline: string
  submittedCount: number
  totalStudents: number
  status: 'active' | 'grading' | 'closed'
}

export interface TeacherClassSummary {
  id: string
  name: string
  academicYear: string
  studentCount: number
  activeCount: number
  averageScore: number
  specimensFound: number
  taskCompletionRate: number
  topTaxon: string
}

export interface TeacherScheduleItem {
  id: string
  time: string
  title: string
  className: string
  location: string
  type: 'Teori' | 'Praktikum' | 'Konsultasi'
  status: 'selesai' | 'berlangsung' | 'akan_datang'
}

export interface PopularSpeciesItem {
  id: string
  name: string
  scientificName: string
  family: string
  observationCount: number
  icon: string
  percentage: number
}

export interface NavItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  to?: string
  params?: Record<string, string>
}
