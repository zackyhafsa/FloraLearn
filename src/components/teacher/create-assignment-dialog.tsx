import * as React from 'react'
import {
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Folder01Icon,
  Task01Icon,
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
import type { TeacherAssignment } from '@/types'

interface CreateAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAssignment: (assignment: TeacherAssignment) => void
}

export function CreateAssignmentDialog({
  open,
  onOpenChange,
  onCreateAssignment,
}: CreateAssignmentDialogProps) {
  const [title, setTitle] = React.useState('')
  const [course, setCourse] = React.useState('Biologi Kelas 10')
  const [targetClass, setTargetClass] = React.useState('10 IPA 1 & 10 IPA 2')
  const [deadline, setDeadline] = React.useState('05 Des 2026')
  const [description, setDescription] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newAssignment: TeacherAssignment = {
      id: `t-assign-${Date.now()}`,
      title,
      course: `${course} · ${targetClass}`,
      deadline: `${deadline} (Baru)`,
      submittedCount: 0,
      totalStudents: targetClass.includes('&') ? 70 : 35,
      status: 'active',
    }

    onCreateAssignment(newAssignment)
    setTitle('')
    setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-[10px] text-primary">
                <HugeiconsIcon icon={Task01Icon} size={13} />
                Penugasan Praktikum Baru
              </Badge>
            </div>
            <DialogTitle className="text-base sm:text-lg">Buat Tugas Praktikum Botani</DialogTitle>
            <DialogDescription className="text-xs">
              Terbitkan instruksi pengamatan lapangan atau analisis spesimen herbarium untuk siswa.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-title" className="text-xs font-semibold text-foreground">
                Judul Tugas / Praktikum
              </label>
              <Input
                id="task-title"
                placeholder="Contoh: Eksplorasi Morfologi Bryophyta (Tumbuhan Lumut)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-xs sm:text-sm h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="task-course" className="text-xs font-semibold text-foreground">
                  Mata Pelajaran
                </label>
                <select
                  id="task-course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Biologi Kelas 10">Biologi Kelas 10</option>
                  <option value="Botani Terapan">Botani Terapan</option>
                  <option value="Proyek Ekologi">Proyek Ekologi</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="task-target-class" className="text-xs font-semibold text-foreground">
                  Rombel Sasaran
                </label>
                <select
                  id="task-target-class"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="10 IPA 1 & 10 IPA 2">Semua Kelas (70 Siswa)</option>
                  <option value="10 IPA 1">10 IPA 1 (36 Siswa)</option>
                  <option value="10 IPA 2">10 IPA 2 (34 Siswa)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-deadline" className="text-xs font-semibold text-foreground">
                Tanggal Tenggat Pengumpulan
              </label>
              <Input
                id="task-deadline"
                placeholder="Contoh: 05 Des 2026, 23:59 WIB"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="text-xs sm:text-sm h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-desc" className="text-xs font-semibold text-foreground">
                Instruksi Praktikum & Kriteria Pengamatan
              </label>
              <Textarea
                id="task-desc"
                placeholder="Tuliskan panduan identifikasi, bagian tumbuhan yang wajib difoto (daun/rizoid/spora), dan format catatan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" className="gap-1.5 shadow-xs">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
              Terbitkan Tugas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
