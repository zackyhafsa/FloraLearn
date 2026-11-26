import type { CourseItem } from '@/types'

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export type DemoModule = {
  id: string
  title: string
  duration: string
  status: 'done' | 'active' | 'locked'
  content: string
  description?: string
  chapter?: string
  type?: 'material' | 'quiz'
  pdfId?: string
  pdfName?: string
  pdfSize?: number
  questions?: QuizQuestion[]
}

export type DemoCourse = {
  id: string
  title: string
  subject: string
  teacher: string
  description: string
  modules: DemoModule[]
  quizzes: number
  students: number
  status: 'Terbit' | 'Draft'
  updatedAt?: string
}

export type QuizAttempt = {
  moduleId: string
  courseId: string
  score: number
  correctCount: number
  totalQuestions: number
  answers: Record<string, number>
  submittedAt: string
}

export type StudentCourseProgress = {
  completedModuleIds: string[]
  quizAttempts: Record<string, QuizAttempt>
}

export type AddModuleInput = {
  title: string
  description: string
  content: string
  duration: string
  chapter: string
  type: 'material' | 'quiz'
  pdfId?: string
  pdfName?: string
  pdfSize?: number
  questions?: QuizQuestion[]
}

const COURSES_KEY = 'ekostream_courses'
const PROGRESS_KEY = 'ekostream_student_progress'

export const COURSES_CHANGE_EVENT = 'ekostream-courses-change'
export const PROGRESS_CHANGE_EVENT = 'ekostream-progress-change'

const seed: DemoCourse[] = [
  {
    id: 'biodiversity',
    title: 'Keanekaragaman Hayati',
    subject: 'Biologi Kelas 10',
    teacher: 'Pak Budi Santoso, M.Pd.',
    description:
      'Mempelajari keanekaragaman hayati tingkat gen, jenis, dan ekosistem di Indonesia serta upaya pelestarian flora endemik Nusantara.',
    quizzes: 1,
    students: 28,
    status: 'Terbit',
    updatedAt: 'Hari ini',
    modules: [
      {
        id: 'intro',
        chapter: 'Bab 1',
        type: 'material',
        title: 'Pengantar Keanekaragaman Hayati',
        duration: '12 menit',
        status: 'done',
        description:
          'Pengenalan konsep dasar keanekaragaman hayati dan pentingnya menjaga keseimbangan ekosistem tropis.',
        content:
          'Keanekaragaman hayati (biodiversitas) mencakup seluruh variasi bentuk kehidupan di bumi, mulai dari variasi genetik dalam satu spesies hingga keberagaman bioma di seluruh dunia.\n\nIndonesia dikenal sebagai negara megabiodiversitas karena terletak di garis khatulistiwa dengan iklim tropis lembap yang mendukung pertumbuhan ribuan spesies flora dan fauna endemik.',
      },
      {
        id: 'levels',
        chapter: 'Bab 2',
        type: 'material',
        title: 'Tingkat Keanekaragaman Hayati',
        duration: '18 menit',
        status: 'active',
        description:
          'Memahami perbedaan keanekaragaman tingkat gen, jenis (spesies), dan ekosistem beserta contoh tumbuhan lokal.',
        content:
          'Keanekaragaman hayati dikelompokkan menjadi tiga tingkatan utama:\n\n1. Tingkat Gen: Variasi susunan gen dalam satu spesies yang sama (contoh: varietas mangga arumanis, manalagi, dan golek pada Mangifera indica).\n2. Tingkat Jenis (Spesies): Perbedaan ciri morfologi antarspesies dalam satu famili (contoh: kelapa, aren, dan palem dalam famili Arecaceae).\n3. Tingkat Ekosistem: Interaksi komunitas biotik dengan lingkungan abiotik yang khas (hutan hujan tropis, mangrove, sabana).',
      },
      {
        id: 'quiz-bab-1',
        chapter: 'Evaluasi Bab 1–2',
        type: 'quiz',
        title: 'Quiz Pemahaman Keanekaragaman Hayati',
        duration: '10 menit',
        status: 'active',
        description:
          'Jawablah pertanyaan pilihan ganda berikut untuk menguji pemahamanmu tentang tingkat keanekaragaman hayati.',
        content: 'Evaluasi pemahaman konsep dasar dan tingkatan keanekaragaman hayati.',
        questions: [
          {
            id: 'q-bio-1',
            question: 'Manakah contoh yang tepat untuk keanekaragaman tingkat gen?',
            options: [
              'Variasi warna bunga mawar merah, mawar putih, dan mawar kuning (Rosa sp.).',
              'Perbedaan antara pohon kelapa (Cocos nucifera) dan pohon aren (Arenga pinnata).',
              'Perbedaan antara hutan mangrove di pesisir dan hutan sabana di Nusa Tenggara.',
              'Perbedaan tumbuhan paku (Pteridophyta) dan tumbuhan lumut (Bryophyta).',
            ],
            correctIndex: 0,
            explanation:
              'Warna bunga yang berbeda dalam satu spesies mawar (Rosa sp.) diakibatkan oleh variasi susunan alel pada tingkat gen.',
          },
          {
            id: 'q-bio-2',
            question:
              'Hutan bakau (mangrove) di pesisir pantai dan ekosistem padang rumput sabana merupakan contoh keanekaragaman hayati tingkat...',
            options: ['Gen', 'Populasi', 'Jenis (Spesies)', 'Ekosistem'],
            correctIndex: 3,
            explanation:
              'Perbedaan kondisi abiotik (salinitas, tanah, curah hujan) dan komunitas organisme yang berinteraksi membentuk variasi tingkat ekosistem.',
          },
        ],
      },
    ],
  },
  {
    id: 'ecology',
    title: 'Ekologi & Ekosistem Tropis',
    subject: 'Biologi Kelas 10',
    teacher: 'Pak Budi Santoso, M.Pd.',
    description:
      'Memahami jaring makanan, interaksi simbiosis tumbuhan, dan siklus biogeokimia di ekosistem hutan hujan tropis.',
    quizzes: 0,
    students: 24,
    status: 'Terbit',
    updatedAt: 'Kemarin',
    modules: [
      {
        id: 'food-web',
        chapter: 'Bab 1',
        type: 'material',
        title: 'Jaring Makanan & Aliran Energi',
        duration: '15 menit',
        status: 'active',
        description: 'Peran produsen primer (tumbuhan hijau) dalam rantai makanan ekosistem darat.',
        content:
          'Tumbuhan berklorofil berperan sebagai produsen primer yang mengubah energi cahaya matahari menjadi energi kimia melalui fotosintesis. Energi ini kemudian mengalir ke konsumen tingkat I, II, hingga dekomposer.',
      },
    ],
  },
]

function dispatchCourseChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(COURSES_CHANGE_EVENT))
  }
}

function dispatchProgressChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROGRESS_CHANGE_EVENT))
  }
}

function recountQuizzes(course: DemoCourse): DemoCourse {
  return {
    ...course,
    quizzes: course.modules.filter((m) => m.type === 'quiz').length,
  }
}

export function getCourses(): DemoCourse[] {
  if (typeof window === 'undefined') return seed
  const raw = localStorage.getItem(COURSES_KEY)
  if (!raw) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(seed))
    return seed
  }
  try {
    const parsed = JSON.parse(raw) as DemoCourse[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seed
    }
    return parsed.map(recountQuizzes)
  } catch {
    return seed
  }
}

export function getPublishedCourses(): DemoCourse[] {
  return getCourses().filter((course) => course.status === 'Terbit')
}

export function getCourseById(courseId: string): DemoCourse | undefined {
  return getCourses().find((course) => course.id === courseId)
}

export function saveCourses(courses: DemoCourse[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses.map(recountQuizzes)))
  dispatchCourseChange()
}

export function createCourse(input: {
  title: string
  subject: string
  description: string
  teacher?: string
  status?: 'Terbit' | 'Draft'
}): DemoCourse {
  const courses = getCourses()
  const slugBase = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const id = `${slugBase || 'course'}-${crypto.randomUUID().slice(0, 6)}`
  const newCourse: DemoCourse = {
    id,
    title: input.title.trim(),
    subject: input.subject.trim() || 'Biologi Kelas 10',
    teacher: input.teacher?.trim() || 'Pak Budi Santoso, M.Pd.',
    description: input.description.trim(),
    modules: [],
    quizzes: 0,
    students: 0,
    status: input.status ?? 'Terbit',
    updatedAt: 'Baru saja',
  }
  saveCourses([newCourse, ...courses])
  return newCourse
}

export function updateCourse(courseId: string, patch: Partial<Omit<DemoCourse, 'id'>>) {
  const courses = getCourses()
  const updated = courses.map((course) =>
    course.id === courseId
      ? recountQuizzes({ ...course, ...patch, updatedAt: 'Baru saja' })
      : course,
  )
  saveCourses(updated)
}

export function deleteCourse(courseId: string) {
  const courses = getCourses()
  saveCourses(courses.filter((course) => course.id !== courseId))
}

