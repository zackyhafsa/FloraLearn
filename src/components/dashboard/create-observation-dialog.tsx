import * as React from 'react'
import {
  Camera01Icon,
  CheckmarkCircle02Icon,
  Image01Icon,
  Leaf01Icon,
  Location01Icon,
  SparklesIcon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ObservationItem } from '@/types'

interface CreateObservationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddObservation: (observation: ObservationItem) => void
}

const plantIcons = ['🌿', '🌺', '🪴', '🌸', '🍃', '🌾', '🌱', '🌼']

const quickPresets = [
  {
    name: 'Bunga Telang',
    scientificName: 'Clitoria ternatea',
    location: 'Taman Depan Lab Biologi',
    habitType: 'Terna Merambat',
    icon: '🌸',
    notes: 'Mahkota bunga berwarna biru nila khas, daun majemuk berseling.',
  },
  {
    name: 'Putri Malu',
    scientificName: 'Mimosa pudica',
    location: 'Lapangan Upacara Barat',
    habitType: 'Terna Rendah',
    icon: '🌿',
    notes: 'Menunjukkan seismonasti nyata saat disentuh, batang berduri halus.',
  },
  {
    name: 'Sirih Gading',
    scientificName: 'Epipremnum aureum',
    location: 'Pot Gantung Selasar Kelas 10',
    habitType: 'Epifit / Liana',
    icon: '🍃',
    notes: 'Bercak variegata kuning pada helaian daun hijau berbentuk hati.',
  },
]

export function CreateObservationDialog({
  open,
  onOpenChange,
  onAddObservation,
}: CreateObservationDialogProps) {
  const [name, setName] = React.useState('')
  const [scientificName, setScientificName] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [icon, setIcon] = React.useState('🌿')
  const [habitType, setHabitType] = React.useState('Herba / Semak')
  const [notes, setNotes] = React.useState('')
  const [targetCourse, setTargetCourse] = React.useState('Koleksi Herbarium Mandiri')
  const [isSuccess, setIsSuccess] = React.useState(false)

  React.useEffect(() => {
    const handleOpenEvent = () => onOpenChange(true)
    window.addEventListener('open-observation-dialog', handleOpenEvent)
    return () => window.removeEventListener('open-observation-dialog', handleOpenEvent)
  }, [onOpenChange])

  const resetForm = () => {
    setName('')
    setScientificName('')
    setLocation('')
    setIcon('🌿')
    setHabitType('Herba / Semak')
    setNotes('')
    setTargetCourse('Koleksi Herbarium Mandiri')
    setIsSuccess(false)
  }

  const handleApplyPreset = (preset: (typeof quickPresets)[number]) => {
    setName(preset.name)
    setScientificName(preset.scientificName)
    setLocation(preset.location)
    setHabitType(preset.habitType)
    setIcon(preset.icon)
    setNotes(preset.notes)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newObservation: ObservationItem = {
      id: `obs-${Date.now()}`,
      name: name.trim(),
      scientificName: scientificName.trim() || 'Spesies belum teridentifikasi',
      location: location.trim() || 'Lingkungan Sekolah',
      status: 'Menunggu Review',
      date: 'Baru saja',
      icon,
      habitType,
      notes: notes.trim(),
    }

    onAddObservation(newObservation)
    setIsSuccess(true)
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(resetForm, 200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1 text-primary text-[10px]">
                  <HugeiconsIcon icon={Camera01Icon} />
                  Herbarium Lapangan
                </Badge>
                <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400">
                  +50 XP
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold">Catat Observasi Tanaman Baru</DialogTitle>
              <DialogDescription className="text-xs">
                Dokumentasikan flora yang kamu temukan di sekitar sekolah atau rumah. Hasil observasi
                akan dikirim ke guru untuk diverifikasi.
              </DialogDescription>
            </DialogHeader>

            {/* Quick Presets for Demo */}
            <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-3">
              <span className="text-[11px] font-medium text-muted-foreground">
                Pilih Contoh Cepat (Otomatis Isi):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs hover:bg-muted transition-colors text-foreground"
                  >
                    <span>{preset.icon}</span>
                    <span className="font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo & Icon Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground">
                Ikon & Lampiran Visual
              </label>
              <div className="flex items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-3xl shadow-xs border border-border">
                  {icon}
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <span className="text-[11px] text-muted-foreground">Pilih representasi flora:</span>
                  <div className="flex flex-wrap gap-1">
                    {plantIcons.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setIcon(ic)}
                        className={`size-7 rounded-lg text-sm flex items-center justify-center transition-colors ${
                          icon === ic
                            ? 'bg-primary/20 ring-1 ring-primary'
                            : 'hover:bg-muted bg-muted/40'
                        }`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Plant Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="plant-name" className="text-xs font-semibold text-foreground">
                  Nama Tanaman (Lokal / Umum) *
                </label>
                <Input
                  id="plant-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Bunga Telang"
                  required
                  className="text-xs sm:text-sm h-9"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="scientific-name" className="text-xs font-semibold text-foreground">
                  Nama Ilmiah / Famili (Dugaan)
                </label>
                <Input
                  id="scientific-name"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  placeholder="Contoh: Clitoria ternatea"
                  className="text-xs sm:text-sm h-9 italic"
                />
              </div>
            </div>

            {/* Location & Habit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="location" className="text-xs font-semibold text-foreground">
                  Lokasi Pengamatan
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Taman Depan Lab"
                    className="pl-8 text-xs sm:text-sm h-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="habit" className="text-xs font-semibold text-foreground">
                  Bentuk / Perawakan (Habitus)
                </label>
                <Input
                  id="habit"
                  value={habitType}
                  onChange={(e) => setHabitType(e.target.value)}
                  placeholder="Contoh: Herba / Semak / Liana"
                  className="text-xs sm:text-sm h-9"
                />
              </div>
            </div>

            {/* Linked Course / Task */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="target-course" className="text-xs font-semibold text-foreground">
                Tujuan Pengumpulan Observasi
              </label>
              <Input
                id="target-course"
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                placeholder="Contoh: Koleksi Herbarium Mandiri"
                className="text-xs sm:text-sm h-9"
              />
            </div>

            {/* Morphological Notes */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-xs font-semibold text-foreground">
                Catatan Morfologi & Karakteristik Tanaman
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Deskripsikan bentuk daun, warna bunga, tekstur batang, atau kondisi lingkungan tempat tumbuh..."
                rows={3}
                className="text-xs sm:text-sm"
              />
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={!name.trim()} className="gap-1.5">
                <HugeiconsIcon icon={Upload01Icon} data-icon="inline-start" />
                Simpan & Kirim Observasi
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-center gap-1.5">
                <Badge variant="secondary" className="gap-1 text-primary">
                  <HugeiconsIcon icon={SparklesIcon} />
                  +50 XP Diperoleh
                </Badge>
                <Badge variant="outline">Menunggu Review</Badge>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-2">
                Observasi Berhasil Dicatat! 🎉
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Temuan tanaman <span className="font-semibold text-foreground">{name}</span> telah
                tersimpan di jurnal herbariummu dan dikirim ke antrean verifikasi guru.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-border bg-muted/20 p-3.5 flex items-center gap-3 text-left">
              <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-2xl">
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{name}</p>
                <p className="text-[11px] italic text-muted-foreground truncate">{scientificName}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{location} · Baru saja</p>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0">
                Menunggu Review
              </Badge>
            </div>

            <Button onClick={handleClose} size="sm" className="w-full mt-2">
              Kembali ke Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
