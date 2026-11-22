import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  Location01Icon,
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
  const pendingItems = items.filter((i) => i.status === 'Menunggu Review')

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg">Antrean Verifikasi Spesimen</CardTitle>
            <Badge variant="secondary" className="text-xs text-primary font-semibold">
              {pendingItems.length} Menunggu
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            Urutkan: Terbaru Masuk
          </span>
        </div>
        <CardDescription className="text-xs">
          Laporan identifikasi tanaman dari siswa yang perlu ditinjau, divalidasi, dan diberi nilai
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col divide-y divide-border/60 p-0 px-4 sm:px-6">
        {pendingItems.length > 0 ? (
          pendingItems.map((item) => (
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

                  {item.notes && (
                    <p className="text-[11px] text-muted-foreground/90 mt-1 line-clamp-1 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Button
                  size="sm"
                  onClick={() => onSelectReview(item)}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
                  Tinjau & Beri Nilai
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
            </div>
            <p className="text-sm font-semibold text-foreground">Semua observasi telah ditinjau!</p>
            <p className="text-xs text-muted-foreground">
              Tidak ada antrean laporan baru dari siswa saat ini.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/80 pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Kriteria: Ketepatan taksonomi & kualitas foto stomata/morfologi</span>
        <Button variant="ghost" size="sm" className="text-xs h-7">
          Riwayat Verifikasi (12)
        </Button>
      </CardFooter>
    </Card>
  )
}
