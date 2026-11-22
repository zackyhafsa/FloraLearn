import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Award01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Search01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { AppShell } from '@/components/layout/app-header'
import { CourseCard } from '@/components/dashboard/course-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CourseItem } from '@/types'

export const Route = createFileRoute('/courses/')({ component: CoursesPage })

const allCoursesData: CourseItem[] = [
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

const subjects = ['Semua Topik', 'Biologi Kelas 10', 'Botani Terapan', 'Biologi Dasar']

function CoursesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedSubject, setSelectedSubject] = React.useState('Semua Topik')
  const [activeTab, setActiveTab] = React.useState('all')

  const filteredCourses = React.useMemo(() => {
    return allCoursesData.filter((course) => {
      // Category filter
      if (activeTab === 'active' && course.category !== 'active') return false
      if (activeTab === 'completed' && course.category !== 'completed') return false

      // Subject filter
      if (selectedSubject !== 'Semua Topik' && course.subject !== selectedSubject) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = course.title.toLowerCase().includes(query)
        const matchesSubject = course.subject.toLowerCase().includes(query)
        const matchesTeacher = course.teacher.toLowerCase().includes(query)
        const matchesDesc = course.description.toLowerCase().includes(query)
        return matchesTitle || matchesSubject || matchesTeacher || matchesDesc
      }

      return true
    })
  }, [activeTab, selectedSubject, searchQuery])

  const activeCount = allCoursesData.filter((c) => c.category === 'active').length
  const completedCount = allCoursesData.filter((c) => c.category === 'completed').length

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        {/* Header & Page Title */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-1.5">
            <Badge variant="secondary" className="w-fit gap-1 text-primary">
              <HugeiconsIcon icon={SparklesIcon} />
              Kurikulum Biologi Merdeka
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Kursus Saya
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Jelajahi seluruh materi pembelajaran biologi dan botani. Pantau progres per modul
              dan lanjutkan sesi belajar aktifmu.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen01Icon}
            label="Total Kursus"
            value={`${allCoursesData.length} Kursus`}
            detail={`${activeCount} aktif · ${completedCount} selesai`}
          />
          <StatCard
            icon={CheckmarkCircle02Icon}
            label="Modul Diselesaikan"
            value="11 Modul"
            detail="Dari total 20 modul materi"
          />
          <StatCard
            icon={Clock01Icon}
            label="Waktu Belajar"
            value="4.8 Jam"
            detail="+1.5 jam di minggu ini"
            iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={Award01Icon}
            label="Sertifikat / Capaian"
            value="1 Lulus"
            detail="Pengantar Dunia Tumbuhan"
            iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          />
        </div>

        {/* Search & Filters Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <HugeiconsIcon
                icon={Search01Icon}
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi atau topik kursus..."
                className="pl-9 h-9 text-xs sm:text-sm bg-muted/30"
              />
            </div>

            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Semua ({allCoursesData.length})</TabsTrigger>
                <TabsTrigger value="active">Sedang Berjalan ({activeCount})</TabsTrigger>
                <TabsTrigger value="completed">Telah Selesai ({completedCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium mr-1">Topik:</span>
            {subjects.map((sub) => {
              const active = selectedSubject === sub
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${active
                      ? 'bg-primary text-primary-foreground border-transparent font-medium shadow-xs'
                      : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                    }`}
                >
                  {sub}
                </button>
              )
            })}
          </div>
        </div>

        {/* Course Cards List */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                completed={course.category === 'completed'}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <HugeiconsIcon icon={BookOpen01Icon} size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">Tidak ada kursus ditemukan</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Coba sesuaikan kata kunci pencarian atau ubah filter topik yang dipilih.
              </p>
            </div>
            {(searchQuery || selectedSubject !== 'Semua Topik' || activeTab !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSubject('Semua Topik')
                  setActiveTab('all')
                }}
              >
                Reset Semua Filter
              </Button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
