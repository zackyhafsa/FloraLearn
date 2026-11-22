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
  activeModuleId = 'levels',
  statusNote = 'Sedikit lagi menuju evaluasi akhir bab!',
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
        <Link
          to="/courses/$courseId/modules/$moduleId"
          params={{ courseId, moduleId: activeModuleId }}
        >
          <Button className="w-full gap-2">
            <HugeiconsIcon icon={PlayCircle02Icon} data-icon="inline-start" />
            Lanjutkan Belajar
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
