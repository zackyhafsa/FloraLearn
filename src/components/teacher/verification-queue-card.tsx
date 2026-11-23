import * as React from 'react'
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  FilterIcon,
  Location01Icon,
  SparklesIcon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { TeacherPendingReview } from '@/types'

interface VerificationQueueCardProps {
  items: TeacherPendingReview[]
  onSelectReview: (item: TeacherPendingReview) => void
}

export function VerificationQueueCard({ items, onSelectReview }: VerificationQueueCardProps) {
  const [selectedClass, setSelectedClass] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'pending' | 'reviewed'>('pending')

  const pendingItems = items.filter((i) => i.status === 'Menunggu Review')
  const reviewedItems = items.filter((i) => i.status !== 'Menunggu Review')

  const currentList = viewMode === 'pending' ? pendingItems : reviewedItems

  const filteredList = currentList.filter((item) => {
    if (selectedClass === 'all') return true
    return item.studentClass === selectedClass
  })

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">Verifikasi Observasi & Herbarium</CardTitle>
              <Badge variant="secondary" className="text-xs text-primary font-semibold">
                {pendingItems.length} Menunggu
              </Badge>
            </div>
            <CardDescription className="text-xs mt-1">
              Validasi ketepatan identifikasi taksonomi flora, kualitas foto morfologi, dan berikan nilai umpan balik
            </CardDescription>
          </div>

          {/* View mode toggle: Pending vs Reviewed */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <Button
              variant={viewMode === 'pending' ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7 px-3"
              onClick={() => setViewMode('pending')}
            >
              Antrean Masuk ({pendingItems.length})
            </Button>
            <Button
              variant={viewMode === 'reviewed' ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7 px-3"
              onClick={() => setViewMode('reviewed')}
            >
              Riwayat Dinilai ({reviewedItems.length})
            </Button>
          </div>
        </div>

        {/* Class Filter Pills */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50 text-xs">
          <span className="text-muted-foreground text-[11px] font-medium">Filter Rombel:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedClass('all')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedClass === 'all'
                  ? 'bg-secondary text-secondary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              Semua Kelas
            </button>
            <button
              type="button"
              onClick={() => setSelectedClass('10 IPA 1')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedClass === '10 IPA 1'
                  ? 'bg-secondary text-secondary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              10 IPA 1
            </button>
            <button
              type="button"
              onClick={() => setSelectedClass('10 IPA 2')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedClass === '10 IPA 2'
                  ? 'bg-secondary text-secondary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              10 IPA 2
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col divide-y divide-border/60 p-0 px-4 sm:px-6">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl border border-border/80">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{item.plantName}</p>
                    <span className="text-xs italic text-muted-foreground truncate">
                      ({item.scientificName})
                    </span>
                    {item.status !== 'Menunggu Review' && (
                      <Badge
                        variant={item.status === 'Terverifikasi' ? 'default' : 'secondary'}
                        className={`text-[10px] py-0 px-1.5 h-4 ${
                          item.status === 'Perlu Revisi'
                            ? 'text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : ''
                        }`}
                      >
                        {item.status}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <HugeiconsIcon icon={UserIcon} size={13} className="text-primary" />
                      {item.studentName} ({item.studentClass})
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Location01Icon} size={12} />
                      {item.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} size={12} />
                      {item.submittedAt}
                    </span>
                  </div>

                  {/* Student note */}
                  {item.notes && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 italic">
                      Catatan Siswa: "{item.notes}"
                    </p>
                  )}

                  {/* Teacher feedback and score if reviewed */}
                  {item.score !== undefined && (
                    <div className="mt-2 rounded-xl border border-border/80 bg-background/80 p-2 text-xs flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] text-primary font-bold">
                          Skor Nilai: {item.score} / 100
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">Ulasan Guru:</span>
                      </div>
                      <p className="text-[11px] text-foreground leading-relaxed italic">
                        "{item.feedback}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Button
                  size="sm"
                  variant={item.status === 'Menunggu Review' ? 'default' : 'outline'}
                  onClick={() => onSelectReview(item)}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
                  {item.status === 'Menunggu Review' ? 'Tinjau & Beri Nilai' : 'Ubah Nilai / Evaluasi'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {viewMode === 'pending'
                ? 'Tidak ada antrean observasi yang menunggu di kelas ini.'
                : 'Belum ada observasi yang telah dinilai pada filter ini.'}
            </p>
            <p className="text-xs text-muted-foreground">
              {viewMode === 'pending'
                ? 'Semua laporan siswa telah selesai divalidasi!'
                : 'Silakan pilih antrean masuk untuk memulai penilaian spesimen.'}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/80 pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Kriteria Penilaian: Ketepatan taksonomi & kelengkapan morfologi spesimen</span>
        <span className="font-medium text-foreground">{filteredList.length} laporan ditampilkan</span>
      </CardFooter>
    </Card>
  )
}
