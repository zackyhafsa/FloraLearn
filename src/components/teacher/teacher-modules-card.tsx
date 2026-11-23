import {
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  File02Icon,
  Folder01Icon,
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
import type { TeacherModuleItem } from '@/types'

interface TeacherModulesCardProps {
  modules: TeacherModuleItem[]
}

export function TeacherModulesCard({ modules }: TeacherModulesCardProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">Modul Ajar & Silabus Botani Guru</CardTitle>
              <Badge variant="secondary" className="text-xs text-primary font-semibold">
                Kurikulum Merdeka (Fase E)
              </Badge>
            </div>
            <CardDescription className="text-xs mt-1">
              Rencana Pelaksanaan Pembelajaran (RPP), modul materi ajar, dan panduan praktikum lapangan untuk siswa
            </CardDescription>
          </div>
          <Button size="sm" className="text-xs h-8 gap-1.5 shadow-xs">
            <HugeiconsIcon icon={PlusSignIcon} size={14} data-icon="inline-start" />
            + Tambah Modul Ajar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border/80 bg-muted/20 p-4 flex flex-col justify-between gap-3"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={item.status === 'Terbit' ? 'default' : 'secondary'}
                  className="text-[10px]"
                >
                  {item.status}
                </Badge>
                <span className="text-[11px] text-muted-foreground">{item.targetClass}</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.subject} · {item.chapterCount} Bab Materi</p>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/50 p-2.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground block mb-0.5 text-[11px]">
                  Capaian Pembelajaran (CP):
                </span>
                <p className="line-clamp-2 italic text-[11px]">{item.learningObjective}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <span className="text-[10px] text-muted-foreground">Diperbarui: {item.lastUpdated}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Edit Silabus
                </Button>
                <Button size="sm" className="text-xs h-7">
                  Buka Modul
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t border-border/80 pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Semua materi disesuaikan dengan Capaian Pembelajaran Botani SMA Kelas 10</span>
        <Button variant="ghost" size="sm" className="text-xs h-7">
          Unduh Seluruh Perangkat Ajar (.zip)
        </Button>
      </CardFooter>
    </Card>
  )
}
