import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { cn } from 'cn'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  icon: IconSvgElement
  label: string
  value: string
  detail: string
  iconClassName?: string
  detailClassName?: string
}

export function StatCard({
  icon,
  label,
  value,
  detail,
  iconClassName,
  detailClassName,
}: StatCardProps) {
  return (
    <Card size="sm" className="border-border/80 shadow-xs">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary',
            iconClassName,
          )}
        >
          <HugeiconsIcon icon={icon} size={18} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className={cn('text-xs text-muted-foreground', detailClassName)}>{detail}</p>
      </CardContent>
    </Card>
  )
}
