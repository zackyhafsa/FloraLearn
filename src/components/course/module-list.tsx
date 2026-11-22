import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  LockerIcon,
  PlayCircle02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ModuleItem } from '@/types'

interface ModuleListProps {
  courseId: string
  modules: ModuleItem[]
}

export function ModuleList({ courseId, modules }: ModuleListProps) {
  const completedCount = modules.filter((m) => m.status === 'done').length

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Daftar Modul</h2>
        <span className="text-xs text-muted-foreground">
          {completedCount} dari {modules.length} selesai
        </span>
      </div>

      <Card className="border-border shadow-xs">
        <CardContent className="divide-y divide-border/60 p-0">
          {modules.map((item, index) => (
            <ModuleRow key={item.id} courseId={courseId} module={item} index={index} />
          ))}
        </CardContent>
      </Card>
    </section>
  )
}

function ModuleRow({
  courseId,
  module,
  index,
}: {
  courseId: string
  module: ModuleItem
  index: number
}) {
  const locked = module.status === 'locked'

  return (
    <div className={`flex items-center gap-4 p-4 sm:p-5 ${locked ? 'opacity-50' : ''}`}>
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          module.status === 'done'
            ? 'bg-primary/10 text-primary'
            : module.status === 'active'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
        }`}
      >
        {module.status === 'done' ? (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
        ) : locked ? (
          <HugeiconsIcon icon={LockerIcon} size={16} />
        ) : (
          index + 1
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{module.title}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <HugeiconsIcon icon={Clock01Icon} size={13} /> {module.duration}
        </p>
      </div>

      {module.status === 'active' && (
        <Link
          to="/courses/$courseId/modules/$moduleId"
          params={{ courseId, moduleId: module.id }}
        >
          <Button size="sm" className="gap-1.5 shadow-xs">
            <HugeiconsIcon icon={PlayCircle02Icon} data-icon="inline-start" /> Buka
          </Button>
        </Link>
      )}

      {module.status === 'done' && (
        <Badge variant="secondary" className="text-xs">
          Selesai
        </Badge>
      )}

      {locked && (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Terkunci
        </Badge>
      )}
    </div>
  )
}
