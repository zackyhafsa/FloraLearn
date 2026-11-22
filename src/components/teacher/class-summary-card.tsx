import {
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  Folder01Icon,
  UserGroupIcon,
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
import { Progress } from '@/components/ui/progress'
import type { TeacherClassSummary } from '@/types'

interface ClassSummaryCardProps {
  classes: TeacherClassSummary[]
}

export function ClassSummaryCard({ classes }: ClassSummaryCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg">Ringkasan Kelas Bimbingan</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {classes.length} Rombel Aktif
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-8">
            Kelola Rombel
          </Button>
        </div>
        <CardDescription className="text-xs">
          Pantau progres partisipasi, nilai rata-rata, dan koleksi spesimen botani siswa per kelas
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {classes.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border/80 bg-muted/20 p-4 flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                  {item.name.replace('Kelas ', '')}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{item.academicYear}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[11px] gap-1">
                  <HugeiconsIcon icon={UserGroupIcon} size={12} />
                  {item.studentCount} Siswa
                </Badge>
                <Badge variant="secondary" className="text-[11px] font-semibold text-primary">
                  Rata-rata: {item.averageScore}
                </Badge>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-y border-border/60">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground">Spesimen Terkumpul</span>
                <span className="text-sm font-bold text-foreground">
                  {item.specimensFound} Spesimen
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground">Siswa Aktif Praktikum</span>
                <span className="text-sm font-bold text-foreground">
                  {item.activeCount} / {item.studentCount} ({Math.round((item.activeCount / item.studentCount) * 100)}%)
                </span>
              </div>
              <div className="flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[10px] text-muted-foreground">Takson Paling Dominan</span>
                <span className="text-xs font-semibold text-primary truncate">
                  {item.topTaxon}
                </span>
              </div>
            </div>

            {/* Completion rate progress */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tingkat Ketuntasan Tugas:</span>
                <span className="font-semibold text-foreground">{item.taskCompletionRate}%</span>
              </div>
              <Progress value={item.taskCompletionRate} className="h-2 w-full" />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                Daftar Siswa
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7">
                Rekap Nilai Rapor
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t border-border/80 pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-primary" />
          Semua kelas memenuhi target Kurikulum Merdeka Fase E
        </span>
        <Button variant="ghost" size="sm" className="text-xs h-7">
          Ekspor Semua (.xlsx)
        </Button>
      </CardFooter>
    </Card>
  )
}
