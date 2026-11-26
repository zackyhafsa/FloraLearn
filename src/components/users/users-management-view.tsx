import * as React from 'react'
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  Edit02Icon,
  LockKeyIcon,
  Search01Icon,
  Settings01Icon,
  TeacherIcon,
  UserAdd01Icon,
  UserGroupIcon,
  UserIcon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { StatCard } from '@/components/shared/stat-card'
import { StudentProgressDialog } from '@/components/users/student-progress-dialog'
import { UserFormDialog } from '@/components/users/user-form-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePublishedCourses, useStudentProgress } from '@/hooks/use-course-store'
import { useUsers } from '@/hooks/use-user-store'
import { getSession } from '@/lib/auth'
import { computeCourseCompletion } from '@/lib/course-store'
import {
  deleteUser,
  updateUser,
  type UserAccount,
  type UserRole,
} from '@/lib/user-store'

interface UsersManagementViewProps {
  mode: 'admin' | 'teacher'
}

const ROLE_META: Record<UserRole, { label: string; badgeClass: string }> = {
  student: { label: 'Siswa', badgeClass: 'text-primary' },
  teacher: { label: 'Guru', badgeClass: 'text-amber-600 dark:text-amber-400' },
  admin: { label: 'Admin', badgeClass: 'text-violet-600 dark:text-violet-400' },
}

