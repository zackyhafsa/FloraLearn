import { Award01Icon, BookOpen01Icon, Quiz01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { usePublishedCourses, useStudentProgress } from '@/hooks/use-course-store'
import { computeCourseCompletion } from '@/lib/course-store'
import type { UserAccount } from '@/lib/user-store'

interface StudentProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: UserAccount | null
}

export function StudentProgressDialog({
  open,
  onOpenChange,
  student,
}: StudentProgressDialogProps) {
  const courses = usePublishedCourses()
  const progressMap = useStudentProgress(student?.id ?? '')

  if (!student) return null

  const quizAttempts = Object.values(progressMap).flatMap((p) => Object.values(p.quizAttempts))
  const avgQuizScore =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {student.className || 'Siswa'}
            </Badge>
            {student.identifier && (
              <Badge variant="outline" className="text-xs">
                NISN: {student.identifier}
              </Badge>
            )}
          </div>
          <DialogTitle>{student.name}</DialogTitle>
          <DialogDescription className="text-xs">{student.email}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <HugeiconsIcon icon={BookOpen01Icon} size={14} className="text-primary" />
                Kursus Diikuti
              </p>
              <p className="mt-1 text-lg font-bold">{courses.length} Course</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <HugeiconsIcon icon={Award01Icon} size={14} className="text-primary" />
                Rata-rata Skor Quiz
              </p>
              <p className="mt-1 text-lg font-bold">
                {avgQuizScore !== null ? `${avgQuizScore} / 100` : 'Belum ada'}
              </p>
            </div>
          </div>

          {/* Per Course Progress */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Progres Per Course
            </p>
            {courses.map((course) => {
              const completion = computeCourseCompletion(student.id, course)
              return (
                <div
                  key={course.id}
                  className="rounded-xl border border-border/80 bg-card p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-foreground">{course.title}</span>
                    <span className="font-semibold text-primary">
                      {completion.completed}/{completion.total} konten ({completion.percent}%)
                    </span>
                  </div>
                  <Progress value={completion.percent} className="h-1.5" />
                </div>
              )
            })}
          </div>

          {/* Quiz Attempts */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Riwayat Quiz ({quizAttempts.length})
            </p>
            {quizAttempts.length > 0 ? (
              <div className="divide-y divide-border/70 rounded-xl border border-border/80 px-3">
                {quizAttempts.map((attempt) => {
                  const course = courses.find((c) => c.id === attempt.courseId)
                  const mod = course?.modules.find((m) => m.id === attempt.moduleId)
                  return (
                    <div
                      key={`${attempt.courseId}-${attempt.moduleId}`}
                      className="flex items-center justify-between gap-3 py-2.5 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate flex items-center gap-1.5">
                          <HugeiconsIcon icon={Quiz01Icon} size={14} className="text-primary" />
                          {mod?.title ?? 'Quiz Evaluasi'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Benar {attempt.correctCount}/{attempt.totalQuestions} · Pukul{' '}
                          {attempt.submittedAt}
                        </p>
                      </div>
                      <Badge variant={attempt.score >= 75 ? 'default' : 'secondary'}>
                        Skor {attempt.score}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed py-5 text-center text-xs text-muted-foreground">
                Siswa ini belum mengumpulkan jawaban quiz.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
