import * as React from 'react'
import {
  Award01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Notification01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
  type: 'verification' | 'task' | 'achievement'
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Materi Baru Tersedia',
    description: 'Modul Keanekaragaman Hayati siap dipelajari di portal siswa.',
    time: '15 menit yang lalu',
    unread: true,
    type: 'verification',
  },
  {
    id: 'n-2',
    title: 'Pengingat Quiz Evaluasi',
    description: 'Selesaikan quiz evaluasi setelah membaca materi dokumen.',
    time: '1 jam yang lalu',
    unread: true,
    type: 'task',
  },
  {
    id: 'n-3',
    title: 'Streak 5 Hari Beruntun',
    description: 'Pertahankan konsistensi belajarmu setiap hari.',
    time: 'Kemarin',
    unread: false,
    type: 'achievement',
  },
]

const ICON_MAP = {
  verification: {
    icon: CheckmarkCircle02Icon,
    style: 'bg-primary/15 text-primary',
  },
  task: {
    icon: Clock01Icon,
    style: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  achievement: {
    icon: Award01Icon,
    style: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  },
} as const

export function NotificationsNav() {
  const [notifications, setNotifications] = React.useState(initialNotifications)
  const unreadCount = notifications.filter((n) => n.unread).length

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Buka notifikasi"
          />
        }
      >
        <HugeiconsIcon icon={Notification01Icon} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2 shadow-xl border border-border">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">Notifikasi</span>
            {unreadCount > 0 ? (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 text-primary">
                {unreadCount} Baru
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 text-muted-foreground">
                Semua Dibaca
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] text-primary hover:underline font-medium"
            >
              Tandai dibaca
            </button>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="flex flex-col gap-1 my-1 max-h-72 overflow-y-auto">
          {notifications.map((item) => {
            const meta = ICON_MAP[item.type]
            return (
              <DropdownMenuItem
                key={item.id}
                className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer ${
                  item.unread ? 'bg-primary/5 hover:bg-primary/10' : ''
                }`}
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg mt-0.5 ${meta.style}`}
                >
                  <HugeiconsIcon icon={meta.icon} size={14} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                    {item.unread && <span className="size-1.5 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 mt-1">{item.time}</p>
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
