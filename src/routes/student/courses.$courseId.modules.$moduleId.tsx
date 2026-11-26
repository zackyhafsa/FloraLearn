import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Leaf01Icon,
  Quiz01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ModuleQuizRunner } from '@/components/course/module-quiz-runner'
import { ModuleSidebar } from '@/components/course/module-sidebar'
import { PdfDocumentReader } from '@/components/course/pdf-document-reader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCourse, useCourseProgress } from '@/hooks/use-course-store'
import { getSession } from '@/lib/auth'
import { markModuleCompleted, saveQuizAttempt, type QuizAttempt } from '@/lib/course-store'

export const Route = createFileRoute('/student/courses/$courseId/modules/$moduleId')({
  component: ModuleLesson,
})

function ModuleLesson() {
  const { courseId, moduleId } = Route.useParams()
  const navigate = useNavigate()
  const studentId = getSession()?.id ?? 'student-1'

  const course = useCourse(courseId)
  const progress = useCourseProgress(studentId, courseId)

  const modules = course?.modules ?? []
  const currentIndex = modules.findIndex((m) => m.id === moduleId)
  const currentModule = currentIndex >= 0 ? modules[currentIndex] : modules[0]
  const nextModule =
    currentIndex >= 0 && currentIndex + 1 < modules.length ? modules[currentIndex + 1] : undefined

  if (!course || !currentModule) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center flex flex-col gap-4">
            <p className="font-semibold">Materi tidak ditemukan</p>
            <p className="text-xs text-muted-foreground">
              Course atau modul mungkin telah dihapus oleh guru.
            </p>
            <Button size="sm" render={<Link to="/student/courses" />}>
              Kembali ke Daftar Kursus
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const isQuiz = currentModule.type === 'quiz'
  const isCompleted = progress.completedModuleIds.includes(currentModule.id)
  const existingAttempt = progress.quizAttempts[currentModule.id]

  const hasRealContent =
    Boolean(currentModule.content?.trim()) &&
    !currentModule.content.startsWith('Silakan pelajari dokumen PDF terlampir:')

  const sidebarModules = modules.map((m) => ({
    id: m.id,
    title: m.title,
    duration: m.duration,
    status: (progress.completedModuleIds.includes(m.id) ? 'done' : 'active') as
      | 'done'
      | 'active'
      | 'locked',
  }))

  function handleCompleteAndNext() {
    if (!currentModule) return
    markModuleCompleted(studentId, courseId, currentModule.id)
    if (nextModule) {
      navigate({
        to: '/student/courses/$courseId/modules/$moduleId',
        params: { courseId, moduleId: nextModule.id },
      })
    } else {
      navigate({ to: '/student/courses/$courseId', params: { courseId } })
    }
  }

  function handleQuizSubmit(attempt: QuizAttempt) {
    saveQuizAttempt(studentId, attempt)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
          <Link
            to="/student/courses/$courseId"
            params={{ courseId }}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Kembali ke silabus kursus
          </Link>
          <Badge variant="outline" className="text-xs">
            Konten {currentIndex + 1} dari {modules.length}
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-medium text-primary">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={isQuiz ? Quiz01Icon : Leaf01Icon} size={18} />
          </span>
          <span>
            {course.title} · {currentModule.chapter || `Bagian ${currentIndex + 1}`}
          </span>
          {isCompleted && (
            <Badge variant="secondary" className="text-xs text-primary">
              Sudah Selesai
            </Badge>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_290px]">
          <article className="flex flex-col gap-6 min-w-0">
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} size={14} />
                <span>Estimasi membaca: {currentModule.duration}</span>
                {isQuiz && <Badge variant="secondary">Evaluasi Quiz</Badge>}
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                {currentModule.title}
              </h1>
              {currentModule.description && (
                <p className="mt-1 text-base text-muted-foreground leading-relaxed">
                  {currentModule.description}
                </p>
              )}
            </header>

            {isQuiz ? (
              <ModuleQuizRunner
                courseId={courseId}
                moduleId={currentModule.id}
                questions={currentModule.questions ?? []}
                existingAttempt={existingAttempt}
                onSubmitAttempt={handleQuizSubmit}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {hasRealContent && (
                  <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xs">
                    <p className="text-[15px] leading-7 text-foreground/90 whitespace-pre-line">
                      {currentModule.content}
                    </p>
                  </section>
                )}

                {currentModule.pdfId && <PdfDocumentReader pdfId={currentModule.pdfId} />}
              </div>
            )}

            <Separator className="my-2" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                render={<Link to="/student/courses/$courseId" params={{ courseId }} />}
              >
                Kembali ke Silabus
              </Button>
              <Button size="sm" className="gap-2" onClick={handleCompleteAndNext}>
                {nextModule ? 'Tandai Selesai & Lanjut' : 'Selesaikan Modul'}
                <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-end" />
              </Button>
            </div>
          </article>

          <aside className="flex flex-col gap-4">
            <ModuleSidebar
              courseId={courseId}
              currentModuleId={currentModule.id}
              modules={sidebarModules}
              estimatedTime={currentModule.duration}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
