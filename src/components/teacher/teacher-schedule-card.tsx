import {
  Calendar01Icon,
  Clock01Icon,
  Location01Icon,
  PlusSignIcon,
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
import type { TeacherScheduleItem } from '@/types'

interface TeacherScheduleCardProps {
  schedule: TeacherScheduleItem[]
}

export function TeacherScheduleCard({ schedule }: TeacherScheduleCardProps) {
  const getStatusBadge = (status: TeacherScheduleItem['status']) => {
    switch (status) {
      case 'berlangsung':
        return (
          <Badge className="bg-primary text-primary-foreground text-[10px] animate-pulse">
            Sedang Berlangsung
          </Badge>
        )
      case 'selesai':
        return (
          <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
            Selesai
          </Badge>
        )
      case 'akan_datang':
      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            Akan Datang
          </Badge>
        )
    }
  }

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg">Jadwal Mengajar & Praktikum</CardTitle>
          </div>
          <Badge variant="outline" className="text-[11px] gap-1">
            <HugeiconsIcon icon={Calendar01Icon} size={12} />
            Hari Ini
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Agenda pembelajaran tatap muka, praktikum laboratorium, dan pengamatan lapangan
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col divide-y divide-border/60 p-0 px-4 sm:px-6">
        {schedule.map((item) => (
          <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <HugeiconsIcon icon={Clock01Icon} size={13} />
                  {item.time}
                </span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                  {item.type}
                </Badge>
              </div>
              {getStatusBadge(item.status)}
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{item.className}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Location01Icon} size={12} />
                  {item.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t border-border/80 pt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Total 3 sesi terjadwal hari ini</span>
        <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
          <HugeiconsIcon icon={PlusSignIcon} size={13} data-icon="inline-start" />
          Atur Jadwal
        </Button>
      </CardFooter>
    </Card>
  )
}
