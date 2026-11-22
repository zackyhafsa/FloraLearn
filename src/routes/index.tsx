import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Award01Icon,
  BookOpen01Icon,
  Camera01Icon,
  SparklesIcon,
  Task01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AppShell } from '@/components/layout/app-header'
import { CourseCard } from '@/components/dashboard/course-card'
import { CreateObservationDialog } from '@/components/dashboard/create-observation-dialog'
import { ObservationsCard } from '@/components/dashboard/observations-card'
import { SpeciesSpotlight } from '@/components/dashboard/species-spotlight'
import { StatCard } from '@/components/dashboard/stat-card'
import { TasksCard } from '@/components/dashboard/tasks-card'
import { TeacherFeedbackCard } from '@/components/dashboard/teacher-feedback-card'
import { XpLevelCard } from '@/components/dashboard/xp-level-card'

import type { CourseItem, ObservationItem, TaskItem } from '@/types'

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

const initialObservationsData: ObservationItem[] = [
  {
    id: 'obs-1',
    name: 'Pucuk Merah',
    scientificName: 'Syzygium myrtifolium',
    status: 'Terverifikasi',
    date: 'Hari ini, 08:30',
    location: 'Taman Depan Sekolah',
    icon: '🌿',
  },
  {
    id: 'obs-2',
    name: 'Kembang Sepatu',
    scientificName: 'Hibiscus rosa-sinensis',
    status: 'Menunggu Review',
    date: 'Kemarin, 15:45',
    location: 'Halaman Rumah',
    icon: '🌺',
  },
  {
    id: 'obs-3',
    name: 'Lidah Mertua',
    scientificName: 'Sansevieria trifasciata',
    status: 'Terverifikasi',
    date: '12 Mei 2024',
    location: 'Area Koridor Lab Biologi',
    icon: '🪴',
  },
  {
    id: 'obs-4',
    name: 'Paku Sarang Burung',
    scientificName: 'Asplenium nidus',
    status: 'Terverifikasi',
    date: '08 Mei 2024',
    location: 'Pohon Peneduh Parkiran',
    icon: '🍃',
  },
]

const upcomingTasksData: TaskItem[] = [
  {
    id: 't-1',
    title: 'Identifikasi Stomata Daun Rhoeo discolor',
    course: 'Praktikum Anatomi Daun',
    deadline: 'Besok, 14:00',
    urgency: 'urgent',
    badgeLabel: 'Tenggat Besok',
  },
  {
    id: 't-2',
    title: 'Koleksi 5 Spesies Paku-Pakuan (Pteridophyta)',
    course: 'Observasi Lapangan Mandiri',
    deadline: 'Jumat, 23:59',
    urgency: 'normal',
    badgeLabel: 'H-4',
  },
]

// ─── Page component ───────────────────────────────────────────────────────────

function StudentDashboard() {
  const [observations, setObservations] = React.useState<ObservationItem[]>(initialObservationsData)
  const [isObservationDialogOpen, setIsObservationDialogOpen] = React.useState(false)

  const handleAddObservation = (newObs: ObservationItem) => {
    setObservations((prev) => [newObs, ...prev])
  }

  const verifiedCount = observations.filter((o) => o.status === 'Terverifikasi').length
  const pendingCount = observations.filter((o) => o.status === 'Menunggu Review').length

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        {/* Greeting */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit gap-1 text-primary">
              <HugeiconsIcon icon={SparklesIcon} />
              Naturalis Muda · Level 4
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Selamat pagi, Dika! 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Lanjutkan eksplorasi materi keanekaragaman hayati, periksa tugas praktikum yang
              mendekati batas waktu, atau catat observasi flora baru hari ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              className="gap-2 shadow-xs"
              onClick={() => setIsObservationDialogOpen(true)}
            >
              <HugeiconsIcon icon={Camera01Icon} data-icon="inline-start" />
              Observasi Tanaman
            </Button>
            <Link to="/courses/$courseId" params={{ courseId: 'biodiversity' }}>
              <Button variant="outline" className="gap-2">
                <HugeiconsIcon icon={BookOpen01Icon} data-icon="inline-start" />
                Lanjutkan Belajar
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen01Icon}
            label="Kursus Aktif"
            value="3 Kursus"
            detail="1 kursus mendekati rampung (72%)"
          />
          <StatCard
            icon={Camera01Icon}
            label="Koleksi Herbarium"
            value={`${observations.length} Spesies`}
            detail={`${verifiedCount} terverifikasi · ${pendingCount} menunggu review`}
          />
          <StatCard
            icon={Task01Icon}
            label="Tugas & Praktikum"
            value="2 Menunggu"
            detail="Tenggat terdekat besok, 14:00"
            iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            detailClassName="text-amber-600 dark:text-amber-400 font-medium"
          />
          <StatCard
            icon={Award01Icon}
            label="Poin Penjelajah"
            value="1.240 XP"
            detail="Peringkat 4 di kelas · +140 XP pekan ini"
            iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          />
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Left — Courses & Level Progression */}
          <div className="flex flex-col gap-6 xl:col-span-2">
            {/* Gamification Level Progress Card */}
            <XpLevelCard />

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

          {/* Right — Activity, Feedback & Spotlight */}
          <div className="flex flex-col gap-6 xl:col-span-1">
            <TeacherFeedbackCard />
            <TasksCard tasks={upcomingTasksData} />
            <ObservationsCard
              observations={observations}
              onAddClick={() => setIsObservationDialogOpen(true)}
            />
            <SpeciesSpotlight
              tags={['Flora Langka Endemik', 'Karnivora']}
              commonName="Kantong Semar"
              scientificName="Nepenthes ampullaria"
              description="Berbeda dari kerabatnya yang memakan serangga terbang, spesies ini beradaptasi mencerna serasah daun gugur di lantai rawa gambut tropis."
              learnMoreLabel="Pelajari taksonomi Nepenthes →"
            />
          </div>
        </div>
      </div>

      {/* Observation Dialog */}
      <CreateObservationDialog
        open={isObservationDialogOpen}
        onOpenChange={setIsObservationDialogOpen}
        onAddObservation={handleAddObservation}
      />
    </AppShell>
  )
}
