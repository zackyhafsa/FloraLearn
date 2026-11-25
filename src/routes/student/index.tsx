import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Award01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { CourseCard } from '@/components/dashboard/course-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { AppShell } from '@/components/layout/app-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

export const Route = createFileRoute('/student/')({ component: StudentDashboard })

function toCourseItem(studentId: string, course: DemoCourse): CourseItem {
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

function StudentDashboard() {
  const session = getSession()
  const studentId = session?.id ?? 'student-1'
  const firstName = session?.name.split(' ')[0] ?? 'Dika'

  const [publishedCourses, setPublishedCourses] = React.useState<DemoCourse[]>(() =>
    getPublishedCourses(),
  )
  const [progressTick, setProgressTick] = React.useState(0)

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

  const mappedCourses = React.useMemo(
    () => publishedCourses.map((c) => toCourseItem(studentId, c)),
    [publishedCourses, studentId, progressTick],
  )

  const activeCourses = mappedCourses.filter((c) => c.category === 'active')
  const completedCourses = mappedCourses.filter((c) => c.category === 'completed')
  const totalModules = mappedCourses.reduce((sum, c) => sum + c.totalModules, 0)
  const completedModules = mappedCourses.reduce((sum, c) => sum + c.completedModules, 0)
  const avgProgress =
    mappedCourses.length > 0
      ? Math.round(mappedCourses.reduce((sum, c) => sum + c.progress, 0) / mappedCourses.length)
      : 0

  const primaryCourse = activeCourses[0] ?? mappedCourses[0]

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        {/* Greeting */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit gap-1 text-primary">
              <HugeiconsIcon icon={SparklesIcon} />
              Portal Pembelajaran
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Selamat pagi, {firstName}!
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Pelajari modul PDF dari guru dan kerjakan quiz evaluasi pada setiap kursus aktifmu.
            </p>
          </div>

          {primaryCourse && (
            <Link to="/student/courses/$courseId" params={{ courseId: primaryCourse.id }}>
              <Button className="gap-2 shadow-xs">
                <HugeiconsIcon icon={BookOpen01Icon} data-icon="inline-start" />
                Lanjutkan Belajar
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={BookOpen01Icon}
            label="Kursus Tersedia"
            value={`${mappedCourses.length} Kursus`}
            detail={`${activeCourses.length} berjalan · ${completedCourses.length} selesai`}
          />
          <StatCard
            icon={CheckmarkCircle02Icon}
            label="Konten Selesai"
            value={`${completedModules} Konten`}
            detail={`Dari total ${totalModules} materi & quiz`}
          />
          <StatCard
            icon={Award01Icon}
            label="Progress Belajar"
            value={`${avgProgress}%`}
            detail="Rata-rata seluruh kursus"
          />
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="flex flex-col gap-6 xl:col-span-2">
            <Tabs defaultValue="in-progress" className="w-full">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Materi Pembelajaran</h2>
                  <p className="text-xs text-muted-foreground">
                    Daftar kursus terbit dari guru yang siap dipelajari
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="in-progress">
                    Sedang Berjalan ({activeCourses.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Telah Selesai ({completedCourses.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="in-progress" className="mt-4 flex flex-col gap-4">
                {activeCourses.length > 0 ? (
                  activeCourses.map((course) => <CourseCard key={course.id} course={course} />)
                ) : (
                  <p className="text-sm text-muted-foreground py-6 text-center rounded-2xl border border-dashed">
                    Semua kursus sudah selesai atau belum ada kursus aktif yang diterbitkan guru.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-4 flex flex-col gap-4">
                {completedCourses.length > 0 ? (
                  completedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} completed />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-6 text-center rounded-2xl border border-dashed">
                    Belum ada kursus yang dituntaskan 100%.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-col gap-4 xl:col-span-1">
            <StatCard
              icon={BookOpen01Icon}
              label="Materi Berikutnya"
              value={primaryCourse?.currentTopic ?? 'Belum ada'}
              detail={primaryCourse ? `Course: ${primaryCourse.title}` : 'Menunggu guru'}
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
