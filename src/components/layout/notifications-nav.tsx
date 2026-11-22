import * as React from 'react'
import {
  Award01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Notification01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
    title: 'Observasi Terverifikasi! 🎉',
    description: 'Pak Budi memverifikasi temuan Pucuk Merah (Syzygium myrtifolium). Nilai: A.',
    time: '15 menit yang lalu',
    unread: true,
    type: 'verification',
  },
  {
    id: 'n-2',
    title: 'Pengingat Tenggat Tugas ⏰',
    description: 'Tugas "Identifikasi Stomata Daun Rhoeo discolor" dikumpulkan besok pukul 14:00.',
    time: '1 jam yang lalu',
    unread: true,
    type: 'task',
  },
  {
    id: 'n-3',
    title: 'Pencapaian Baru Terbuka! 🏅',
    description: 'Kamu meraih lencana "Streak 5 Hari Beruntun". +40 XP ditambahkan ke profilmu.',
    time: 'Kemarin',
    unread: false,
    type: 'achievement',
  },
]

export function NotificationsNav() {
  const [notifications, setNotifications] = React.useState(initialNotifications)

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllAsRead = () => {
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
          {notifications.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer ${
                item.unread ? 'bg-primary/5 hover:bg-primary/10' : ''
              }`}
            >
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
                  item.type === 'verification'
                    ? 'bg-primary/15 text-primary'
                    : item.type === 'task'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
                }`}
              >
                {item.type === 'verification' && <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />}
                {item.type === 'task' && <HugeiconsIcon icon={Clock01Icon} size={14} />}
                {item.type === 'achievement' && <HugeiconsIcon icon={Award01Icon} size={14} />}
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
          ))}
        </div>

        <DropdownMenuSeparator />

        <div className="p-1">
          <Button variant="ghost" size="sm" className="w-full text-xs h-7">
            Lihat Riwayat Aktivitas Lengkap
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
