import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Add01Icon,
  BookOpen01Icon,
  Delete02Icon,
  Edit02Icon,
  File01Icon,
  Pdf01Icon,
  Quiz01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { AppShell } from '@/components/layout/app-header'
import { CreateCourseDialog } from '@/components/teacher/create-course-dialog'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  COURSES_CHANGE_EVENT,
  deleteCourse,
  deleteModule,
  getCourses,
  updateCourse,
  type DemoCourse,
  type DemoModule,
} from '@/lib/course-store'
import { deletePdfFile } from '@/lib/pdf-store'

export const Route = createFileRoute('/teacher/module/')({ component: ModuleManagement })

function ModuleManagement() {
  const [courses, setCourses] = React.useState<DemoCourse[]>(() => getCourses())
  const [query, setQuery] = React.useState('')
  const [createCourseOpen, setCreateCourseOpen] = React.useState(false)

  React.useEffect(() => {
    const sync = () => setCourses(getCourses())
    window.addEventListener(COURSES_CHANGE_EVENT, sync)
    return () => window.removeEventListener(COURSES_CHANGE_EVENT, sync)
  }, [])

  const filtered = courses.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subject.toLowerCase().includes(query.toLowerCase()),
  )

  async function handleDeleteCourse(course: DemoCourse) {
    for (const mod of course.modules) {
      if (mod.pdfId) await deletePdfFile(mod.pdfId)
    }
    deleteCourse(course.id)
  }

  async function handleDeleteModule(courseId: string, mod: DemoModule) {
    if (mod.pdfId) await deletePdfFile(mod.pdfId)
    deleteModule(courseId, mod.id)
  }

  function handleToggleStatus(course: DemoCourse) {
    updateCourse(course.id, { status: course.status === 'Terbit' ? 'Draft' : 'Terbit' })
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="secondary" className="mb-2 text-amber-600 dark:text-amber-400">
              Manajemen Konten Guru
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Modul Ajar, PDF & Quiz
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Buat course, unggah materi PDF, dan susun quiz evaluasi. Course berstatus{' '}
              <span className="font-semibold text-foreground">Terbit</span> otomatis tampil di
              panel siswa.
            </p>
          </div>

          <Button onClick={() => setCreateCourseOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
            Buat Course Baru
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul course atau mata pelajaran..."
            className="max-w-sm"
          />
          <p className="text-sm text-muted-foreground">{filtered.length} course dikelola</p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onToggleStatus={() => handleToggleStatus(course)}
                onDeleteCourse={() => handleDeleteCourse(course)}
                onDeleteModule={(mod) => handleDeleteModule(course.id, mod)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={BookOpen01Icon} size={24} />
              </div>
              <div>
                <p className="font-semibold">Belum ada course yang sesuai</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Buat course baru untuk mulai menambahkan materi PDF dan quiz.
                </p>
              </div>
              <Button size="sm" onClick={() => setCreateCourseOpen(true)}>
                <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
                Buat Course Baru
              </Button>
            </CardContent>
          </Card>
        )}

        <CreateCourseDialog open={createCourseOpen} onOpenChange={setCreateCourseOpen} />
      </div>
    </AppShell>
  )
}

function CourseCard({
  course,
  onToggleStatus,
  onDeleteCourse,
  onDeleteModule,
}: {
  course: DemoCourse
  onToggleStatus: () => void
  onDeleteCourse: () => void
  onDeleteModule: (mod: DemoModule) => void
}) {
  const materialCount = course.modules.filter((m) => m.type !== 'quiz').length
  const quizCount = course.modules.filter((m) => m.type === 'quiz').length

  return (
    <Card className="flex flex-col shadow-xs transition-shadow hover:shadow-md">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HugeiconsIcon icon={BookOpen01Icon} size={22} />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onToggleStatus} title="Klik untuk ubah status Terbit / Draft">
              <Badge
                variant={course.status === 'Terbit' ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                {course.status === 'Terbit' ? 'Terbit (Aktif di Siswa)' : 'Draft (Disembunyikan)'}
              </Badge>
            </button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-destructive"
              onClick={onDeleteCourse}
              aria-label={`Hapus ${course.title}`}
            >
              <HugeiconsIcon icon={Delete02Icon} />
            </Button>
          </div>
        </div>

        <div>
          <CardTitle className="text-xl leading-tight">{course.title}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{course.subject}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Metrics */}
        <div className="grid grid-cols-3 divide-x rounded-xl border border-border py-2.5">
          <Metric icon={File01Icon} value={materialCount} label="Materi" />
          <Metric icon={Quiz01Icon} value={quizCount} label="Quiz" />
          <Metric icon={UserGroupIcon} value={course.students} label="Siswa" />
        </div>

        {/* Module & Quiz contents list */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Daftar Isi Modul ({course.modules.length})
          </p>

          {course.modules.length > 0 ? (
            <div className="flex flex-col divide-y divide-border/70 rounded-xl border border-border/80 bg-muted/15 px-3">
              {course.modules.map((mod) => {
                const isQuiz = mod.type === 'quiz'
                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between gap-2 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
                          isQuiz ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <HugeiconsIcon
                          icon={isQuiz ? Quiz01Icon : mod.pdfName ? Pdf01Icon : BookOpen01Icon}
                          size={14}
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {mod.chapter && (
                            <span className="text-[10px] font-semibold text-muted-foreground">
                              {mod.chapter} ·
                            </span>
                          )}
                          <p className="truncate font-medium text-foreground">{mod.title}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{mod.duration}</span>
                          {mod.pdfName && (
                            <Badge variant="secondary" className="h-4 px-1.5 py-0 text-[10px]">
                              PDF: {mod.pdfName}
                            </Badge>
                          )}
                          {isQuiz && (
                            <Badge variant="secondary" className="h-4 px-1.5 py-0 text-[10px]">
                              {mod.questions?.length ?? 0} Soal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        to="/teacher/module/$courseId/content/new"
                        params={{ courseId: course.id }}
                        search={{ editId: mod.id }}
                        className={buttonVariants({ size: 'icon-sm', variant: 'ghost' })}
                        aria-label={`Edit ${mod.title}`}
                      >
                        <HugeiconsIcon icon={Edit02Icon} size={14} />
                      </Link>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => onDeleteModule(mod)}
                        aria-label={`Hapus ${mod.title}`}
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-5 text-center text-xs text-muted-foreground">
              Belum ada materi atau quiz di course ini.
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-border/60 pt-4">
        <Link
          to="/teacher/module/$courseId/content/new"
          params={{ courseId: course.id }}
          search={{ type: 'material' }}
          className={buttonVariants({ className: 'flex-1', size: 'sm' })}
        >
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Tambah Materi PDF
        </Link>
        <Link
          to="/teacher/module/$courseId/content/new"
          params={{ courseId: course.id }}
          search={{ type: 'quiz' }}
          className={buttonVariants({ className: 'flex-1', size: 'sm', variant: 'outline' })}
        >
          <HugeiconsIcon icon={Quiz01Icon} data-icon="inline-start" />
          Tambah Quiz
        </Link>
      </CardFooter>
    </Card>
  )
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: typeof BookOpen01Icon
  value: number
  label: string
}) {
  return (
    <div className="text-center">
      <HugeiconsIcon icon={icon} size={15} className="mx-auto text-muted-foreground" />
      <p className="mt-1 text-sm font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
