import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Award01Icon,
  BookOpen01Icon,
  Camera01Icon,
  CheckmarkCircle02Icon,
  Leaf01Icon,
  StarIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { AppShell } from '@/components/layout/app-header'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/achievements')({ component: Achievements })

const earned = [
  { icon: Leaf01Icon, title: 'Penjelajah Pemula', text: 'Kirim observasi tanaman pertama', date: '12 Mei 2024', tone: 'bg-primary/10 text-primary' },
  { icon: BookOpen01Icon, title: 'Rajin Belajar', text: 'Selesaikan 2 modul course', date: '10 Mei 2024', tone: 'bg-blue-500/10 text-blue-600' },
  { icon: StarIcon, title: 'Konsisten', text: 'Belajar 7 hari berturut-turut', date: '5 Mei 2024', tone: 'bg-amber-500/10 text-amber-600' },
]

const targets = [
  { icon: Camera01Icon, title: 'Pengamat Teliti', text: 'Dapatkan 5 observasi tervalidasi', progress: 60, label: '3 dari 5 observasi' },
  { icon: Award01Icon, title: 'Penjaga Keanekaragaman', text: 'Temukan 10 spesies berbeda', progress: 40, label: '4 dari 10 spesies' },
]

function Achievements() {
  return <AppShell><div className="mx-auto flex max-w-7xl flex-col gap-8">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="flex flex-col gap-1.5"><Badge variant="secondary" className="w-fit gap-1 text-primary"><HugeiconsIcon icon={Award01Icon} /> Perkembangan siswa</Badge><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Peringkat & Prestasi</h1><p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">Lihat pencapaianmu, pantau target berikutnya, dan terus bangun kebiasaan belajar yang baik.</p></div>
      <Link to="/" className={buttonVariants({ variant: 'outline' })}>Kembali ke beranda</Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-3"><Summary icon={StarIcon} label="Total poin" value="1.240 XP" detail="+140 XP pekan ini" /><Summary icon={Award01Icon} label="Lencana diperoleh" value="3" detail="2 target berikutnya" /><Summary icon={CheckmarkCircle02Icon} label="Course selesai" value="2" detail="3 course sedang berjalan" /></div>
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="flex flex-col gap-4"><div><h2 className="text-lg font-semibold">Lencana yang diperoleh</h2><p className="mt-1 text-sm text-muted-foreground">Koleksi pencapaian dari aktivitas belajarmu.</p></div><div className="grid gap-4 sm:grid-cols-2">{earned.map((item) => <Card key={item.title} className="shadow-xs"><CardContent className="flex gap-4 p-5"><div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${item.tone}`}><HugeiconsIcon icon={item.icon} /></div><div className="min-w-0"><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-sm leading-5 text-muted-foreground">{item.text}</p><p className="mt-3 text-xs text-muted-foreground">Diperoleh {item.date}</p></div></CardContent></Card>)}</div></section>
      <section className="flex flex-col gap-4"><div><h2 className="text-lg font-semibold">Target berikutnya</h2><p className="mt-1 text-sm text-muted-foreground">Selesaikan tantangan untuk membuka lencana.</p></div><Card className="shadow-xs"><CardHeader><CardTitle className="text-base">Lencana yang belum terbuka</CardTitle><CardDescription>Progress menuju pencapaian berikutnya.</CardDescription></CardHeader><CardContent className="flex flex-col gap-5">{targets.map((item) => <div key={item.title} className="flex flex-col gap-3"><div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><HugeiconsIcon icon={item.icon} /></div><div className="min-w-0"><p className="font-medium">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.text}</p></div></div><div className="flex items-center gap-3"><Progress value={item.progress} className="h-2" /><span className="shrink-0 text-xs font-medium text-muted-foreground">{item.label}</span></div></div>)}</CardContent></Card><Card className="border-primary/20 bg-primary/5 shadow-xs"><CardContent className="flex items-center gap-4 p-5"><div className="hidden size-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex"><HugeiconsIcon icon={Camera01Icon} /></div><div className="min-w-0 flex-1"><p className="font-semibold">Temukan tanaman baru</p><p className="mt-1 text-sm text-muted-foreground">Kirim observasi untuk menambah XP.</p></div><Button size="sm">Mulai</Button></CardContent></Card></section>
    </div><Separator /><p className="text-xs text-muted-foreground">Poin diperbarui setelah aktivitas selesai dan observasi tervalidasi guru.</p>
  </div></AppShell>
}

function Summary({ icon, label, value, detail }: { icon: typeof StarIcon; label: string; value: string; detail: string }) { return <Card className="shadow-xs"><CardContent className="flex items-center gap-4 p-5"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><HugeiconsIcon icon={icon} /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div></CardContent></Card> }
