import { createFileRoute } from '@tanstack/react-router'
import { BookOpen01Icon, CheckmarkCircle02Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { AppShell } from '@/components/layout/app-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/teacher/')({ component: TeacherDashboard })

function TeacherDashboard() {
  return <AppShell><div className="mx-auto flex max-w-7xl flex-col gap-8"><div><Badge variant="secondary" className="mb-2 text-amber-600">Portal Guru</Badge><h1 className="text-3xl font-bold tracking-tight">Dashboard Guru</h1><p className="mt-2 text-sm text-muted-foreground">Kelola materi dan pantau perkembangan siswa.</p></div><div className="grid gap-4 md:grid-cols-3"><Stat icon={UserGroupIcon} label="Total siswa" value="32" detail="Dalam 2 kelas" /><Stat icon={BookOpen01Icon} label="Modul aktif" value="8" detail="3 course berjalan" /><Stat icon={CheckmarkCircle02Icon} label="Materi diterbitkan" value="24" detail="Semester ini" /></div><Card><CardContent className="p-6"><h2 className="font-semibold">Modul ajar terbaru</h2><p className="mt-2 text-sm text-muted-foreground">Keanekaragaman Hayati · Modul 2 sedang digunakan oleh 28 siswa.</p></CardContent></Card></div></AppShell>
}

function Stat({ icon, label, value, detail }: { icon: typeof UserGroupIcon; label: string; value: string; detail: string }) { return <Card><CardContent className="flex items-center gap-4 p-5"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><HugeiconsIcon icon={icon} /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{detail}</p></div></CardContent></Card> }