export function addModule(courseId: string, input: AddModuleInput): DemoModule | undefined {
  const courses = getCourses()
  const course = courses.find((item) => item.id === courseId)
  if (!course) return undefined

  const created: DemoModule = {
    id: `mod-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
    status: 'active',
  }
  course.modules.push(created)
  course.updatedAt = 'Baru saja'
  if (input.type === 'quiz') {
    course.quizzes = course.modules.filter((m) => m.type === 'quiz').length
  }
  saveCourses(courses)
  return created
}

export function updateModule(
  courseId: string,
  moduleId: string,
  patch: Partial<Omit<DemoModule, 'id'>>,
) {
  const courses = getCourses()
  const updated = courses.map((course) => {
    if (course.id !== courseId) return course
    const modules = course.modules.map((mod) =>
      mod.id === moduleId ? { ...mod, ...patch } : mod,
    )
    return recountQuizzes({ ...course, modules, updatedAt: 'Baru saja' })
  })
  saveCourses(updated)
}

export function deleteModule(courseId: string, moduleId: string) {
  const courses = getCourses()
  const updated = courses.map((course) => {
    if (course.id !== courseId) return course
    const modules = course.modules.filter((mod) => mod.id !== moduleId)
    return recountQuizzes({ ...course, modules, updatedAt: 'Baru saja' })
  })
  saveCourses(updated)
}

export function addQuiz(courseId: string) {
  return addModule(courseId, {
    title: 'Quiz Evaluasi Baru',
    description: 'Jawab pertanyaan evaluasi berikut dengan teliti.',
    content: 'Evaluasi pemahaman materi.',
    duration: '10 menit',
    chapter: 'Evaluasi',
    type: 'quiz',
    questions: [
      {
        id: `q-${crypto.randomUUID().slice(0, 6)}`,
        question: 'Contoh pertanyaan evaluasi botani — silakan edit pertanyaan ini.',
        options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
        correctIndex: 0,
        explanation: 'Penjelasan jawaban benar.',
      },
    ],
  })
}

// ─── Student Progress & Quiz Results ─────────────────────────────────────────

type AllProgressStore = Record<string, Record<string, StudentCourseProgress>>

function readAllProgress(): AllProgressStore {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(PROGRESS_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as AllProgressStore
  } catch {
    return {}
  }
}

function writeAllProgress(store: AllProgressStore) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store))
  dispatchProgressChange()
}

export function getStudentProgress(userId: string): Record<string, StudentCourseProgress> {
  const store = readAllProgress()
  return store[userId] ?? {}
}

export function getCourseProgress(userId: string, courseId: string): StudentCourseProgress {
  const userProgress = getStudentProgress(userId)
  return userProgress[courseId] ?? { completedModuleIds: [], quizAttempts: {} }
}

export function markModuleCompleted(userId: string, courseId: string, moduleId: string) {
  const store = readAllProgress()
  const userProgress = store[userId] ?? {}
  const courseProgress = userProgress[courseId] ?? { completedModuleIds: [], quizAttempts: {} }

  if (!courseProgress.completedModuleIds.includes(moduleId)) {
    courseProgress.completedModuleIds = [...courseProgress.completedModuleIds, moduleId]
  }

  userProgress[courseId] = courseProgress
  store[userId] = userProgress
  writeAllProgress(store)
}

export function saveQuizAttempt(userId: string, attempt: QuizAttempt) {
  const store = readAllProgress()
  const userProgress = store[userId] ?? {}
  const courseProgress = userProgress[attempt.courseId] ?? {
    completedModuleIds: [],
    quizAttempts: {},
  }

  courseProgress.quizAttempts = {
    ...courseProgress.quizAttempts,
    [attempt.moduleId]: attempt,
  }

  if (!courseProgress.completedModuleIds.includes(attempt.moduleId)) {
    courseProgress.completedModuleIds = [...courseProgress.completedModuleIds, attempt.moduleId]
  }

  userProgress[attempt.courseId] = courseProgress
  store[userId] = userProgress
  writeAllProgress(store)
}

export function computeCourseCompletion(
  userId: string,
  course: DemoCourse,
): { completed: number; total: number; percent: number } {
  const total = course.modules.length
  if (total === 0) return { completed: 0, total: 0, percent: 0 }

  const progress = getCourseProgress(userId, course.id)
  const validModuleIds = new Set(course.modules.map((m) => m.id))
  const completed = progress.completedModuleIds.filter((id) => validModuleIds.has(id)).length
  const percent = Math.round((completed / total) * 100)
  return { completed, total, percent }
}

/** Mengonversi data DemoCourse menjadi tampilan kartu CourseItem siswa beserta progresnya. */
export function mapCourseToStudentItem(studentId: string, course: DemoCourse): CourseItem {
  const completion = computeCourseCompletion(studentId, course)
  const progress = getCourseProgress(studentId, course.id)
  const nextModule = course.modules.find((m) => !progress.completedModuleIds.includes(m.id))

  return {
    id: course.id,
    title: course.title,
    subject: course.subject,
    teacher: course.teacher,
    description: course.description,
    progress: completion.percent,
    totalModules: completion.total,
    completedModules: completion.completed,
    remainingTime:
      completion.total === 0
        ? 'Belum ada materi'
        : completion.percent === 100
          ? 'Telah tuntas'
          : `${completion.total - completion.completed} konten tersisa`,
    currentTopic: nextModule?.title ?? course.modules[0]?.title ?? 'Belum ada materi',
    lastAccessed: course.updatedAt ?? 'Baru diterbitkan',
    category: completion.total > 0 && completion.percent === 100 ? 'completed' : 'active',
  }
}
