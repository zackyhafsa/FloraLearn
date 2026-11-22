import {
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Task01Icon,
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
import type { TeacherAssignment } from '@/types'

interface AssignmentManagementCardProps {
  assignments: TeacherAssignment[]
}

export function AssignmentManagementCard({ assignments }: AssignmentManagementCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg">Tugas Praktikum Berjalan</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {assignments.length} Aktif
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-8">
            + Buat Tugas Baru
          </Button>
        </div>
        <CardDescription className="text-xs">
          Pantau rasio pengumpulan laporan praktikum siswa kelas 10 IPA 1 & IPA 2
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {assignments.map((task) => {
          const submissionPercent = Math.round(
            (task.submittedCount / task.totalStudents) * 100,
          )

          return (
            <div
              key={task.id}
              className="rounded-2xl border border-border/80 bg-muted/20 p-4 flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                  <p className="text-xs text-muted-foreground">{task.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <HugeiconsIcon icon={Calendar01Icon} size={12} />
                    Tenggat: {task.deadline}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar of Submissions */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Pengumpulan: <span className="font-semibold text-foreground">{task.submittedCount}</span> dari {task.totalStudents} siswa
                  </span>
                  <span className="font-semibold text-primary">{submissionPercent}%</span>
                </div>
                <Progress value={submissionPercent} className="w-full h-2" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-[11px] text-muted-foreground">
                  {task.totalStudents - task.submittedCount} siswa belum mengirim
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Unduh Rekap
                  </Button>
                  <Button size="sm" className="text-xs h-7">
                    Periksa Laporan
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
