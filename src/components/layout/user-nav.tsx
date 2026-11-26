import * as React from 'react'
import {
  Logout01Icon,
  Moon02Icon,
  Sun01Icon,
  UserSettings01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getSession, logout, type UserRole } from '@/lib/auth'

const ROLE_CONFIGS: Record<
  UserRole,
  { name: string; email: string; roleLabel: string; initial: string; badge: string }
> = {
  student: {
    name: 'Dika Pratama',
    email: 'dika.pratama@siswa.ekostream.id',
    roleLabel: 'Siswa Kelas 10 IPA 1',
    initial: 'DP',
    badge: 'Siswa',
  },
  teacher: {
    name: 'Pak Budi Santoso, M.Pd.',
    email: 'budi.santoso@guru.ekostream.id',
    roleLabel: 'Guru Pengampu Biologi',
    initial: 'BS',
    badge: 'Guru',
  },
  admin: {
    name: 'Admin Kurikulum',
    email: 'admin@sekolah.ekostream.id',
    roleLabel: 'Administrator Sekolah',
    initial: 'AK',
    badge: 'Admin',
  },
}

export function UserNav() {
  const session = getSession()
  const role: UserRole = session?.role ?? 'student'
  const roleConfig = ROLE_CONFIGS[role]
  const user = {
    ...roleConfig,
    name: session?.name ?? roleConfig.name,
    email: session?.email ?? roleConfig.email,
    roleLabel:
      role === 'student'
        ? `Siswa${session?.className ? ` Kelas ${session.className}` : ''}`
        : role === 'teacher'
          ? session?.subject ?? roleConfig.roleLabel
          : roleConfig.roleLabel,
    initial:
      session?.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('') ?? roleConfig.initial,
  }

  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  function toggleTheme() {
    const nextDark = !isDarkMode
    setIsDarkMode(nextDark)
    document.documentElement.classList.toggle('dark', nextDark)
    localStorage.setItem('ekostream_theme', nextDark ? 'dark' : 'light')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl p-1 text-left transition-colors hover:bg-muted/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring select-none"
          />
        }
      >
        <div className="hidden text-right md:block">
          <p className="text-sm font-semibold leading-tight text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.roleLabel}</p>
        </div>
        <Avatar size="default">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {user.initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border border-border">
        <div className="flex items-center gap-3 p-2">
          <Avatar size="default">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {user.initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-foreground leading-none">
                {user.name}
              </p>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                {user.badge}
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer gap-2">
            <HugeiconsIcon
              icon={isDarkMode ? Sun01Icon : Moon02Icon}
              size={16}
              className="text-muted-foreground"
            />
            <span className="text-xs flex-1">
              {isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            </span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
              {isDarkMode ? 'Dark' : 'Light'}
            </Badge>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2">
            <HugeiconsIcon icon={UserSettings01Icon} size={16} className="text-muted-foreground" />
            <span className="text-xs">Pengaturan Akun & Profil</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer gap-2"
          onClick={() => {
            logout()
            window.location.href = '/login'
          }}
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} />
          <span className="text-xs">Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
