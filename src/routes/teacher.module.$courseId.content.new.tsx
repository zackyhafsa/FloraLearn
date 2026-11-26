import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Pdf01Icon,
  Quiz01Icon,
  SaveIcon,
  Upload01Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { PdfDocumentReader } from '@/components/course/pdf-document-reader'
import { AppShell } from '@/components/layout/app-header'
import { createEmptyQuestion, QuizBuilder } from '@/components/teacher/quiz-builder'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  addModule,
  getCourseById,
  updateModule,
  type QuizQuestion,
} from '@/lib/course-store'
import {
  MAX_PDF_SIZE_BYTES,
  deletePdfFile,
  formatFileSize,
  savePdfFile,
} from '@/lib/pdf-store'

interface ContentEditorSearch {
  type?: 'material' | 'quiz'
  editId?: string
}

export const Route = createFileRoute('/teacher/module/$courseId/content/new')({
  validateSearch: (search: Record<string, unknown>): ContentEditorSearch => ({
    type: search.type === 'quiz' ? 'quiz' : search.type === 'material' ? 'material' : undefined,
    editId: typeof search.editId === 'string' ? search.editId : undefined,
  }),
  component: NewContentPage,
})

function NewContentPage() {
  const { courseId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const course = React.useMemo(() => getCourseById(courseId), [courseId])
  const existingModule = React.useMemo(
    () => (search.editId ? course?.modules.find((m) => m.id === search.editId) : undefined),
    [course, search.editId],
  )
  const isEditing = Boolean(existingModule)

  const [type, setType] = React.useState<'material' | 'quiz'>(
    existingModule?.type ?? search.type ?? 'material',
  )
  const [chapter, setChapter] = React.useState(
    existingModule?.chapter ?? `Bab ${(course?.modules.length ?? 0) + 1}`,
  )
  const [title, setTitle] = React.useState(existingModule?.title ?? '')
  const [description, setDescription] = React.useState(existingModule?.description ?? '')
  const [content, setContent] = React.useState(existingModule?.content ?? '')
  const [duration, setDuration] = React.useState(existingModule?.duration ?? '15 menit')

  // PDF upload state
  const [selectedPdfFile, setSelectedPdfFile] = React.useState<File | null>(null)
  const [existingPdfId, setExistingPdfId] = React.useState<string | undefined>(
    existingModule?.pdfId,
  )
  const [pdfName, setPdfName] = React.useState(existingModule?.pdfName ?? '')
  const [pdfSize, setPdfSize] = React.useState<number | undefined>(existingModule?.pdfSize)
  const [showPreview, setShowPreview] = React.useState(false)
  const [showFullPreview, setShowFullPreview] = React.useState(false)
  const [fileError, setFileError] = React.useState('')

  // Quiz state
  const [questions, setQuestions] = React.useState<QuizQuestion[]>(
    existingModule?.questions && existingModule.questions.length > 0
      ? existingModule.questions
      : [createEmptyQuestion()],
  )

  const [saving, setSaving] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError('')
    const file = e.target.files?.[0]
    if (!file) return

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setFileError('Format file harus berupa PDF (.pdf).')
      e.target.value = ''
      return
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      setFileError(
        `Ukuran file PDF maksimal 10 MB. File yang Anda pilih berukuran ${formatFileSize(file.size)}.`,
      )
      e.target.value = ''
      return
    }

    setSelectedPdfFile(file)
    setPdfName(file.name)
    setPdfSize(file.size)
    setShowPreview(true)
  }

  function clearPdf() {
    setSelectedPdfFile(null)
    setExistingPdfId(undefined)
    setPdfName('')
    setPdfSize(undefined)
    setShowPreview(false)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const quizValid =
    questions.length > 0 &&
    questions.every(
      (q) => q.question.trim().length > 0 && q.options.every((opt) => opt.trim().length > 0),
    )

  const materialValid = Boolean(pdfName || content.trim())
  const valid = Boolean(title.trim()) && (type === 'material' ? materialValid : quizValid)

  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!valid || saving) return

    setSaving(true)
    try {
      let finalPdfId = existingPdfId
      let finalPdfName = pdfName || undefined
      let finalPdfSize = pdfSize

      if (type === 'material' && selectedPdfFile) {
        if (existingModule?.pdfId) {
          await deletePdfFile(existingModule.pdfId)
        }
        const saved = await savePdfFile(selectedPdfFile)
        finalPdfId = saved.id
        finalPdfName = saved.name
        finalPdfSize = saved.size
      } else if (type === 'material' && !pdfName && existingModule?.pdfId) {
        await deletePdfFile(existingModule.pdfId)
        finalPdfId = undefined
        finalPdfName = undefined
        finalPdfSize = undefined
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        content:
          type === 'material'
            ? content.trim() || `Silakan pelajari dokumen PDF terlampir: ${finalPdfName ?? ''}`
            : content.trim() || `Evaluasi ${title.trim()} (${questions.length} pertanyaan).`,
        duration: duration.trim() || '15 menit',
        chapter: chapter.trim() || 'Bab 1',
        type,
        pdfId: type === 'material' ? finalPdfId : undefined,
        pdfName: type === 'material' ? finalPdfName : undefined,
        pdfSize: type === 'material' ? finalPdfSize : undefined,
        questions: type === 'quiz' ? questions : undefined,
      }

      if (isEditing && existingModule) {
        updateModule(courseId, existingModule.id, payload)
      } else {
        addModule(courseId, payload)
      }

      navigate({ to: '/teacher/module' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div>
          <Link
            to="/teacher/module"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={17} /> Kembali ke Modul Ajar
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-amber-600 dark:text-amber-400">
              Editor Konten Guru
            </Badge>
            {course && (
              <Badge variant="outline" className="text-xs">
                Course: {course.title}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit' : 'Tambah'}{' '}
            {type === 'material' ? 'Materi Ajar (PDF)' : 'Quiz Evaluasi'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {type === 'material'
              ? 'Unggah file PDF materi (maks. 10 MB) atau tulis ringkasan agar tampil sebagai dokumen yang mudah dibaca siswa.'
              : 'Susun pertanyaan pilihan ganda beserta kunci jawaban dan pembahasan.'}
          </p>
        </div>

        <form onSubmit={save} className="flex flex-col gap-6">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Konten</CardTitle>
              <CardDescription className="text-xs">
                Tentukan jenis konten, bab, dan judul yang tampil pada daftar materi siswa.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Jenis Konten">
                <Select
                  value={type}
                  onValueChange={(value) => setType((value as 'material' | 'quiz') ?? 'material')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Materi Ajar (PDF / Teks)</SelectItem>
                    <SelectItem value="quiz">Quiz Pilihan Ganda</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Bab / Bagian">
                <Input
                  value={chapter}
                  onChange={(event) => setChapter(event.target.value)}
                  placeholder="Contoh: Bab 1"
                />
              </Field>

              <Field label={type === 'material' ? 'Judul Materi' : 'Judul Quiz'} required>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={
                    type === 'material'
                      ? 'Contoh: Morfologi Daun dan Tipe Stomata'
                      : 'Contoh: Quiz Evaluasi Bab 1'
                  }
                  required
                />
              </Field>

              <Field label="Estimasi Durasi">
                <Input
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="Contoh: 15 menit"
                />
              </Field>
            </CardContent>
          </Card>

          {/* Content specific: PDF + Material OR Quiz Builder */}
          {type === 'material' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HugeiconsIcon icon={Pdf01Icon} size={18} className="text-primary" />
                  Dokumen Materi (PDF) & Ringkasan
                </CardTitle>
                <CardDescription className="text-xs">
                  Unggah file PDF (maks. 10 MB). Di panel siswa, isi PDF akan ditampilkan menyatu seperti halaman dokumen biasa tanpa frame atau tombol unduh.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                {/* PDF Upload Dropzone */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    File Materi PDF{' '}
                    <span className="text-xs text-muted-foreground">
                      (Maks. 10 MB · Opsional jika isi teks diisi)
                    </span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="pdf-upload-input"
                  />

                  {!pdfName ? (
                    <label
                      htmlFor="pdf-upload-input"
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/5"
                    >
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <HugeiconsIcon icon={Upload01Icon} size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Klik untuk memilih file PDF dari komputer Anda
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Format .pdf · Ukuran maksimal 10 MB
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <HugeiconsIcon icon={File01Icon} size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {pdfName}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                size={13}
                                className="text-primary"
                              />
                              Siap disimpan ({formatFileSize(pdfSize)})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview((prev) => !prev)}
                          >
                            <HugeiconsIcon icon={ViewIcon} data-icon="inline-start" />
                            {showPreview ? 'Tutup Preview' : 'Preview Tampilan Siswa'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Ganti PDF
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive"
                            onClick={clearPdf}
                            aria-label="Hapus file PDF"
                          >
                            <HugeiconsIcon icon={Cancel01Icon} />
                          </Button>
                        </div>
                      </div>

                      {showPreview && (
                        <div className="flex flex-col gap-3">
                          {showFullPreview ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                className="self-center"
                                onClick={() => setShowFullPreview(false)}
                              >
                                Tampilkan cuplikan saja
                              </Button>
                              <PdfDocumentReader
                                file={selectedPdfFile}
                                pdfId={existingPdfId}
                              />
                            </>
                          ) : (
                            <>
                              <div className="h-72 overflow-hidden rounded-xl border border-border">
                                <PdfDocumentReader
                                  file={selectedPdfFile}
                                  pdfId={existingPdfId}
                                  maxPages={1}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                className="self-center"
                                onClick={() => setShowFullPreview(true)}
                              >
                                Lihat PDF selengkapnya
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {fileError && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {fileError}
                    </p>
                  )}
                </div>

                <Field label="Deskripsi Singkat">
                  <Input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Contoh: Modul berisi ilustrasi penampang daun dan penjelasan jenis stomata."
                  />
                </Field>

                <Field label="Ringkasan / Catatan Pengantar Materi">
                  <Textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Tulis poin-poin penting atau pengantar materi untuk dibaca siswa..."
                    rows={6}
                  />
                </Field>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <HugeiconsIcon icon={Quiz01Icon} size={18} className="text-primary" />
                  Editor Soal Quiz Pilihan Ganda
                </CardTitle>
                <CardDescription className="text-xs">
                  Tambahkan pertanyaan pilihan ganda yang akan dikerjakan dan dinilai otomatis di panel siswa.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                <Field label="Petunjuk Pengerjaan Quiz">
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Contoh: Pilih satu jawaban yang paling tepat. Nilai minimal ketuntasan adalah 75."
                    rows={2}
                  />
                </Field>

                <QuizBuilder questions={questions} onChange={setQuestions} />
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {!valid &&
                (type === 'material'
                  ? 'Lengkapi judul dan unggah file PDF (maks. 10 MB) atau isi catatan materi.'
                  : 'Lengkapi judul serta pastikan semua pertanyaan dan opsi A–D terisi.')}
            </p>

            <div className="flex items-center gap-3">
              <Link to="/teacher/module" className={buttonVariants({ variant: 'outline' })}>
                Batal
              </Link>
              <Button type="submit" disabled={!valid || saving}>
                <HugeiconsIcon icon={SaveIcon} data-icon="inline-start" />
                {saving
                  ? 'Menyimpan...'
                  : isEditing
                    ? 'Simpan Perubahan'
                    : `Simpan ${type === 'material' ? 'Materi' : 'Quiz'}`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  )
}
