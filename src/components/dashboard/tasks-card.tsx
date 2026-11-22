import { Calendar01Icon } from '@hugeicons/core-free-icons'
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
import type { TaskItem } from '@/types'

interface TasksCardProps {
  tasks: TaskItem[]
}

function TaskRow({ task }: { task: TaskItem }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/70 p-3 bg-muted/20">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-foreground leading-snug">{task.title}</p>
        <Badge
          variant={task.urgency === 'urgent' ? 'destructive' : 'outline'}
          className="text-[10px] shrink-0"
        >
          {task.badgeLabel}
        </Badge>
      </div>
      <p className="text-[11px] text-muted-foreground">{task.course}</p>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <HugeiconsIcon icon={Calendar01Icon} size={13} />
        Tenggat: {task.deadline}
      </div>
    </div>
  )
}

export function TasksCard({ tasks }: TasksCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Agenda & Tugas</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {tasks.length} Pending
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Tugas praktikum yang memerlukan perhatian
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </CardContent>
      <CardFooter className="border-t border-border/80 pt-3">
        <Button variant="ghost" size="sm" className="w-full text-xs">
          Lihat Semua Tugas Praktikum
        </Button>
      </CardFooter>
    </Card>
  )
}
