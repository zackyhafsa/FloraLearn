import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  LockerIcon,
  Pdf01Icon,
  PlayCircle02Icon,
  Quiz01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { DemoModule } from '@/lib/course-store'

interface ModuleListProps {
  courseId: string
  modules: DemoModule[]
  completedIds?: string[]
  quizScores?: Record<string, number>
}

export function ModuleList({
  courseId,
  modules,
  completedIds = [],
  quizScores = {},
}: ModuleListProps) {
  const completedCount = modules.filter(
    (m) => completedIds.includes(m.id) || m.status === 'done',
  ).length

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Daftar Materi & Quiz</h2>
        <span className="text-xs text-muted-foreground">
          {completedCount} dari {modules.length} selesai
        </span>
      </div>

      <Card className="border-border shadow-xs">
        {modules.length > 0 ? (
          <CardContent className="divide-y divide-border/60 p-0">
            {modules.map((item, index) => {
              const isDone = completedIds.includes(item.id)
              const score = quizScores[item.id]
              return (
                <ModuleRow
                  key={item.id}
                  courseId={courseId}
                  module={{ ...item, status: isDone ? 'done' : 'active' }}
                  index={index}
                  quizScore={score}
                />
              )
            })}
          </CardContent>
        ) : (
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Guru belum menambahkan materi pada kursus ini.
          </CardContent>
        )}
      </Card>
    </section>
  )
}

function ModuleRow({
  courseId,
  module,
  index,
  quizScore,
}: {
  courseId: string
  module: DemoModule
  index: number
  quizScore?: number
}) {
  const locked = module.status === 'locked'
  const isQuiz = module.type === 'quiz'

  return (
    <div className={`flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 sm:p-5 ${locked ? 'opacity-50' : ''}`}>
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
        <div className="flex flex-wrap items-center gap-1.5">
          {module.chapter && (
            <span className="text-[11px] font-semibold text-muted-foreground">
              {module.chapter} ·
            </span>
          )}
          <p className="text-sm font-semibold text-foreground">{module.title}</p>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} size={13} /> {module.duration}
          </span>
          {module.pdfName && (
            <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
              <HugeiconsIcon icon={Pdf01Icon} size={11} />
              PDF
            </Badge>
          )}
          {isQuiz && (
            <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5 text-amber-600 dark:text-amber-400">
              <HugeiconsIcon icon={Quiz01Icon} size={11} />
              Quiz ({module.questions?.length ?? 0} soal)
            </Badge>
          )}
          {quizScore !== undefined && (
            <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-primary border-primary/30">
              Skor: {quizScore}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {module.status === 'done' && (
          <Badge variant="secondary" className="text-xs">
            Selesai
          </Badge>
        )}

        {!locked ? (
          <Link
            to="/student/courses/$courseId/modules/$moduleId"
            params={{ courseId, moduleId: module.id }}
          >
            <Button
              size="sm"
              variant={module.status === 'done' ? 'outline' : 'default'}
              className="gap-1.5 shadow-xs"
            >
              <HugeiconsIcon icon={PlayCircle02Icon} data-icon="inline-start" />
              {isQuiz
                ? module.status === 'done'
                  ? 'Lihat Hasil'
                  : 'Kerjakan Quiz'
                : module.status === 'done'
                  ? 'Baca Ulang'
                  : 'Buka'}
            </Button>
          </Link>
        ) : (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Terkunci
          </Badge>
        )}
      </div>
    </div>
  )
}
