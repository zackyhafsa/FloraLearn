import * as React from 'react'
import {
  Award01Icon,
  CheckmarkCircle02Icon,
  Quiz01Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuizAttempt, QuizQuestion } from '@/lib/course-store'

interface ModuleQuizRunnerProps {
  courseId: string
  moduleId: string
  questions: QuizQuestion[]
  existingAttempt?: QuizAttempt
  onSubmitAttempt: (attempt: QuizAttempt) => void
}

const optionLetters = ['A', 'B', 'C', 'D']

export function ModuleQuizRunner({
  courseId,
  moduleId,
  questions,
  existingAttempt,
  onSubmitAttempt,
}: ModuleQuizRunnerProps) {
  const [answers, setAnswers] = React.useState<Record<string, number>>(
    existingAttempt?.answers ?? {},
  )
  const [submittedAttempt, setSubmittedAttempt] = React.useState<QuizAttempt | undefined>(
    existingAttempt,
  )

  React.useEffect(() => {
    setAnswers(existingAttempt?.answers ?? {})
    setSubmittedAttempt(existingAttempt)
  }, [moduleId, existingAttempt])

  if (questions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Guru belum menambahkan pertanyaan untuk quiz ini.
        </CardContent>
      </Card>
    )
  }

  const allAnswered = questions.every((q) => typeof answers[q.id] === 'number')
  const isSubmitted = Boolean(submittedAttempt)

  function handleSelect(questionId: string, optionIndex: number) {
    if (isSubmitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  function handleSubmit() {
    if (!allAnswered || isSubmitted) return
    let correctCount = 0
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) {
        correctCount += 1
      }
    }
    const score = Math.round((correctCount / questions.length) * 100)
    const attempt: QuizAttempt = {
      courseId,
      moduleId,
      score,
      correctCount,
      totalQuestions: questions.length,
      answers,
      submittedAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setSubmittedAttempt(attempt)
    onSubmitAttempt(attempt)
  }

  function handleRetry() {
    setAnswers({})
    setSubmittedAttempt(undefined)
  }

  return (
    <div className="flex flex-col gap-5">
      {submittedAttempt && (
        <Card className="border-primary/40 bg-primary/10 shadow-xs">
          <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
                <HugeiconsIcon icon={Award01Icon} size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-foreground">
                    Skor Quiz: {submittedAttempt.score} / 100
                  </p>
                  <Badge variant={submittedAttempt.score >= 75 ? 'default' : 'secondary'}>
                    {submittedAttempt.score >= 75 ? 'Tuntas' : 'Perlu Latihan'}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Kamu menjawab benar {submittedAttempt.correctCount} dari{' '}
                  {submittedAttempt.totalQuestions} pertanyaan (disimpan pukul{' '}
                  {submittedAttempt.submittedAt}).
                </p>
              </div>
            </div>

            <Button type="button" variant="outline" size="sm" onClick={handleRetry}>
              <HugeiconsIcon icon={RefreshIcon} data-icon="inline-start" />
              Ulangi Quiz
            </Button>
          </CardContent>
        </Card>
      )}

      {questions.map((q, qIndex) => {
        const chosenIndex = answers[q.id]
        return (
          <Card key={q.id} className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="w-fit gap-1 text-primary text-[11px]">
                  <HugeiconsIcon icon={Quiz01Icon} size={13} />
                  Soal {qIndex + 1} dari {questions.length}
                </Badge>
                {isSubmitted && (
                  <Badge
                    variant={chosenIndex === q.correctIndex ? 'default' : 'destructive'}
                    className="text-[11px]"
                  >
                    {chosenIndex === q.correctIndex ? 'Jawaban Benar' : 'Kurang Tepat'}
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-2 text-base font-semibold leading-snug">
                {q.question}
              </CardTitle>
              {!isSubmitted && (
                <CardDescription className="text-xs">
                  Pilih satu jawaban yang paling tepat
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="flex flex-col gap-2.5">
              {q.options.map((opt, optIndex) => {
                const isSelected = chosenIndex === optIndex
                const isRightOption = q.correctIndex === optIndex

                let rowStyle =
                  'border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30'
                if (isSubmitted) {
                  if (isRightOption) {
                    rowStyle = 'border-primary bg-primary/10 text-foreground'
                  } else if (isSelected && !isRightOption) {
                    rowStyle = 'border-destructive bg-destructive/10 text-foreground'
                  } else {
                    rowStyle = 'border-border/60 opacity-60'
                  }
                } else if (isSelected) {
                  rowStyle = 'border-primary bg-primary/10 ring-1 ring-primary'
                }

                return (
                  <button
                    key={optIndex}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => handleSelect(q.id, optIndex)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors ${rowStyle}`}
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isSelected || (isSubmitted && isRightOption)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {optionLetters[optIndex] ?? optIndex + 1}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {isSubmitted && isRightOption && (
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={18}
                        className="shrink-0 text-primary"
                      />
                    )}
                  </button>
                )
              })}

              {isSubmitted && q.explanation && (
                <div className="mt-2 rounded-xl border border-border/80 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Pembahasan: </span>
                  {q.explanation}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {!isSubmitted && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">
            Terjawab {Object.keys(answers).length} dari {questions.length} soal
          </p>
          <Button type="button" disabled={!allAnswered} onClick={handleSubmit}>
            <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
            Kumpulkan Jawaban Quiz
          </Button>
        </div>
      )}
    </div>
  )
}
