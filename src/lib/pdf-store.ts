const DB_NAME = 'ekostream_pdf_db'
const DB_VERSION = 1
const STORE_NAME = 'pdfs'

export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export type PdfRecord = {
  id: string
  name: string
  size: number
  type: string
  blob: Blob
  createdAt: string
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB tidak tersedia di browser ini.'))
      return
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Gagal membuka IndexedDB.'))
  })
}

/** Menyimpan file PDF ke IndexedDB browser dan mengembalikan metadata referensinya. */
export async function savePdfFile(file: File): Promise<{ id: string; name: string; size: number }> {
  const db = await openDb()
  const id = `pdf-${crypto.randomUUID()}`
  const record: PdfRecord = {
    id,
    name: file.name,
    size: file.size,
    type: file.type || 'application/pdf',
    blob: file,
    createdAt: new Date().toISOString(),
  }

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(record)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Gagal menyimpan file PDF.'))
  })

  return { id, name: record.name, size: record.size }
}

/** Mengambil record PDF beserta Blob dari IndexedDB berdasarkan ID. */
export async function getPdfRecord(id: string): Promise<PdfRecord | null> {
  if (!id) return null
  try {
    const db = await openDb()
    return await new Promise<PdfRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(id)
      req.onsuccess = () => resolve((req.result as PdfRecord | undefined) ?? null)
      req.onerror = () => reject(req.error ?? new Error('Gagal membaca file PDF.'))
    })
  } catch {
    return null
  }
}

/** Menghapus file PDF dari IndexedDB (dipanggil saat materi dihapus). */
export async function deletePdfFile(id?: string): Promise<void> {
  if (!id) return
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('Gagal menghapus file PDF.'))
    })
  } catch {
    // Abaikan error pembersihan file agar alur utama tidak terganggu
  }
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 KB'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}
