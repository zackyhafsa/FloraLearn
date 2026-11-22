import * as React from 'react'
import {
  CheckmarkCircle02Icon,
  Location01Icon,
  SparklesIcon,
  TeacherIcon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { TeacherPendingReview } from '@/types'

interface ReviewObservationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  observation: TeacherPendingReview | null
  onSaveReview: (
    id: string,
    status: 'Terverifikasi' | 'Perlu Revisi',
    score: number,
    feedback: string,
  ) => void
}

export function ReviewObservationDialog({
  open,
  onOpenChange,
  observation,
  onSaveReview,
}: ReviewObservationDialogProps) {
  const [decision, setDecision] = React.useState<'Terverifikasi' | 'Perlu Revisi'>('Terverifikasi')
  const [score, setScore] = React.useState(95)
  const [feedback, setFeedback] = React.useState(
    'Identifikasi habitus dan morfologi daun sudah sangat tepat. Foto stomata fokus dan jelas. Pertahankan ketelitian mencatat lokasi temuan!',
  )

  React.useEffect(() => {
    if (observation) {
      setDecision(observation.status === 'Perlu Revisi' ? 'Perlu Revisi' : 'Terverifikasi')
      setScore(observation.score || 95)
      setFeedback(
        observation.feedback ||
          'Identifikasi habitus dan morfologi daun sudah sangat tepat. Foto stomata fokus dan jelas. Pertahankan ketelitian mencatat lokasi temuan!',
      )
    }
  }, [observation])

  if (!observation) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveReview(observation.id, decision, score, feedback)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-primary text-[10px]">
                <HugeiconsIcon icon={TeacherIcon} />
                Portal Penilaian Guru
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {observation.studentClass}
              </Badge>
            </div>
            <DialogTitle className="text-lg font-bold">
              Tinjau Observasi: {observation.plantName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Periksa kecocokan data taksonomi, foto spesimen, dan berikan nilai umpan balik untuk siswa.
            </DialogDescription>
          </DialogHeader>

          {/* Student & Observation Specimen Overview Box */}
          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} size={15} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  {observation.studentName}
                </span>
                <span className="text-[11px] text-muted-foreground">({observation.studentClass})</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{observation.submittedAt}</span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl border border-border shadow-xs">
                {observation.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{observation.plantName}</p>
                <p className="text-xs italic text-muted-foreground">{observation.scientificName}</p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Location01Icon} size={13} />
                    {observation.location}
                  </span>
                  <span>·</span>
                  <span>Habitus: <span className="font-medium text-foreground">{observation.habitType}</span></span>
                </div>
              </div>
            </div>

            {observation.notes && (
              <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground block mb-0.5 text-[11px]">
                  Catatan Siswa:
                </span>
                "{observation.notes}"
              </div>
            )}
          </div>

          {/* Teacher Decision Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground">
              Keputusan Verifikasi Guru
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDecision('Terverifikasi')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-colors ${
                  decision === 'Terverifikasi'
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                    : 'border-border bg-background hover:bg-muted text-foreground'
                }`}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                Setujui & Verifikasi
              </button>

              <button
                type="button"
                onClick={() => setDecision('Perlu Revisi')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-colors ${
                  decision === 'Perlu Revisi'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500'
                    : 'border-border bg-background hover:bg-muted text-foreground'
                }`}
              >
                Minta Perbaikan Siswa
              </button>
            </div>
          </div>

          {/* Score Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="teacher-score" className="text-xs font-semibold text-foreground">
                Nilai Skor Observasi (Skala 0 - 100)
              </label>
              <Badge variant="secondary" className="text-[10px] text-primary">
                {score >= 90 ? 'Grade A' : score >= 80 ? 'Grade B' : 'Grade C'}
              </Badge>
            </div>
            <Input
              id="teacher-score"
              type="number"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              required
              className="text-xs sm:text-sm h-9"
            />
          </div>

          {/* Teacher Feedback Textarea */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="teacher-feedback" className="text-xs font-semibold text-foreground">
              Ulasan & Catatan Edukatif untuk Siswa
            </label>
            <Textarea
              id="teacher-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Berikan apresiasi atau arahan perbaikan morfologi kepada siswa..."
              rows={3}
              className="text-xs sm:text-sm"
              required
            />
          </div>

          <DialogFooter className="mt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" className="gap-1.5">
              <HugeiconsIcon icon={SparklesIcon} data-icon="inline-start" />
              Simpan & Kirim Nilai ke Siswa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
