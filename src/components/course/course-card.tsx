import { ArrowRight01Icon, CheckmarkCircle02Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

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
import { Progress } from '@/components/ui/progress'
import type { CourseItem } from '@/types'

interface CourseCardProps {
  course: CourseItem
  completed?: boolean
}

export function CourseCard({ course, completed = false }: CourseCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{course.subject}</Badge>
          <Badge variant="outline">{course.teacher}</Badge>
          {completed ? (
            <Badge variant="default" className="ml-auto">
              Selesai 100%
            </Badge>
          ) : (
            <span className="ml-auto text-xs font-medium text-muted-foreground">
              {course.lastAccessed}
            </span>
          )}
        </div>
        <CardTitle className="text-base sm:text-lg">{course.title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm leading-relaxed">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {completed
                ? 'Seluruh modul tuntas'
                : `Kemajuan: ${course.completedModules} dari ${course.totalModules} modul`}
            </span>
            <span
              className={
                completed
                  ? 'font-semibold text-primary'
                  : 'font-semibold text-foreground'
              }
            >
              {course.progress}%
            </span>
          </div>
          <Progress value={course.progress} className="w-full" />
        </div>

        {!completed && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Clock01Icon} size={15} />
              {course.remainingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
              Topik saat ini:{' '}
              <span className="font-medium text-foreground">{course.currentTopic}</span>
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/80 pt-4">
        <span className="text-xs text-muted-foreground">
          {completed
            ? `Diselesaikan pada ${course.lastAccessed}`
            : 'Kurikulum Merdeka · Biologi SMA'}
        </span>
        <Button
          variant={completed ? 'outline' : 'default'}
          size="sm"
          className="gap-1.5"
          render={<Link to="/student/courses/$courseId" params={{ courseId: course.id }} />}
        >
          {completed ? 'Tinjau Materi Ulang' : 'Lanjutkan Belajar'}
          <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
