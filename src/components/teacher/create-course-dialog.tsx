import * as React from 'react'
import { BookOpen01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createCourse, type DemoCourse } from '@/lib/course-store'

interface CreateCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (course: DemoCourse) => void
}

export function CreateCourseDialog({ open, onOpenChange, onCreated }: CreateCourseDialogProps) {
  const [title, setTitle] = React.useState('')
  const [subject, setSubject] = React.useState('Biologi Kelas 10')
  const [description, setDescription] = React.useState('')
  const [status, setStatus] = React.useState<'Terbit' | 'Draft'>('Terbit')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const created = createCourse({
      title,
      subject,
      description:
        description.trim() ||
        'Course pembelajaran botani beserta materi PDF dan evaluasi quiz interaktif.',
      status,
    })

    setTitle('')
    setDescription('')
    setStatus('Terbit')
    onOpenChange(false)
    onCreated?.(created)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit gap-1 text-primary text-[11px]">
              <HugeiconsIcon icon={BookOpen01Icon} size={13} />
              Course Baru
            </Badge>
            <DialogTitle>Buat Course / Modul Pembelajaran</DialogTitle>
            <DialogDescription className="text-xs">
              Setelah course dibuat, Anda dapat menambahkan materi PDF dan soal quiz di dalamnya.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="course-title" className="text-xs font-semibold">
                Judul Course <span className="text-destructive">*</span>
              </label>
              <Input
                id="course-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Morfologi & Anatomi Tumbuhan"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Mata Pelajaran</label>
                <Select value={subject} onValueChange={(v) => setSubject(v ?? 'Biologi Kelas 10')}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Biologi Kelas 10">Biologi Kelas 10</SelectItem>
                    <SelectItem value="Botani Terapan">Botani Terapan</SelectItem>
                    <SelectItem value="Biologi Dasar">Biologi Dasar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Status Publikasi</label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus((v as 'Terbit' | 'Draft') ?? 'Terbit')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Terbit">Terbit (Tampil di Siswa)</SelectItem>
                    <SelectItem value="Draft">Draft (Sembunyikan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="course-desc" className="text-xs font-semibold">
                Deskripsi Course
              </label>
              <Textarea
                id="course-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ringkasan topik yang akan dipelajari siswa..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={!title.trim()}>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
              Simpan Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
