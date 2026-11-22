import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Leaf01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { ModuleCheckpoint } from '@/components/course/module-checkpoint'
import { ModuleSidebar } from '@/components/course/module-sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { ModuleItem } from '@/types'

export const Route = createFileRoute('/courses/$courseId/modules/$moduleId')({
  component: ModuleLesson,
})

const modulesData: ModuleItem[] = [
  { id: 'intro', title: 'Pengantar Keanekaragaman', duration: '12 menit', status: 'done' },
  { id: 'levels', title: 'Tingkat Keanekaragaman', duration: '18 menit', status: 'active' },
  { id: 'species', title: 'Flora & Fauna Indonesia', duration: '24 menit', status: 'locked' },
  { id: 'conservation', title: 'Ancaman & Pelestarian', duration: '20 menit', status: 'locked' },
]

const quizQuestion = {
  question: 'Manakah contoh yang tepat untuk keanekaragaman tingkat gen?',
  options: [
    {
      id: 'opt-1',
      text: 'Variasi warna bunga mawar merah, mawar putih, dan mawar kuning.',
      isCorrect: true,
      explanation:
        'Benar! Warna bunga yang berbeda dalam satu spesies mawar (Rosa sp.) diakibatkan oleh variasi susunan alel pada tingkat gen.',
    },
    {
      id: 'opt-2',
      text: 'Perbedaan antara pohon kelapa (Cocos nucifera) dan pohon aren (Arenga pinnata).',
      isCorrect: false,
      explanation:
        'Kelapa dan aren adalah dua spesies yang berbeda dalam famili Arecaceae, sehingga termasuk keanekaragaman tingkat jenis (spesies).',
    },
    {
      id: 'opt-3',
      text: 'Perbedaan antara hutan mangrove di pesisir dan hutan sabana di Nusa Tenggara.',
      isCorrect: false,
      explanation:
        'Hutan mangrove dan sabana adalah ekosistem yang berbeda, sehingga termasuk keanekaragaman tingkat ekosistem.',
    },
  ],
}

function ModuleLesson() {
  const { courseId, moduleId } = Route.useParams()

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top sticky navigation bar */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
          <Link
            to="/courses/$courseId"
            params={{ courseId }}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Kembali ke silabus kursus
          </Link>
          <Badge variant="outline" className="text-xs">
            Modul 2 dari 4
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 flex flex-col gap-8">
        {/* Breadcrumb indicator */}
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-primary">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon icon={Leaf01Icon} size={18} />
          </span>
          <span>Keanekaragaman Hayati · Modul 2</span>
        </div>

        {/* Lesson main content + sticky sidebar */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <article className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                <HugeiconsIcon icon={Clock01Icon} size={14} />
                <span>Estimasi membaca: 18 menit</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Tingkat Keanekaragaman Hayati
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Keanekaragaman hayati dapat ditinjau dan dikelompokkan ke dalam tiga tingkatan hierarkis:
                tingkat gen, tingkat jenis (spesies), dan tingkat ekosistem.
              </p>
            </div>

            {/* Featured introduction banner */}
            <div className="rounded-3xl border border-border bg-primary/10 p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <HugeiconsIcon icon={BookOpen01Icon} size={22} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Konsep Dasar Keanekaragaman
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Keanekaragaman hayati (biodiversitas) mencakup seluruh variasi sifat dan bentuk organisme
                hidup di bumi. Variasi ini berakar dari perbedaan susunan kode genetik dalam DNA, adaptasi
                relung ekologis antarsubpopulasi, hingga kompleksitas interaksi abiotik pada bentang
                lanskap biogeografis.
              </p>
            </div>

            {/* 3 levels cards grid */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-foreground">
                Tiga Tingkatan Keanekaragaman
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoCard
                  number="01"
                  title="Tingkat Gen"
                  text="Variasi susunan genetik dalam satu spesies, contohnya ragam kultivar mangga (Mangifera indica) atau varietas padi."
                />
                <InfoCard
                  number="02"
                  title="Tingkat Jenis"
                  text="Perbedaan morfologi dan sifat biologis antarspesies berbeda yang hidup dalam satu genus atau famili yang sama."
                />
                <InfoCard
                  number="03"
                  title="Tingkat Ekosistem"
                  text="Interaksi timbal balik komunitas makhluk hidup dengan lingkungan abiotiknya (pantai, hujan tropis, sabana)."
                />
              </div>
            </section>

            {/* Interactive Checkpoint Quiz */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-foreground">Uji Pemahaman Cepat</h2>
              <ModuleCheckpoint
                question={quizQuestion.question}
                options={quizQuestion.options}
              />
            </section>

            <Separator className="my-2" />

            {/* Bottom action controls */}
            <div className="flex items-center justify-between">
              <Link to="/courses/$courseId" params={{ courseId }}>
                <Button variant="outline" size="sm">
                  Kembali ke Silabus
                </Button>
              </Link>
              <Link to="/courses/$courseId" params={{ courseId }}>
                <Button size="sm" className="gap-2">
                  Tandai Selesai & Lanjut
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    data-icon="inline-end"
                  />
                </Button>
              </Link>
            </div>
          </article>

          {/* Sticky Lesson Sidebar */}
          <aside className="flex flex-col gap-4">
            <ModuleSidebar
              courseId={courseId}
              currentModuleId={moduleId}
              modules={modulesData}
              estimatedTime="18 menit"
            />
          </aside>
        </div>
      </div>
    </main>
  )
}

function InfoCard({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <Card className="border-border shadow-xs">
      <CardContent className="p-4 flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit text-xs font-bold">
          {number}
        </Badge>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}
