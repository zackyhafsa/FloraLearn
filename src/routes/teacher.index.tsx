import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Award01Icon,
  Calendar01Icon,
  Camera01Icon,
  CheckmarkCircle02Icon,
  Download01Icon,
  File02Icon,
  PlusSignIcon,
  SparklesIcon,
  Task01Icon,
  TeacherIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { AppShell } from '@/components/layout/app-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { AssignmentManagementCard } from '@/components/teacher/assignment-management-card'
import { ClassSummaryCard } from '@/components/teacher/class-summary-card'
import { PopularSpeciesCard } from '@/components/teacher/popular-species-card'
import { ReviewObservationDialog } from '@/components/teacher/review-observation-dialog'
import { TeacherScheduleCard } from '@/components/teacher/teacher-schedule-card'
import { VerificationQueueCard } from '@/components/teacher/verification-queue-card'

import type {
  PopularSpeciesItem,
  TeacherAssignment,
  TeacherClassSummary,
  TeacherPendingReview,
  TeacherScheduleItem,
} from '@/types'

export const Route = createFileRoute('/teacher/')({
  component: TeacherDashboardPage,
})

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const initialPendingReviews: TeacherPendingReview[] = [
  {
    id: 'rev-01',
    studentName: 'Dika Pratama',
    studentClass: '10 IPA 1',
    plantName: 'Monstera Deliciosa (Janda Bolong)',
    scientificName: 'Monstera deliciosa',
    location: 'Taman Depan Lab Biologi',
    habitType: 'Liana / Hemiepifit',
    notes:
      'Perforasi alami (fenestrasi) pada helai daun tampak simetris. Akar gantung melekat kuat pada batang pohon inang.',
    icon: '🌿',
    submittedAt: '12 menit yang lalu',
    status: 'Menunggu Review',
  },
  {
    id: 'rev-02',
    studentName: 'Siti Nurhaliza',
    studentClass: '10 IPA 1',
    plantName: 'Kembang Sepatu',
    scientificName: 'Hibiscus rosa-sinensis',
    location: 'Halaman Gazebo Perpustakaan',
    habitType: 'Perdu / Semak',
    notes:
      'Bunga tunggal dengan mahkota berwarna merah cerah. Benang sari dan putik bertabung (kolumna) khas famili Malvaceae.',
    icon: '🌺',
    submittedAt: '35 menit yang lalu',
    status: 'Menunggu Review',
  },
  {
    id: 'rev-03',
    studentName: 'Rizky Maulana',
    studentClass: '10 IPA 2',
    plantName: 'Paku Pedang (Pakis Boston)',
    scientificName: 'Nephrolepis exaltata',
    location: 'Area Lembap Belakang Lab Fisika',
    habitType: 'Tumbuhan Paku (Pteridophyta)',
    notes:
      'Sorus tampak berderet rapi di tepi bawah helaian pinna daun fertil. Daun muda menggulung (circinate vernation).',
    icon: '🌱',
    submittedAt: '1 jam yang lalu',
    status: 'Menunggu Review',
  },
]

const initialAssignments: TeacherAssignment[] = [
  {
    id: 't-assign-1',
    title: 'Identifikasi Morfologi Daun Monokotil & Dikotil',
    course: 'Biologi Kelas 10 · Modul 2',
    deadline: '25 Nov 2026 (3 hari lagi)',
    submittedCount: 58,
    totalStudents: 70,
    status: 'active',
  },
  {
    id: 't-assign-2',
    title: 'Koleksi & Pembuatan Spesimen Herbarium Kering',
    course: 'Botani Terapan · Proyek Lapangan',
    deadline: '29 Nov 2026 (7 hari lagi)',
    submittedCount: 32,
    totalStudents: 70,
    status: 'active',
  },
]

