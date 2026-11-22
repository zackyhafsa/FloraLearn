import { CheckmarkCircle02Icon, TeacherIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface TeacherFeedbackCardProps {
  teacherName?: string
  plantName?: string
  grade?: string
  feedback?: string
  date?: string
}

export function TeacherFeedbackCard({
  teacherName = 'Pak Budi Santoso, M.Pd.',
  plantName = 'Pucuk Merah (Syzygium myrtifolium)',
  grade = '95 / 100 · Nilai A',
  feedback = 'Identifikasi habitus dan struktur daun sudah sangat tepat. Foto stomata fokus dan jelas. Pertahankan ketelitian mencatat lokasi temuan lapangan!',
  date = 'Hari ini, 09:15 WIB',
}: TeacherFeedbackCardProps) {
  return (
    <Card className="border-border/80 bg-muted/20 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={TeacherIcon} size={16} />
            </span>
            <CardTitle className="text-sm font-semibold">Ulasan & Feedback Guru</CardTitle>
          </div>
          <Badge variant="secondary" className="text-[10px] text-primary font-semibold">
            {grade}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Verifikasi pada observasi: <span className="font-medium text-foreground">{plantName}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0">
        <div className="rounded-xl border border-border/80 bg-background/80 p-3 flex flex-col gap-2">
          <p className="text-xs italic text-muted-foreground leading-relaxed">
            "{feedback}"
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar size="sm" className="size-5">
                <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-bold">
                  BS
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{teacherName}</span>
            </div>
            <span>{date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
