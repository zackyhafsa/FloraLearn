import {
  Award01Icon,
  BookOpen01Icon,
  Camera01Icon,
  CheckmarkCircle02Icon,
  Home01Icon,
  Leaf01Icon,
  TeacherIcon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Link, useLocation } from '@tanstack/react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavLinkItem {
  label: string
  icon: IconSvgElement
  to?: string
  params?: Record<string, string>
}

// ─── Nav Configurations ──────────────────────────────────────────────────────

const studentNavItems: NavLinkItem[] = [
  { label: 'Beranda Siswa', icon: Home01Icon, to: '/' },
  { label: 'Kursus Saya', icon: BookOpen01Icon, to: '/courses' },
  { label: 'Peringkat & Prestasi', icon: Award01Icon, to: '/achievements' },
  { label: 'Portal Guru (Beralih)', icon: TeacherIcon, to: '/teacher' },
]

const teacherNavItems: NavLinkItem[] = [
  { label: 'Dashboard Guru', icon: TeacherIcon, to: '/teacher' },
  { label: 'Katalog Pembelajaran', icon: BookOpen01Icon, to: '/courses' },
  { label: 'Peringkat Siswa', icon: Award01Icon, to: '/achievements' },
  { label: 'Portal Siswa (Pratinjau)', icon: UserIcon, to: '/' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

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
        <span className="text-[11px] text-muted-foreground mt-0.5">
          Portal Pembelajaran Botani
        </span>
      </div>
    </div>
  )
}

function SidebarCallout({ isTeacher }: { isTeacher: boolean }) {
  if (isTeacher) {
    return (
      <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
          </span>
          <p className="text-xs font-semibold text-foreground">Verifikasi Spesimen</p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Terdapat laporan observasi baru dari siswa yang siap divalidasi dan diberi penilaian.
        </p>
        <Button
          size="sm"
          className="w-full text-xs gap-1.5 shadow-xs"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
          <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
          Periksa Antrean
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HugeiconsIcon icon={Camera01Icon} size={16} />
        </span>
        <p className="text-xs font-semibold text-foreground">Jelajah Tanaman Sekitar</p>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Temukan dan identifikasi tanaman di sekitarmu untuk mengumpulkan XP penjelajah.
      </p>
      <Button
        size="sm"
        className="w-full text-xs gap-1.5 shadow-xs"
        onClick={() => window.dispatchEvent(new CustomEvent('open-observation-dialog'))}
      >
        <HugeiconsIcon icon={Camera01Icon} data-icon="inline-start" />
        Mulai Observasi
      </Button>
    </div>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  const location = useLocation()
  const isTeacher = location.pathname.startsWith('/teacher')
  const items = isTeacher ? teacherNavItems : studentNavItems

  return (
    <nav className="flex flex-col gap-1" aria-label="Navigasi Utama">
      {items.map((item) =>
        item.to ? (
          <Link
            key={item.label}
            to={item.to as '/'}
            params={item.params}
            onClick={onItemClick}
            activeProps={{ className: 'bg-secondary text-secondary-foreground font-semibold' }}
            inactiveProps={{
              className:
                'text-muted-foreground hover:bg-muted hover:text-foreground',
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          >
            <HugeiconsIcon icon={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        ) : (
          <button
            key={item.label}
            type="button"
            onClick={onItemClick}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon icon={item.icon} size={18} />
            <span>{item.label}</span>
          </button>
        ),
      )}
    </nav>
  )
}

export function SidebarProfileCard() {
  const location = useLocation()
  const isTeacher = location.pathname.startsWith('/teacher')

  if (isTeacher) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-3">
        <Avatar size="default">
          <AvatarFallback className="bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs">
            BS
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground">Pak Budi Santoso, M.Pd.</p>
          <p className="truncate text-[11px] text-muted-foreground">Guru Pengampu Biologi</p>
        </div>
        <Badge variant="secondary" className="text-[10px] shrink-0 text-amber-600 dark:text-amber-400">
          Guru
        </Badge>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-3">
      <Avatar size="default">
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
          DP
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">Dika Pratama</p>
        <p className="truncate text-[11px] text-muted-foreground">Kelas 10 IPA 1</p>
      </div>
      <Badge variant="secondary" className="text-[10px] shrink-0">
        Lv. 4
      </Badge>
    </div>
  )
}

/** Full sidebar — renders brand, nav, callout, and profile. */
export function AppSidebar() {
  const location = useLocation()
  const isTeacher = location.pathname.startsWith('/teacher')

  return (
    <>
      <div className="flex flex-col gap-6">
        <AppBrand />
        <Separator />
        <SidebarNav />
        <SidebarCallout isTeacher={isTeacher} />
      </div>
      <SidebarProfileCard />
    </>
  )
}
