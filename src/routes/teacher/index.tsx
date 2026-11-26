import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Add01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Quiz01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { AppShell } from '@/components/layout/app-header'
import { StatCard } from '@/components/shared/stat-card'
import { CreateCourseDialog } from '@/components/teacher/create-course-dialog'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCourses, useStudentProgress } from '@/hooks/use-course-store'
import { useUsers } from '@/hooks/use-user-store'
import { getSession } from '@/lib/auth'
import { computeCourseCompletion } from '@/lib/course-store'

export const Route = createFileRoute('/teacher/')({ component: TeacherDashboard })

function TeacherDashboard() {
  const courses = useCourses()
  const users = useUsers()
  const session = getSession()
  const studentProgress = useStudentProgress('student-1')
  const [createOpen, setCreateOpen] = React.useState(false)

  const publishedCount = courses.filter((c) => c.status === 'Terbit').length
  const totalMaterials = courses.reduce(
    (sum, c) => sum + c.modules.filter((m) => m.type !== 'quiz').length,
    0,
  )
  const totalQuizzes = courses.reduce(
    (sum, c) => sum + c.modules.filter((m) => m.type === 'quiz').length,
    0,
  )

  const recentQuizAttempts = Object.values(studentProgress).flatMap((p) =>
    Object.values(p.quizAttempts),
  )

  return (
    <AppShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="secondary" className="mb-2 text-amber-600 dark:text-amber-400">
              Portal Guru
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat datang, {session?.name ?? 'Guru'}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Kelola course, materi PDF, dan quiz evaluasi yang otomatis tersinkron ke panel siswa.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/teacher/users" className={buttonVariants({ variant: 'outline' })}>
              <HugeiconsIcon icon={UserGroupIcon} data-icon="inline-start" />
              Kelola Siswa ({users.filter((user) => user.role === 'student').length})
            </Link>
            <Button variant="outline" render={<Link to="/teacher/module" />}>
              <HugeiconsIcon icon={BookOpen01Icon} data-icon="inline-start" />
              Kelola Modul Ajar
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              Buat Course Baru
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen01Icon}
            label="Course Dikelola"
            value={`${courses.length}`}
            detail={`${publishedCount} terbit · ${courses.length - publishedCount} draft`}
          />
          <StatCard
            icon={File01Icon}
            label="Total Materi Ajar"
            value={`${totalMaterials}`}
            detail="Mendukung lampiran PDF & ringkasan"
          />
          <StatCard
            icon={Quiz01Icon}
            label="Total Quiz Evaluasi"
            value={`${totalQuizzes}`}
            detail="Pilihan ganda dengan skor otomatis"
          />
          <StatCard
            icon={UserGroupIcon}
            label="Quiz Dikerjakan Siswa"
            value={`${recentQuizAttempts.length}`}
            detail="Terekam dari sesi siswa demo"
          />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Course yang Dikelola</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Klik kelola untuk menambah materi PDF atau soal quiz baru.
                </p>
              </div>
              <Link
                to="/teacher/module"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Lihat Semua <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {courses.map((course) => {
                const completion = computeCourseCompletion('student-1', course)
                return (
                  <Card key={course.id} className="shadow-xs">
                    <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <HugeiconsIcon icon={BookOpen01Icon} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{course.title}</p>
                          <Badge
                            variant={course.status === 'Terbit' ? 'default' : 'outline'}
                            className="text-[10px]"
                          >
                            {course.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {course.subject} · {course.modules.length} konten ({course.quizzes} quiz)
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${completion.percent}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            Progress Dika: {completion.percent}%
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link
                            to="/teacher/module/$courseId/content/new"
                            params={{ courseId: course.id }}
                          />
                        }
                      >
                        + Tambah Konten
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <Card className="h-fit shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Aktivitas Belajar Siswa</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {recentQuizAttempts.length > 0 ? (
                recentQuizAttempts.map((attempt) => (
                  <div
                    key={attempt.moduleId}
                    className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={15}
                          className="text-primary"
                        />
                        Dika menyelesaikan Quiz
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Benar {attempt.correctCount} dari {attempt.totalQuestions} soal ·{' '}
                        {attempt.submittedAt}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-primary font-bold">
                      Skor {attempt.score}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  Belum ada quiz yang dikumpulkan siswa pada sesi ini. Beralih ke akun siswa untuk
                  mencoba mengerjakan quiz.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <CreateCourseDialog open={createOpen} onOpenChange={setCreateOpen} />
      </div>
    </AppShell>
  )
}
