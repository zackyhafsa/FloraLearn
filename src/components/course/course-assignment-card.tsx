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
}

export function CourseAssignmentCard({
  title,
  description,
  deadline,
  urgency = 'urgent',
  buttonLabel = 'Buka Lembar Praktikum',
}: CourseAssignmentCardProps) {
  return (
    <Card className="border-border bg-muted/20 shadow-xs">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <Badge
            variant={urgency === 'urgent' ? 'destructive' : 'outline'}
            className="text-[10px]"
          >
            {deadline}
          </Badge>
        </div>
        <CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="w-full text-xs">
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
