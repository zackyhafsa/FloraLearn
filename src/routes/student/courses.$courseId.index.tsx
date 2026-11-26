import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { CourseAssignmentCard } from '@/components/course/course-assignment-card'
import { CourseBanner } from '@/components/course/course-banner'
import { CourseProgressCard } from '@/components/course/course-progress-card'
import { ModuleList } from '@/components/course/module-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCourse, useCourseProgress } from '@/hooks/use-course-store'
import { getSession } from '@/lib/auth'
import { computeCourseCompletion } from '@/lib/course-store'

export const Route = createFileRoute('/student/courses/$courseId/')({
  component: CourseDetail,
})

function CourseDetail() {
  const { courseId } = Route.useParams()
  const studentId = getSession()?.id ?? 'student-1'

  const course = useCourse(courseId)
  const progressState = useCourseProgress(studentId, courseId)

  if (!course) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center flex flex-col gap-4">
            <p className="font-semibold">Kursus tidak ditemukan</p>
            <p className="text-xs text-muted-foreground">
              Kursus ini mungkin masih berstatus Draft atau telah dihapus oleh guru.
            </p>
            <Button size="sm" render={<Link to="/student/courses" />}>
              Kembali ke Daftar Kursus
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const completion = computeCourseCompletion(studentId, course)
  const firstPending = course.modules.find(
    (m) => !progressState.completedModuleIds.includes(m.id),
  )
  const activeModuleId = firstPending?.id ?? course.modules[0]?.id

  const quizScores: Record<string, number> = {}
  for (const [modId, attempt] of Object.entries(progressState.quizAttempts)) {
    quizScores[modId] = attempt.score
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-8">
          <Link
            to="/student/courses"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Kembali ke daftar kursus
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 flex flex-col gap-8">
        <CourseBanner
          subject={course.subject}
          teacher={course.teacher}
          title={course.title}
          description={course.description}
          totalModules={course.modules.length}
          duration={`${course.modules.length} materi & quiz`}
          progress={completion.percent}
        />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <ModuleList
            courseId={course.id}
            modules={course.modules}
            completedIds={progressState.completedModuleIds}
            quizScores={quizScores}
          />

          <aside className="flex flex-col gap-4">
            <CourseProgressCard
              progress={completion.percent}
              courseId={course.id}
              activeModuleId={activeModuleId}
              statusNote={
                completion.percent === 100
                  ? 'Selamat! Kamu sudah menyelesaikan seluruh materi dan quiz pada kursus ini.'
                  : `${completion.completed} dari ${completion.total} materi & quiz telah diselesaikan.`
              }
            />

            <CourseAssignmentCard
              title="Catatan Belajar Siswa"
              description="Pelajari setiap dokumen materi dari guru dan kerjakan quiz evaluasi di bagian akhir modul."
              deadline={course.quizzes > 0 ? `${course.quizzes} Quiz Tersedia` : 'Materi Mandiri'}
              urgency="normal"
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
