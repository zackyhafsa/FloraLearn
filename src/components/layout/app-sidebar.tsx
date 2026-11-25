import { BookOpen01Icon, Home01Icon, Leaf01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Link, useLocation } from '@tanstack/react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getSession } from '@/lib/auth'

type NavItem = {
  label: string
  icon: IconSvgElement
  to: '/student' | '/student/courses' | '/teacher' | '/teacher/module'
}

const studentItems: NavItem[] = [
  { label: 'Beranda Siswa', icon: Home01Icon, to: '/student' },
  { label: 'Kursus Saya', icon: BookOpen01Icon, to: '/student/courses' },
]

const teacherItems: NavItem[] = [
  { label: 'Ringkasan Utama', icon: Home01Icon, to: '/teacher' },
  { label: 'Modul Ajar & Quiz', icon: BookOpen01Icon, to: '/teacher/module' },
]

function AppBrand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
        <HugeiconsIcon icon={Leaf01Icon} size={20} />
      </span>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-foreground leading-none">
          FloraLearn
        </span>
        <span className="mt-0.5 text-[11px] text-muted-foreground">
          Portal Pembelajaran Botani
        </span>
      </div>
    </div>
  )
}

export function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  const location = useLocation()
  const teacher = getSession()?.role === 'teacher' || location.pathname.startsWith('/teacher')
  const items = teacher ? teacherItems : studentItems

  return (
    <div className="flex flex-col gap-3">
      <div className="px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {teacher ? 'Navigasi Portal Guru' : 'Navigasi Portal Siswa'}
        </span>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Navigasi Utama">
        {items.map((item) => {
          const active = teacher
            ? item.to === '/teacher'
              ? location.pathname === '/teacher'
              : location.pathname.startsWith(item.to)
            : item.to === '/student'
              ? location.pathname === '/student'
              : location.pathname.startsWith('/student/courses')

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
        <p className="truncate text-xs font-semibold text-foreground">{user?.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {user?.role === 'teacher' ? 'Guru Pengampu Biologi' : 'Kelas 10 IPA 1'}
        </p>
      </div>
      <Badge variant="secondary" className="shrink-0 text-[10px]">
        {user?.role === 'teacher' ? 'Guru' : 'Siswa'}
      </Badge>
    </div>
  )
}

export function AppSidebar() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <AppBrand />
        <Separator />
        <SidebarNav />
      </div>
      <SidebarProfileCard />
    </>
  )
}

export default AppSidebar
