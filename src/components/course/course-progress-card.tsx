import { PlayCircle02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface CourseProgressCardProps {
  progress: number
  courseId: string
  activeModuleId?: string
  statusNote?: string
}

export function CourseProgressCard({
  progress,
  courseId,
  activeModuleId,
  statusNote = 'Selesaikan seluruh materi dan quiz untuk menuntaskan kursus ini!',
}: CourseProgressCardProps) {
  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Kemajuan Belajar</CardTitle>
        <CardDescription className="text-xs">
          Pantau progres kelulusan modul belajarmu
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total Penyelesaian</span>
          <span className="font-bold text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-xs text-muted-foreground leading-relaxed">{statusNote}</p>
        {activeModuleId ? (
          <Button
            className="w-full gap-2"
            render={
              <Link
                to="/student/courses/$courseId/modules/$moduleId"
                params={{ courseId, moduleId: activeModuleId }}
              />
            }
          >
            <HugeiconsIcon icon={PlayCircle02Icon} data-icon="inline-start" />
            {progress === 100 ? 'Tinjau Ulang Materi' : 'Lanjutkan Belajar'}
          </Button>
        ) : (
          <Button className="w-full gap-2" disabled>
            <HugeiconsIcon icon={PlayCircle02Icon} data-icon="inline-start" />
            Belum Ada Materi
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
