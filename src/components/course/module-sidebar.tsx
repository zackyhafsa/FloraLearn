import { CheckmarkCircle02Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ModuleItem } from '@/types'

interface ModuleSidebarProps {
  courseId: string
  currentModuleId: string
  modules: ModuleItem[]
  estimatedTime?: string
}

export function ModuleSidebar({
  courseId,
  currentModuleId,
  modules,
  estimatedTime = '18 menit',
}: ModuleSidebarProps) {
  return (
    <Card className="sticky top-20 border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Daftar Materi Modul</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 p-3 pt-0">
        {modules.map((item, index) => {
          const isActive = item.id === currentModuleId
          const isDone = item.status === 'done'
          const isLocked = item.status === 'locked'

          const content = (
            <div
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                isActive
                  ? 'bg-secondary font-semibold text-secondary-foreground'
                  : isLocked
                    ? 'text-muted-foreground/60 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <span
                className={`flex size-4 items-center justify-center rounded-full text-[10px] shrink-0 ${
                  isDone
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                      ? 'border-2 border-primary'
                      : 'border border-border'
                }`}
              >
                {isDone && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} />}
              </span>
              <span className="truncate">
                {index + 1}. {item.title}
              </span>
            </div>
          )

          if (isLocked) {
            return <div key={item.id}>{content}</div>
          }

          return (
            <Link
              key={item.id}
              to="/courses/$courseId/modules/$moduleId"
              params={{ courseId, moduleId: item.id }}
            >
              {content}
            </Link>
          )
        })}

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <HugeiconsIcon icon={Clock01Icon} size={14} />
          <span>Estimasi sisa: {estimatedTime}</span>
        </div>
      </CardContent>
    </Card>
  )
}
