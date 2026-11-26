import { BookOpen01Icon, Home01Icon, Settings01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Link, useLocation } from '@tanstack/react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getSession, type UserRole } from '@/lib/auth'

type NavRoute =
  | '/student'
  | '/student/courses'
  | '/teacher'
  | '/teacher/module'
  | '/teacher/users'
  | '/admin'
  | '/admin/users'

interface NavItem {
  label: string
  icon: IconSvgElement
  to: NavRoute
  exact?: boolean
}

const NAV_BY_ROLE: Record<UserRole, { heading: string; home: NavRoute; items: NavItem[] }> = {
  student: {
    heading: 'Navigasi Portal Siswa',
    home: '/student',
    items: [
      { label: 'Beranda Siswa', icon: Home01Icon, to: '/student', exact: true },
      { label: 'Kursus Saya', icon: BookOpen01Icon, to: '/student/courses' },
    ],
  },
  teacher: {
    heading: 'Navigasi Portal Guru',
    home: '/teacher',
    items: [
      { label: 'Ringkasan Utama', icon: Home01Icon, to: '/teacher', exact: true },
      { label: 'Modul Ajar & Quiz', icon: BookOpen01Icon, to: '/teacher/module' },
      { label: 'Kelola Siswa', icon: UserGroupIcon, to: '/teacher/users' },
    ],
  },
  admin: {
    heading: 'Navigasi Portal Admin',
    home: '/admin',
    items: [
      { label: 'Dashboard Admin', icon: Settings01Icon, to: '/admin', exact: true },
      { label: 'Kelola Pengguna', icon: UserGroupIcon, to: '/admin/users' },
    ],
  },
}

const ROLE_LABELS: Record<UserRole, { subtitle: string; badge: string }> = {
  student: { subtitle: 'Kelas 10 IPA 1', badge: 'Siswa' },
  teacher: { subtitle: 'Guru Pengampu Biologi', badge: 'Guru' },
  admin: { subtitle: 'Administrator Sekolah', badge: 'Admin' },
}

function resolveActiveRole(pathname: string): UserRole {
  const sessionRole = getSession()?.role
  if (sessionRole) return sessionRole
  if (pathname.startsWith('/teacher')) return 'teacher'
  if (pathname.startsWith('/admin')) return 'admin'
  return 'student'
}

function AppBrand({ homeRoute }: { homeRoute: NavRoute }) {
  return (
    <Link to={homeRoute} className="flex items-center gap-2.5 px-2">
      <div className="flex w-full items-center justify-between">
        <img src="/images/logo.webp" alt="Logo EkoStream" className="h-8 w-8" />
        <img src="/images/logo-title.webp" alt="EkoStream" width={175} height={32} />
      </div>
    </Link>
  )
}

export function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  const location = useLocation()
  const role = resolveActiveRole(location.pathname)
  const { heading, items } = NAV_BY_ROLE[role]

  return (
    <div className="flex flex-col gap-3">
      <div className="px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {heading}
        </span>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Navigasi Utama">
        {items.map((item) => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to)

          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={onItemClick}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-secondary font-semibold text-secondary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <HugeiconsIcon icon={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function SidebarProfileCard() {
  const user = getSession()
  const role: UserRole = user?.role ?? 'student'
  const meta = ROLE_LABELS[role]
  const initials =
    user?.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('') ?? 'FL'

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-3">
      <Avatar size="default">
        <AvatarFallback className="bg-primary/10 font-bold text-xs text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">{user?.name ?? 'Pengguna'}</p>
        <p className="truncate text-[11px] text-muted-foreground">{meta.subtitle}</p>
      </div>
      <Badge variant="secondary" className="shrink-0 text-[10px]">
        {meta.badge}
      </Badge>
    </div>
  )
}

export function AppSidebar() {
  const location = useLocation()
  const role = resolveActiveRole(location.pathname)

  return (
    <>
      <div className="flex flex-col gap-6">
        <AppBrand homeRoute={NAV_BY_ROLE[role].home} />
        <Separator />
        <SidebarNav />
      </div>
      <SidebarProfileCard />
    </>
  )
}

export default AppSidebar
