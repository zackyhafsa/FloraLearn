import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen01Icon, SparklesIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AppShell } from '@/components/layout/app-header'
import { CourseCard } from '@/components/dashboard/course-card'
import { StatCard } from '@/components/dashboard/stat-card'

import type { CourseItem } from '@/types'

export const Route = createFileRoute('/')({ component: StudentDashboard })

// ─── Static data ─────────────────────────────────────────────────────────────

const coursesData: CourseItem[] = [
  {
    id: 'biodiversity',
    title: 'Keanekaragaman Hayati',
    subject: 'Biologi Kelas 10',
    teacher: 'Pak Budi, M.Pd.',
    description:
      'Mempelajari keanekaragaman hayati tingkat gen, jenis, dan ekosistem di Indonesia serta upaya pelestarian flora endemik Nusantara.',
    progress: 72,
    totalModules: 4,
    completedModules: 3,
    remainingTime: '28 menit tersisa',
    currentTopic: 'Tingkat Keanekaragaman Hayati',
    lastAccessed: 'Hari ini, 09:15',
    category: 'active',
  },
  {
    id: 'ecology',
    title: 'Ekologi & Ekosistem Tropis',
    subject: 'Biologi Kelas 10',
    teacher: 'Pak Budi, M.Pd.',
    description:
      'Memahami jaring makanan, interaksi simbiosis makhluk hidup, dan siklus biogeokimia di ekosistem hutan hujan tropis.',
    progress: 38,
    totalModules: 5,
    completedModules: 2,
    remainingTime: '55 menit tersisa',
    currentTopic: 'Jaring Makanan & Aliran Energi',
    lastAccessed: 'Kemarin',
    category: 'active',
  },
  {
    id: 'morphology',
    title: 'Morfologi & Anatomi Daun',
    subject: 'Botani Terapan',
    teacher: 'Bu Sri Rahayu, S.Si.',
    description:
      'Eksplorasi susunan jaringan mesofil daun, tipe-tipe stomata, dan adaptasi morfologis tumbuhan xerofit vs hidrofit.',
    progress: 15,
    totalModules: 6,
    completedModules: 1,
    remainingTime: '1 jam 10 menit tersisa',
    currentTopic: 'Struktur Mesofil & Trikoma',
    lastAccessed: '3 hari yang lalu',
    category: 'active',
  },
]

const completedCoursesData: CourseItem[] = [
  {
    id: 'intro-botany',
    title: 'Pengantar Dunia Tumbuhan (Plantae)',
    subject: 'Biologi Dasar',
    teacher: 'Pak Budi, M.Pd.',
    description:
      'Klasifikasi utama regnum Plantae meliputi lumut (Bryophyta), paku (Pteridophyta), dan tumbuhan berbiji (Spermatophyta).',
    progress: 100,
    totalModules: 5,
    completedModules: 5,
    remainingTime: 'Telah tuntas',
    currentTopic: 'Evaluasi Akhir Plantae',
    lastAccessed: '5 Mei 2024',
    category: 'completed',
  },
]

// ─── Page component ───────────────────────────────────────────────────────────

function StudentDashboard() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        {/* Greeting */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit gap-1 text-primary">
              <HugeiconsIcon icon={SparklesIcon} />
              Portal Pembelajaran
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Selamat pagi, Dika! 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Lanjutkan materi yang sedang kamu pelajari dan pantau progres setiap modul.
            </p>
          </div>

          <Link to="/courses/$courseId" params={{ courseId: 'biodiversity' }}>
            <Button className="gap-2 shadow-xs">
              <HugeiconsIcon icon={BookOpen01Icon} data-icon="inline-start" />
              Lanjutkan Belajar
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={BookOpen01Icon} label="Kursus Aktif" value="3 Kursus" detail="Materi yang sedang dipelajari" />
          <StatCard icon={BookOpen01Icon} label="Modul Selesai" value="11 Modul" detail="Dari total 20 modul materi" />
          <StatCard icon={BookOpen01Icon} label="Progress Belajar" value="55%" detail="Rata-rata seluruh kursus" />
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Left — Courses & Level Progression */}
          <div className="flex flex-col gap-6 xl:col-span-2">
            <Tabs defaultValue="in-progress" className="w-full">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Materi Pembelajaran</h2>
                  <p className="text-xs text-muted-foreground">
                    Kelola kursus biologi dan pantau kelulusan modul belajarmu
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="in-progress">
                    Sedang Berjalan ({coursesData.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Telah Selesai ({completedCoursesData.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="in-progress" className="mt-4 flex flex-col gap-4">
                {coursesData.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </TabsContent>

              <TabsContent value="completed" className="mt-4 flex flex-col gap-4">
                {completedCoursesData.map((course) => (
                  <CourseCard key={course.id} course={course} completed />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-col gap-4 xl:col-span-1">
            <StatCard icon={BookOpen01Icon} label="Materi berikutnya" value="Tingkat Keanekaragaman" detail="Lanjutkan dari modul terakhir" />
          </div>
        </div>
      </div>

    </AppShell>
  )
}