const classesData: TeacherClassSummary[] = [
  {
    id: 'cls-1',
    name: 'Kelas 10 IPA 1',
    academicYear: 'Tahun Ajaran 2026/2027 · Semester Ganjil',
    studentCount: 36,
    activeCount: 34,
    averageScore: 89.2,
    specimensFound: 142,
    taskCompletionRate: 94,
    topTaxon: 'Angiospermae (Magnoliophyta)',
  },
  {
    id: 'cls-2',
    name: 'Kelas 10 IPA 2',
    academicYear: 'Tahun Ajaran 2026/2027 · Semester Ganjil',
    studentCount: 34,
    activeCount: 31,
    averageScore: 86.8,
    specimensFound: 118,
    taskCompletionRate: 88,
    topTaxon: 'Pteridophyta & Bryophyta',
  },
]

const scheduleData: TeacherScheduleItem[] = [
  {
    id: 'sch-1',
    time: '07:30 - 09:00',
    title: 'Teori: Klasifikasi & Taksonomi Spermatophyta',
    className: 'Kelas 10 IPA 1',
    location: 'Lab Biologi 1',
    type: 'Teori',
    status: 'selesai',
  },
  {
    id: 'sch-2',
    time: '10:15 - 11:45',
    title: 'Praktikum Lapangan: Identifikasi Flora Taman Sekolah',
    className: 'Kelas 10 IPA 2',
    location: 'Taman Botani Sekolah',
    type: 'Praktikum',
    status: 'berlangsung',
  },
  {
    id: 'sch-3',
    time: '13:00 - 14:15',
    title: 'Asistensi Herbarium Kering & Validasi Laporan',
    className: 'Kelas 10 IPA 1 & IPA 2',
    location: 'Ruang Guru Biologi / Daring',
    type: 'Konsultasi',
    status: 'akan_datang',
  },
]

const popularSpeciesData: PopularSpeciesItem[] = [
  {
    id: 'spec-1',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    family: 'Araceae',
    observationCount: 34,
    icon: '🌿',
    percentage: 28,
  },
  {
    id: 'spec-2',
    name: 'Lidah Mertua',
    scientificName: 'Sansevieria trifasciata',
    family: 'Asparagaceae',
    observationCount: 29,
    icon: '🪴',
    percentage: 24,
  },
  {
    id: 'spec-3',
    name: 'Bunga Kertas',
    scientificName: 'Bougainvillea spectabilis',
    family: 'Nyctaginaceae',
    observationCount: 25,
    icon: '🌺',
    percentage: 20,
  },
  {
    id: 'spec-4',
    name: 'Kembang Sepatu',
    scientificName: 'Hibiscus rosa-sinensis',
    family: 'Malvaceae',
    observationCount: 21,
    icon: '🌸',
    percentage: 16,
  },
  {
    id: 'spec-5',
    name: 'Pisang Kalatea',
    scientificName: 'Calathea lutea',
    family: 'Marantaceae',
    observationCount: 15,
    icon: '🍃',
    percentage: 12,
  },
]

// ─── Component Page ──────────────────────────────────────────────────────────