export function UsersManagementView({ mode }: UsersManagementViewProps) {
  const isAdmin = mode === 'admin'
  const allowedRoles: UserRole[] = isAdmin ? ['student', 'teacher', 'admin'] : ['student']
  const currentUserId = getSession()?.id

  const allUsers = useUsers()
  const publishedCourses = usePublishedCourses()

  const [roleFilter, setRoleFilter] = React.useState<'all' | UserRole>(isAdmin ? 'all' : 'student')
  const [classFilter, setClassFilter] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<UserAccount | null>(null)
  const [progressStudent, setProgressStudent] = React.useState<UserAccount | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)

  const scopedUsers = React.useMemo(
    () => (isAdmin ? allUsers : allUsers.filter((u) => u.role === 'student')),
    [allUsers, isAdmin],
  )

  const classes = React.useMemo(() => {
    const set = new Set(
      scopedUsers
        .filter((u) => u.role === 'student' && u.className)
        .map((u) => u.className as string),
    )
    return Array.from(set).sort()
  }, [scopedUsers])

  const filteredUsers = React.useMemo(() => {
    return scopedUsers.filter((user) => {
      if (isAdmin && roleFilter !== 'all' && user.role !== roleFilter) return false
      if (classFilter !== 'all' && user.className !== classFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          (user.identifier ?? '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [scopedUsers, isAdmin, roleFilter, classFilter, searchQuery])

  const studentCount = allUsers.filter((u) => u.role === 'student').length
  const teacherCount = allUsers.filter((u) => u.role === 'teacher').length
  const adminCount = allUsers.filter((u) => u.role === 'admin').length
  const activeCount = scopedUsers.filter((u) => u.status === 'Aktif').length

  function openCreate() {
    setEditingUser(null)
    setFormOpen(true)
  }

  function openEdit(user: UserAccount) {
    setEditingUser(user)
    setFormOpen(true)
  }

  function handleToggleStatus(user: UserAccount) {
    const nextStatus = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
    updateUser(user.id, { status: nextStatus })
    setNotice(`Status akun "${user.name}" diubah menjadi ${nextStatus}.`)
  }

  function handleResetPassword(user: UserAccount) {
    updateUser(user.id, { password: 'ekostream' })
    setNotice(`Kata sandi "${user.name}" direset ke "ekostream".`)
  }

  function handleDelete(user: UserAccount) {
    deleteUser(user.id)
    setNotice(`Akun "${user.name}" berhasil dihapus.`)
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge
            variant="secondary"
            className={`mb-2 ${isAdmin ? 'text-violet-600 dark:text-violet-400' : 'text-amber-600 dark:text-amber-400'}`}
          >
            {isAdmin ? 'Administrasi Pengguna' : 'Manajemen Kelas & Siswa'}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {isAdmin ? 'Kelola Pengguna (Siswa, Guru & Admin)' : 'Data & Kelola Siswa'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isAdmin
              ? 'Tambahkan atau kelola akun siswa, guru, maupun administrator sekolah.'
              : 'Tambahkan akun siswa baru, kelola kelas, dan pantau capaian belajar serta skor quiz.'}
          </p>
        </div>

        <Button onClick={openCreate}>
          <HugeiconsIcon icon={UserAdd01Icon} data-icon="inline-start" />
          {isAdmin ? 'Tambah Pengguna' : 'Tambah Siswa'}
        </Button>
      </div>

      {/* Feedback Banner */}
      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-medium">
          <span className="flex items-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-primary" />
            {notice}
          </span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-muted-foreground hover:text-foreground font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Metrics */}
      {isAdmin ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={UserGroupIcon}
            label="Total Pengguna"
            value={`${allUsers.length} Akun`}
            detail={`${activeCount} akun berstatus aktif`}
          />
          <StatCard
            icon={UserIcon}
            label="Akun Siswa"
            value={`${studentCount} Siswa`}
            detail={`Tersebar di ${classes.length} kelas`}
          />
          <StatCard
            icon={TeacherIcon}
            label="Akun Guru"
            value={`${teacherCount} Guru`}
            detail="Pengampu mata pelajaran"
            iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={Settings01Icon}
            label="Akun Admin"
            value={`${adminCount} Admin`}
            detail="Pengelola sistem sekolah"
            iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={UserGroupIcon}
            label="Total Siswa"
            value={`${scopedUsers.length} Siswa`}
            detail={`${activeCount} akun aktif`}
          />
          <StatCard
            icon={UserIcon}
            label="Rombongan Belajar"
            value={`${classes.length} Kelas`}
            detail={classes.join(' · ') || 'Belum ada kelas'}
          />
          <StatCard
            icon={CheckmarkCircle02Icon}
            label="Kursus Terbit"
            value={`${publishedCourses.length} Course`}
            detail="Acuan progres belajar siswa"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <HugeiconsIcon
              icon={Search01Icon}
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAdmin ? 'Cari nama, email, NISN/NIP...' : 'Cari nama siswa, email, NISN...'
              }
              className="pl-9 h-9 text-xs sm:text-sm bg-muted/30"
            />
          </div>

          {isAdmin && (
            <Tabs
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value as 'all' | UserRole)
                if (value !== 'student' && value !== 'all') setClassFilter('all')
              }}
            >
              <TabsList>
                <TabsTrigger value="all">Semua ({allUsers.length})</TabsTrigger>
                <TabsTrigger value="student">Siswa ({studentCount})</TabsTrigger>
                <TabsTrigger value="teacher">Guru ({teacherCount})</TabsTrigger>
                <TabsTrigger value="admin">Admin ({adminCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {(roleFilter === 'all' || roleFilter === 'student') && classes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium mr-1">Kelas:</span>
            {['all', ...classes].map((cls) => {
              const active = classFilter === cls
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setClassFilter(cls)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-transparent font-medium shadow-xs'
                      : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cls === 'all' ? 'Semua Kelas' : cls}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* List */}
      <Card className="border-border/80 shadow-xs">
        {filteredUsers.length > 0 ? (
          <CardContent className="divide-y divide-border/70 p-0 px-4 sm:px-6">
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isAdmin={isAdmin}
                isSelf={user.id === currentUserId}
                publishedCoursesCount={publishedCourses.length}
                onViewProgress={() => setProgressStudent(user)}
                onEdit={() => openEdit(user)}
                onToggleStatus={() => handleToggleStatus(user)}
                onResetPassword={() => handleResetPassword(user)}
                onDelete={() => handleDelete(user)}
              />
            ))}
          </CardContent>
        ) : (
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Tidak ada akun pengguna yang cocok dengan filter pencarian.
          </CardContent>
        )}
      </Card>

      {/* Single shared lightweight modals */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        allowedRoles={allowedRoles}
        editingUser={editingUser}
        onSaved={(msg) => setNotice(msg)}
      />

      <StudentProgressDialog
        open={Boolean(progressStudent)}
        onOpenChange={(open) => {
          if (!open) setProgressStudent(null)
        }}
        student={progressStudent}
      />
    </div>
  )
}

function UserRow({
  user,
  isAdmin,
  isSelf,
  publishedCoursesCount,
  onViewProgress,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: {
  user: UserAccount
  isAdmin: boolean
  isSelf: boolean
  publishedCoursesCount: number
  onViewProgress: () => void
  onEdit: () => void
  onToggleStatus: () => void
  onResetPassword: () => void
  onDelete: () => void
}) {
  const publishedCourses = usePublishedCourses()
  const progressMap = useStudentProgress(user.role === 'student' ? user.id : '')

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  const avgProgress = React.useMemo(() => {
    if (user.role !== 'student' || publishedCoursesCount === 0) return 0
    const total = publishedCourses.reduce(
      (sum, c) => sum + computeCourseCompletion(user.id, c).percent,
      0,
    )
    return Math.round(total / publishedCourses.length)
  }, [user.id, user.role, publishedCourses, publishedCoursesCount, progressMap])

  const quizAttempts = Object.values(progressMap).flatMap((p) => Object.values(p.quizAttempts))
  const avgQuiz =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : null

  const meta = ROLE_META[user.role]

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar size="default">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <Badge variant="secondary" className={`text-[10px] h-5 px-1.5 ${meta.badgeClass}`}>
              {meta.label}
            </Badge>
            {user.className && (
              <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                {user.className}
              </Badge>
            )}
            <Badge
              variant={user.status === 'Aktif' ? 'outline' : 'destructive'}
              className="text-[10px] h-5 px-1.5"
            >
              {user.status}
            </Badge>
            {isSelf && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                Akun Anda
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground truncate">
            {user.email}
            {user.identifier ? ` · ${user.role === 'student' ? 'NISN' : 'NIP'}: ${user.identifier}` : ''}
            {user.subject ? ` · Mapel: ${user.subject}` : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
        {user.role === 'student' && (
          <div className="flex items-center gap-4">
            <div className="w-28 flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Materi</span>
                <span className="font-semibold">{avgProgress}%</span>
              </div>
              <Progress value={avgProgress} className="h-1.5" />
            </div>
            <div className="text-right min-w-16">
              <p className="text-[10px] text-muted-foreground">Rata-rata Quiz</p>
              <p className="text-xs font-bold text-foreground">
                {avgQuiz !== null ? `${avgQuiz} / 100` : '—'}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {user.role === 'student' && (
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={onViewProgress}>
              <HugeiconsIcon icon={ViewIcon} size={14} data-icon="inline-start" />
              Progres
            </Button>
          )}
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={onEdit}>
            <HugeiconsIcon icon={Edit02Icon} size={14} data-icon="inline-start" />
            Edit
          </Button>
          {isAdmin && !isSelf && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={onToggleStatus}
              >
                {user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onResetPassword}
                title="Reset kata sandi ke 'ekostream'"
                aria-label={`Reset sandi ${user.name}`}
              >
                <HugeiconsIcon icon={LockKeyIcon} size={15} />
              </Button>
            </>
          )}
          {!isSelf && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              onClick={onDelete}
              aria-label={`Hapus ${user.name}`}
            >
              <HugeiconsIcon icon={Delete02Icon} size={15} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
