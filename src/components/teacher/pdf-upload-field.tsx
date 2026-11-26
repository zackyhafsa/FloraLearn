import * as React from 'react'
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Upload01Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { PdfDocumentReader } from '@/components/course/pdf-document-reader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MAX_PDF_SIZE_BYTES, formatFileSize } from '@/lib/pdf-store'

interface PdfUploadFieldProps {
  selectedFile: File | null
  existingPdfId?: string
  pdfName: string
  pdfSize?: number
  onSelectFile: (file: File) => void
  onClear: () => void
}

export function PdfUploadField({
  selectedFile,
  existingPdfId,
  pdfName,
  pdfSize,
  onSelectFile,
  onClear,
}: PdfUploadFieldProps) {
  const [showSnippet, setShowSnippet] = React.useState(Boolean(pdfName))
  const [fullModalOpen, setFullModalOpen] = React.useState(false)
  const [fileError, setFileError] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFileError('')
    const file = event.target.files?.[0]
    if (!file) return

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setFileError('Format file harus berupa PDF (.pdf).')
      event.target.value = ''
      return
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      setFileError(
        `Ukuran file PDF maksimal 10 MB. File yang Anda pilih berukuran ${formatFileSize(file.size)}.`,
      )
      event.target.value = ''
      return
    }

    onSelectFile(file)
    setShowSnippet(true)
  }

  function handleClear() {
    setFileError('')
    setShowSnippet(false)
    setFullModalOpen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClear()
  }

  return (
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
        onChange={handleFileChange}
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
                <p className="truncate text-sm font-semibold text-foreground">{pdfName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} className="text-primary" />
                  Siap disimpan ({formatFileSize(pdfSize)})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSnippet((prev) => !prev)}
              >
                <HugeiconsIcon icon={ViewIcon} data-icon="inline-start" />
                {showSnippet ? 'Tutup Preview' : 'Preview Tampilan Siswa'}
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
                onClick={handleClear}
                aria-label="Hapus file PDF"
              >
                <HugeiconsIcon icon={Cancel01Icon} />
              </Button>
            </div>
          </div>

          {showSnippet && (
            <div className="flex flex-col gap-3">
              <div className="relative h-72 overflow-hidden rounded-xl border border-border bg-white">
                <PdfDocumentReader file={selectedFile} pdfId={existingPdfId} maxPages={1} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/95 to-transparent" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-center"
                onClick={() => setFullModalOpen(true)}
              >
                <HugeiconsIcon icon={ViewIcon} data-icon="inline-start" />
                Lihat PDF Selengkapnya
              </Button>
            </div>
          )}
        </div>
      )}

      {fileError && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {fileError}
        </p>
      )}

      <Dialog open={fullModalOpen} onOpenChange={setFullModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="truncate">{pdfName || 'Pratinjau Dokumen'}</DialogTitle>
            <DialogDescription className="text-xs">
              Pratinjau tampilan dokumen lengkap seperti yang dibaca oleh siswa.
            </DialogDescription>
          </DialogHeader>
          <PdfDocumentReader file={selectedFile} pdfId={existingPdfId} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
