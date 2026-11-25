import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Award01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  Quiz01Icon,
  Search01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { CourseCard } from '@/components/dashboard/course-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { AppShell } from '@/components/layout/app-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSession } from '@/lib/auth'
import {
  COURSES_CHANGE_EVENT,
  PROGRESS_CHANGE_EVENT,
  computeCourseCompletion,
  getPublishedCourses,
  getStudentProgress,
  type DemoCourse,
} from '@/lib/course-store'
import type { CourseItem } from '@/types'

export const Route = createFileRoute('/student/courses/')({ component: CoursesPage })

function mapToCourseItem(studentId: string, course: DemoCourse): CourseItem {
  const completion = computeCourseCompletion(studentId, course)
  const progress = getStudentProgress(studentId)[course.id]
  const nextModule = course.modules.find(
    (m) => !progress?.completedModuleIds.includes(m.id),
  )

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

function CoursesPage() {
  const studentId = getSession()?.id ?? 'student-1'

  const [publishedCourses, setPublishedCourses] = React.useState<DemoCourse[]>(() =>
    getPublishedCourses(),
  )
  const [progressTick, setProgressTick] = React.useState(0)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedSubject, setSelectedSubject] = React.useState('Semua Topik')
  const [activeTab, setActiveTab] = React.useState('all')

  React.useEffect(() => {
    const syncCourses = () => setPublishedCourses(getPublishedCourses())
    const syncProgress = () => setProgressTick((n) => n + 1)
    window.addEventListener(COURSES_CHANGE_EVENT, syncCourses)
    window.addEventListener(PROGRESS_CHANGE_EVENT, syncProgress)
    return () => {
      window.removeEventListener(COURSES_CHANGE_EVENT, syncCourses)
      window.removeEventListener(PROGRESS_CHANGE_EVENT, syncProgress)
    }
  }, [])

  const allCoursesData = React.useMemo(
    () => publishedCourses.map((c) => mapToCourseItem(studentId, c)),
    [publishedCourses, studentId, progressTick],
  )

  const subjects = React.useMemo(() => {
    const unique = Array.from(new Set(allCoursesData.map((c) => c.subject)))
    return ['Semua Topik', ...unique]
  }, [allCoursesData])

  const filteredCourses = React.useMemo(() => {
    return allCoursesData.filter((course) => {
      if (activeTab === 'active' && course.category !== 'active') return false
      if (activeTab === 'completed' && course.category !== 'completed') return false
      if (selectedSubject !== 'Semua Topik' && course.subject !== selectedSubject) return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return (
          course.title.toLowerCase().includes(query) ||
          course.subject.toLowerCase().includes(query) ||
          course.teacher.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [allCoursesData, activeTab, selectedSubject, searchQuery])

  const activeCount = allCoursesData.filter((c) => c.category === 'active').length
  const completedCount = allCoursesData.filter((c) => c.category === 'completed').length
  const totalModules = allCoursesData.reduce((sum, c) => sum + c.totalModules, 0)
  const completedModules = allCoursesData.reduce((sum, c) => sum + c.completedModules, 0)
  const totalQuizzes = publishedCourses.reduce((sum, c) => sum + c.quizzes, 0)

  const allProgress = getStudentProgress(studentId)
  const completedQuizzes = Object.values(allProgress).reduce(
    (sum, p) => sum + Object.keys(p.quizAttempts).length,
    0,
  )

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        {/* Header & Page Title */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit gap-1 text-primary">
              <HugeiconsIcon icon={SparklesIcon} />
              Kurikulum Biologi Merdeka
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Kursus Saya
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Seluruh course yang telah diterbitkan oleh guru tampil di sini. Buka kursus untuk
              membaca materi PDF dan mengerjakan quiz.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen01Icon}
            label="Total Kursus Terbit"
            value={`${allCoursesData.length} Kursus`}
            detail={`${activeCount} berjalan · ${completedCount} selesai`}
          />
          <StatCard
            icon={CheckmarkCircle02Icon}
            label="Konten Diselesaikan"
            value={`${completedModules} Konten`}
            detail={`Dari total ${totalModules} materi & quiz`}
          />
          <StatCard
            icon={Quiz01Icon}
            label="Quiz Dikerjakan"
            value={`${completedQuizzes} / ${totalQuizzes}`}
            detail="Nilai tersimpan otomatis"
            iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={Award01Icon}
            label="Kursus Tuntas"
            value={`${completedCount} Lulus`}
            detail="Selesaikan seluruh bab & quiz"
            iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          />
        </div>

        {/* Search & Filters Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-80">
              <HugeiconsIcon
                icon={Search01Icon}
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi atau topik kursus..."
                className="pl-9 h-9 text-xs sm:text-sm bg-muted/30"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Semua ({allCoursesData.length})</TabsTrigger>
                <TabsTrigger value="active">Sedang Berjalan ({activeCount})</TabsTrigger>
                <TabsTrigger value="completed">Telah Selesai ({completedCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium mr-1">Topik:</span>
            {subjects.map((sub) => {
              const active = selectedSubject === sub
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-transparent font-medium shadow-xs'
                      : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {sub}
                </button>
              )
            })}
          </div>
        </div>

        {/* Course Cards List */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                completed={course.category === 'completed'}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <HugeiconsIcon icon={BookOpen01Icon} size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">Tidak ada kursus ditemukan</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Coba sesuaikan kata kunci pencarian atau ubah filter topik yang dipilih.
              </p>
            </div>
            {(searchQuery || selectedSubject !== 'Semua Topik' || activeTab !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSubject('Semua Topik')
                  setActiveTab('all')
                }}
              >
                Reset Semua Filter
              </Button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
