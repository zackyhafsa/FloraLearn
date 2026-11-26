import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen01Icon, Settings01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { AppShell } from '@/components/layout/app-header'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCourses } from '@/hooks/use-course-store'
import { useUsers } from '@/hooks/use-user-store'

export const Route = createFileRoute('/admin/')({ component: AdminDashboard })

function AdminDashboard() {
  const courses = useCourses()
  const users = useUsers()
  const publishedCount = courses.filter((c) => c.status === 'Terbit').length

  return (
    <AppShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div>
          <Badge variant="secondary" className="mb-2 text-violet-600 dark:text-violet-400">
            Portal Admin
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Pantau pengguna, course aktif, dan status platform EkoStream.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={UserGroupIcon}
            label="Total Pengguna"
            value={`${users.length} Akun`}
            detail={`${users.filter((user) => user.status === 'Aktif').length} akun aktif`}
          />
          <StatCard
            icon={BookOpen01Icon}
            label="Course Terdaftar"
            value={`${courses.length} Course`}
            detail={`${publishedCount} terbit · ${courses.length - publishedCount} draft`}
          />
          <StatCard
            icon={Settings01Icon}
            label="Status Platform"
            value="Normal"
            detail="Penyimpanan lokal browser aktif"
          />
        </div>

        <div className="flex justify-end">
          <Link to="/admin/users" className={buttonVariants()}>
            <HugeiconsIcon icon={UserGroupIcon} data-icon="inline-start" />
            Kelola Pengguna
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold">Aktivitas Sistem</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Platform berjalan normal. Seluruh alur materi PDF dan quiz antara Guru dan Siswa
              telah tersinkron melalui penyimpanan lokal.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
