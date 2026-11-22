import { BookOpen01Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'

interface CourseBannerProps {
  subject: string
  teacher: string
  title: string
  description: string
  totalModules: number
  duration: string
  progress: number
}

export function CourseBanner({
  subject,
  teacher,
  title,
  description,
  totalModules,
  duration,
  progress,
}: CourseBannerProps) {
  return (
    <div className="rounded-3xl border border-border bg-primary/10 p-6 sm:p-10 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{subject}</Badge>
        <Badge variant="outline">{teacher}</Badge>
      </div>

      <h1 className="max-w-2xl text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h1>

      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <HugeiconsIcon icon={BookOpen01Icon} size={16} /> {totalModules} modul materi
        </span>
        <span className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Clock01Icon} size={16} /> {duration}
        </span>
        <Badge variant="default" className="text-xs">
          {progress}% Selesai
        </Badge>
      </div>
    </div>
  )
}
