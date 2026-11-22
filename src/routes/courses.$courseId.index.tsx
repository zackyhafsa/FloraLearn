import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { CourseAssignmentCard } from '@/components/course/course-assignment-card'
import { CourseBanner } from '@/components/course/course-banner'
import { CourseProgressCard } from '@/components/course/course-progress-card'
import { ModuleList } from '@/components/course/module-list'
import type { ModuleItem } from '@/types'

export const Route = createFileRoute('/courses/$courseId/')({ component: CourseDetail })

const courseDetailsData = {
  biodiversity: {
    id: 'biodiversity',
    title: 'Keanekaragaman Hayati',
    subject: 'Biologi Kelas 10',
    teacher: 'Pak Budi, M.Pd.',
    description:
      'Kenali kekayaan flora dan fauna Indonesia, pahami tingkat keanekaragaman genetik, serta peran aktifmu dalam pelestarian alam.',
    duration: '1 jam 14 menit',
    progress: 72,
    activeModuleId: 'levels',
    modules: [
      { id: 'intro', title: 'Pengantar Keanekaragaman Hayati', duration: '12 menit', status: 'done' },
      { id: 'levels', title: 'Tingkat Keanekaragaman Hayati', duration: '18 menit', status: 'active' },
      { id: 'species', title: 'Flora dan Fauna Indonesia', duration: '24 menit', status: 'locked' },
      { id: 'conservation', title: 'Ancaman dan Pelestarian', duration: '20 menit', status: 'locked' },
    ] as ModuleItem[],
    assignment: {
      title: 'Tugas Praktikum Lapangan',
      description: 'Amati satu tanaman di sekitarmu dan catat deskripsi morfologinya di lembar kerja observasi.',
      deadline: 'Besok, 14:00',
    },
  },
}

function CourseDetail() {
  const { courseId } = Route.useParams()
  const course = courseDetailsData[courseId as keyof typeof courseDetailsData] || courseDetailsData.biodiversity

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-8">
          <Link
            to="/courses"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Kembali ke daftar kursus
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 flex flex-col gap-8">
        <CourseBanner
          subject={course.subject}
          teacher={course.teacher}
          title={course.title}
          description={course.description}
          totalModules={course.modules.length}
          duration={course.duration}
          progress={course.progress}
        />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <ModuleList courseId={course.id} modules={course.modules} />

          <aside className="flex flex-col gap-4">
            <CourseProgressCard
              progress={course.progress}
              courseId={course.id}
              activeModuleId={course.activeModuleId}
              statusNote="Sedikit lagi menuju evaluasi akhir bab keanekaragaman hayati!"
            />

            <CourseAssignmentCard
              title={course.assignment.title}
              description={course.assignment.description}
              deadline={course.assignment.deadline}
              urgency="urgent"
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