function TeacherDashboardPage() {
  const [reviews, setReviews] = React.useState<TeacherPendingReview[]>(initialPendingReviews)
  const [selectedReview, setSelectedReview] = React.useState<TeacherPendingReview | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false)
  const [recentNotification, setRecentNotification] = React.useState<string | null>(null)

  const pendingCount = reviews.filter((r) => r.status === 'Menunggu Review').length

  const handleOpenReview = (item: TeacherPendingReview) => {
    setSelectedReview(item)
    setReviewDialogOpen(true)
  }

  const handleSaveReview = (
    id: string,
    status: 'Terverifikasi' | 'Perlu Revisi',
    score: number,
    feedback: string,
  ) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, score, feedback } : item,
      ),
    )
    const verifiedItem = reviews.find((r) => r.id === id)
    if (verifiedItem) {
      setRecentNotification(
        `Observasi "${verifiedItem.plantName}" milik ${verifiedItem.studentName} berhasil ${
          status === 'Terverifikasi' ? 'diverifikasi dengan nilai ' + score : 'diminta revisi'
        }!`,
      )
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Hero Greeting Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-secondary/40 to-background p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 text-xs text-primary font-semibold">
                <HugeiconsIcon icon={TeacherIcon} size={14} />
                Portal Guru Biologi
              </Badge>
              <Badge variant="outline" className="text-xs">
                SMAN 1 FloraLearn · Kurikulum Merdeka
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Selamat Datang, Pak Budi Santoso, M.Pd.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Pantau jalannya praktikum lapangan botani, validasi temuan taksonomi spesimen siswa, dan kelola penilaian terintegrasi.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <HugeiconsIcon icon={Download01Icon} size={15} data-icon="inline-start" />
              Rekap Nilai
            </Button>
            <Button size="sm" className="gap-1.5 text-xs shadow-xs">
              <HugeiconsIcon icon={PlusSignIcon} size={15} data-icon="inline-start" />
              Buat Tugas Praktikum
            </Button>
          </div>
        </div>

        {/* Alert Banner upon Verification */}
        {recentNotification && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-3.5 px-4 text-xs font-medium text-foreground">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-primary" />
              <span>{recentNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setRecentNotification(null)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Stat Cards Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Camera01Icon}
            label="Antrean Verifikasi"
            value={`${pendingCount} Spesimen`}
            detail={pendingCount > 0 ? "Memerlukan validasi guru" : "Semua observasi selesai dinilai"}
            iconClassName={pendingCount > 0 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-primary/10 text-primary"}
            detailClassName={pendingCount > 0 ? "text-amber-600 dark:text-amber-400 font-semibold" : undefined}
          />
          <StatCard
            icon={UserGroupIcon}
            label="Total Siswa Bimbingan"
            value="70 Siswa"
            detail="2 rombel (10 IPA 1 & 10 IPA 2)"
          />
          <StatCard
            icon={Task01Icon}
            label="Tugas Praktikum Berjalan"
            value="2 Modul"
            detail="Rata-rata ketuntasan 91%"
          />
          <StatCard
            icon={Award01Icon}
            label="Rata-rata Skor Observasi"
            value="88.0 / 100"
            detail="Kualitas morfologi Sangat Baik (A)"
          />
        </div>

        {/* Main Grid: Left (Actions/Review & Classes) - Right (Schedule & Stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Student Observation Verification Queue */}
            <VerificationQueueCard
              items={reviews}
              onSelectReview={handleOpenReview}
            />

            {/* Practical Task & Assignment Management */}
            <AssignmentManagementCard assignments={initialAssignments} />

            {/* Class Summary / Cohorts */}
            <ClassSummaryCard classes={classesData} />
          </div>

          {/* Side Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Today's Schedule */}
            <TeacherScheduleCard schedule={scheduleData} />

            {/* Popular Flora Leaderboard */}
            <PopularSpeciesCard items={popularSpeciesData} />

            {/* Quick Actions & Guidance Card */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HugeiconsIcon icon={SparklesIcon} size={15} />
                  </div>
                  <CardTitle className="text-sm font-semibold">Pusat Bantuan Penilaian</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Panduan rubrik penilaian morfologi botani SMA
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 gap-2">
                  <HugeiconsIcon icon={File02Icon} size={14} className="text-muted-foreground" />
                  Rubrik Penilaian Herbarium Kering
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 gap-2">
                  <HugeiconsIcon icon={File02Icon} size={14} className="text-muted-foreground" />
                  Kunci Determinasi Tumbuhan Spermatophyta
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 gap-2">
                  <HugeiconsIcon icon={Download01Icon} size={14} className="text-muted-foreground" />
                  Template Lembar Kerja Siswa (LKS)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal Dialog for Specimen Assessment */}
        <ReviewObservationDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          observation={selectedReview}
          onSaveReview={handleSaveReview}
        />
      </div>
    </AppShell>
  )
}
