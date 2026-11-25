import * as React from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

import { getPdfRecord } from '@/lib/pdf-store'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

interface PdfDocumentReaderProps {
  pdfId?: string
  file?: File | Blob | null
  maxPages?: number
}

export function PdfDocumentReader({ pdfId, file, maxPages }: PdfDocumentReaderProps) {
  const [numPages, setNumPages] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [pdfDoc, setPdfDoc] = React.useState<pdfjsLib.PDFDocumentProxy | null>(null)

  React.useEffect(() => {
    let cancelled = false
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null

    async function load() {
      setLoading(true)
      setError('')
      setNumPages(0)
      setPdfDoc(null)

      try {
        let buffer: ArrayBuffer | null = null
        if (file) {
          buffer = await file.arrayBuffer()
        } else if (pdfId) {
          const record = await getPdfRecord(pdfId)
          if (record) {
            buffer = await record.blob.arrayBuffer()
          }
        }

        if (!buffer) {
          if (!cancelled) {
            setError('Dokumen materi belum tersedia di browser ini.')
            setLoading(false)
          }
          return
        }

        loadingTask = pdfjsLib.getDocument({ data: buffer })
        const loadedDoc = await loadingTask.promise
        if (!cancelled) {
          setPdfDoc(loadedDoc)
          setNumPages(loadedDoc.numPages)
          setLoading(false)
        } else {
          await loadingTask.destroy()
        }
      } catch {
        if (!cancelled) {
          setError('Gagal memuat isi dokumen materi.')
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
      if (loadingTask) {
        loadingTask.destroy().catch(() => {})
      }
    }
  }, [pdfId, file])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-[460px] w-full animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {error}
      </div>
    )
  }

  if (!pdfDoc || numPages === 0) return null

  const visiblePages = Math.min(numPages, maxPages ?? numPages)

  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: visiblePages }, (_, index) => (
        <PdfPageCanvas
          key={`${pdfId ?? 'file'}-${index + 1}`}
          pdfDoc={pdfDoc}
          pageNumber={index + 1}
          totalPages={numPages}
        />
      ))}
    </div>
  )
}

function PdfPageCanvas({
  pdfDoc,
  pageNumber,
  totalPages,
}: {
  pdfDoc: pdfjsLib.PDFDocumentProxy
  pageNumber: number
  totalPages: number
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [rendered, setRendered] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    let renderTask: pdfjsLib.RenderTask | null = null

    async function renderPage() {
      const canvas = canvasRef.current
      if (!canvas) return

      try {
        const page = await pdfDoc.getPage(pageNumber)
        if (cancelled) return

        // Render at high resolution so text and botanical diagrams stay crisp
        const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
        const viewport = page.getViewport({ scale: 1.6 * dpr })

        canvas.width = viewport.width
        canvas.height = viewport.height

        const context = canvas.getContext('2d')
        if (!context) return

        renderTask = page.render({
          canvasContext: context,
          canvas,
          viewport,
        })
        await renderTask.promise
        if (!cancelled) setRendered(true)
      } catch {
        // Abaikan jika render dibatalkan saat navigasi halaman
      }
    }

    renderPage()
    return () => {
      cancelled = true
      if (renderTask) renderTask.cancel()
    }
  }, [pdfDoc, pageNumber])

  return (
    <article className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs">
        {!rendered && <div className="h-96 w-full animate-pulse bg-muted/20" />}
        <canvas
          ref={canvasRef}
          className={`block w-full h-auto ${rendered ? 'opacity-100' : 'opacity-0 h-0'}`}
          aria-label={`Halaman ${pageNumber} dari ${totalPages}`}
        />
      </div>
      {totalPages > 1 && (
        <p className="text-right text-[11px] text-muted-foreground">
          Halaman {pageNumber} dari {totalPages}
        </p>
      )}
    </article>
  )
}
