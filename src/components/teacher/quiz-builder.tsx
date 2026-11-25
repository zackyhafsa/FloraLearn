import {
  Add01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Quiz01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { QuizQuestion } from '@/lib/course-store'

interface QuizBuilderProps {
  questions: QuizQuestion[]
  onChange: (questions: QuizQuestion[]) => void
}

const optionLabels = ['A', 'B', 'C', 'D']

export function createEmptyQuestion(): QuizQuestion {
  return {
    id: `q-${crypto.randomUUID().slice(0, 8)}`,
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
  }
}

export function QuizBuilder({ questions, onChange }: QuizBuilderProps) {
  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    const next = questions.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    onChange(next)
  }

  function updateOption(qIndex: number, optIndex: number, value: string) {
    const target = questions[qIndex]
    const options = target.options.map((opt, idx) => (idx === optIndex ? value : opt))
    updateQuestion(qIndex, { options })
  }

  function addQuestion() {
    onChange([...questions, createEmptyQuestion()])
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return
    onChange(questions.filter((_, idx) => idx !== index))
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 text-primary">
            <HugeiconsIcon icon={Quiz01Icon} size={14} />
            {questions.length} Pertanyaan
          </Badge>
          <span className="text-xs text-muted-foreground">
            Klik huruf opsi (A–D) atau tombol centang untuk menandai kunci jawaban benar.
          </span>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Tambah Pertanyaan
        </Button>
      </div>

      {questions.map((item, qIndex) => (
        <Card key={item.id} className="border-border/80 bg-muted/15 shadow-xs">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                {qIndex + 1}
              </span>
              Pertanyaan #{qIndex + 1}
            </CardTitle>
            {questions.length > 1 && (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => removeQuestion(qIndex)}
                aria-label={`Hapus pertanyaan ${qIndex + 1}`}
              >
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            )}
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Teks Pertanyaan <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={item.question}
                onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                placeholder="Contoh: Manakah yang merupakan contoh keanekaragaman hayati tingkat gen?"
                rows={2}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-foreground">
                Pilihan Jawaban & Kunci Benar <span className="text-destructive">*</span>
              </label>
              <div className="grid gap-2.5">
                {item.options.map((opt, optIndex) => {
                  const isCorrect = item.correctIndex === optIndex
                  return (
                    <div key={optIndex} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuestion(qIndex, { correctIndex: optIndex })}
                        title="Tandai sebagai jawaban benar"
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-colors ${
                          isCorrect
                            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {optionLabels[optIndex]}
                      </button>
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                        placeholder={`Opsi ${optionLabels[optIndex]}`}
                        className={isCorrect ? 'border-primary/60 bg-primary/5' : ''}
                      />
                      <button
                        type="button"
                        onClick={() => updateQuestion(qIndex, { correctIndex: optIndex })}
                        className={`hidden sm:inline-flex items-center gap-1 rounded-xl border px-2.5 h-9 text-xs font-medium shrink-0 transition-colors ${
                          isCorrect
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                        {isCorrect ? 'Kunci Benar' : 'Pilih Benar'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Pembahasan Jawaban (Opsional — tampil setelah siswa menjawab)
              </label>
              <Input
                value={item.explanation ?? ''}
                onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
                placeholder="Contoh: Variasi warna bunga dalam satu spesies disebabkan oleh perbedaan alel gen."
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
