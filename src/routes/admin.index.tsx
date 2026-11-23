import { createFileRoute } from '@tanstack/react-router'
import { BookOpen01Icon, Settings01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { AppShell } from '@/components/layout/app-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/admin/')({ component: AdminDashboard })

function AdminDashboard() {
  return <AppShell><div className="mx-auto flex max-w-7xl flex-col gap-8"><div><Badge variant="secondary" className="mb-2 text-violet-600">Portal Admin</Badge><h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1><p className="mt-2 text-sm text-muted-foreground">Kelola pengguna dan konfigurasi platform FloraLearn.</p></div><div className="grid gap-4 md:grid-cols-3"><Stat icon={UserGroupIcon} label="Total pengguna" value="148" detail="120 siswa · 28 guru" /><Stat icon={BookOpen01Icon} label="Course aktif" value="12" detail="Seluruh sekolah" /><Stat icon={Settings01Icon} label="Status platform" value="Normal" detail="Semua layanan aktif" /></div><Card><CardContent className="p-6"><h2 className="font-semibold">Aktivitas sistem</h2><p className="mt-2 text-sm text-muted-foreground">Platform berjalan normal. Pengelolaan user dan course siap digunakan.</p></CardContent></Card></div></AppShell>
}

function Stat({ icon, label, value, detail }: { icon: typeof UserGroupIcon; label: string; value: string; detail: string }) { return <Card><CardContent className="flex items-center gap-4 p-5"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><HugeiconsIcon icon={icon} /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{detail}</p></div></CardContent></Card> }
