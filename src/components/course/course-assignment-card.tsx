import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface CourseAssignmentCardProps {
  title: string
  description: string
  deadline: string
  urgency?: 'urgent' | 'normal'
  buttonLabel?: string
  onAction?: () => void
}

export function CourseAssignmentCard({
  title,
  description,
  deadline,
  urgency = 'urgent',
  buttonLabel,
  onAction,
}: CourseAssignmentCardProps) {
  return (
    <Card className="border-border bg-muted/20 shadow-xs">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <Badge
            variant={urgency === 'urgent' ? 'destructive' : 'outline'}
            className="text-[10px] shrink-0"
          >
            {deadline}
          </Badge>
        </div>
        <CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
      </CardHeader>
      {buttonLabel && onAction && (
        <CardContent>
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={onAction}>
            {buttonLabel}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
