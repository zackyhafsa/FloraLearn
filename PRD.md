# PRD – LMS Berbasis Observasi Tanaman & Citizen Science

Versi 1.0 · Disusun oleh: Senior Technical Product Manager & Principal Software Architect · Status: Draft untuk review engineering

## 1. Ringkasan Eksekutif & Metrik Keberhasilan (KPI)

### 1.1 Ringkasan

Platform ini menggabungkan LMS standar (course, materi, kuis berwaktu, penilaian) dengan eksplorasi botani lapangan ala iNaturalist. Siswa memotret tanaman di lapangan, model ML berjalan di browser untuk mengusulkan spesies/penyakit, temuan diunggah langsung ke Cloudflare R2, tampil di peta dan galeri publik (Media Explore), lalu diverifikasi dan dinilai guru. Asisten Chatbot AI (Gemini 2.5 Flash, streaming SSE) memberi bantuan kontekstual berdasarkan materi yang sedang dibuka atau hasil pemindaian terakhir.

Prinsip desain yang mengikat seluruh keputusan:

- **Ringan & hemat kuota:** bundle awal kecil, kompresi gambar di klien, model ML di-cache, aset lazy-load, payload API ringkas.
- **Tahan sinyal buruk:** setiap aksi lapangan harus dapat dilakukan offline dan disinkronkan belakangan.
- **Tahan konkurensi tinggi:** target 5.000+ siswa mengerjakan ujian serentak tanpa degradasi berarti.
- **Human-in-the-loop:** ML hanya mengusulkan; guru adalah otoritas validasi.

### 1.2 Tujuan Produk

1. Meningkatkan keterlibatan siswa lewat pembelajaran berbasis pengalaman nyata.
2. Menyediakan LMS yang andal untuk ujian skala besar.
3. Menghasilkan dataset keanekaragaman hayati lokal yang tervalidasi guru.

### 1.3 KPI

| Area | KPI | Target (6 bulan pasca-MVP) |
| --- | --- | --- |
| Adopsi | Siswa aktif mingguan (WAU) / siswa terdaftar | ≥ 60% |
| Engagement | Rata-rata observasi valid per siswa per bulan | ≥ 4 |
| Kualitas data | Observasi terverifikasi guru dari total diajukan | ≥ 70% |
| ML | Top-1 accuracy model pada set uji lokal; Top-5 accuracy | ≥ 80%; ≥ 93% |
| ML | Rasio 'saran ML diterima siswa tanpa koreksi guru' | ≥ 75% |
| Performa ujian | p95 latensi simpan jawaban; error rate saat ujian serentak | < 300 ms; < 0,5% |
| Keandalan | Ketersediaan (jam ujian) | ≥ 99,9% |
| Efisiensi data | Rata-rata data seluler per sesi observasi | < 1,5 MB (setelah model ter-cache) |
| Offline | Observasi offline yang berhasil tersinkron | ≥ 98% |
| Pembelajaran | Penyelesaian course; waktu rata-rata guru menilai satu esai | ≥ 70%; turun 30% dari baseline |

## 2. User Personas & Matriks Hak Akses (RBAC)

### 2.1 Personas

- **Rina – Admin sekolah/dinas (35 th):** mengelola ratusan akun dan kelas, butuh impor massal (CSV), audit log, dan moderasi. Pengguna desktop.
- **Pak Budi – Guru Biologi (42 th):** membuat course, bank soal, tugas observasi; terbatas waktu, butuh antrean verifikasi yang cepat dan analitik kelas sekilas. Desktop dan ponsel.
- **Dika – Murid SMA (16 th):** ponsel Android entry-level, kuota terbatas, sinyal tidak stabil saat observasi di kebun sekolah/hutan kota. Butuh aplikasi cepat, jujur soal status unggah, dan motivasi (lencana).
- **Sari – Murid SMP (13 th):** perlu perlindungan privasi lokasi dan filter konten pada chatbot serta galeri publik.

### 2.2 Matriks RBAC

Legenda: C=Create, R=Read, U=Update, D=Delete, V=Validasi, – = tidak ada akses. 'Scope' berarti terbatas pada kelas/course miliknya.

| Sumber daya | Admin | Guru | Murid |
| --- | --- | --- | --- |
| Akun pengguna | CRUD, reset sandi | R (siswa kelasnya) | R/U profil sendiri |
| Kelas & enrollment | CRUD | R (scope) | R (scope) |
| Taksonomi tanaman | CRUD | R, usul perubahan | R |
| Course & modul materi | R | CRUD (scope: miliknya) | R (scope: enrolled) |
| Bank soal & kuis | R | CRUD (scope) | Kerjakan (scope) |
| Jawaban & nilai kuis | R | R/U nilai esai (scope) | R milik sendiri |
| Tugas observasi | R | CRUD (scope) | R, submit (scope) |
| Observasi (temuan) | D (moderasi) | R, V, tolak (scope kelas); R publik | CRUD milik sendiri; R publik |
| Komentar di Media Explore | D (moderasi) | D (scope kelas) | C/R, D milik sendiri |
| Chatbot AI | R log & kuota | C/R (uji coba) | C/R milik sendiri |
| Analitik | Global | Scope kelas | Progres sendiri |
| Log aktivitas | R | – | – |

Aturan tambahan: otorisasi ditegakkan di middleware Hono (peran + kepemilikan/scope), bukan hanya di UI; setiap kueri data guru/murid wajib difilter berdasarkan relasi kelas/course di sisi server.

## 3. Spesifikasi Fungsional Mendetail per Modul

Prioritas: **P0** = MVP, **P1** = fase lanjutan.

### 3.1 Autentikasi & Profil (P0)

**User stories**

- Sebagai pengguna, saya ingin login dengan email/username dan sandi agar dapat mengakses sesuai peran.
- Sebagai murid, saya ingin melihat portofolio progres dan galeri temuan pribadi untuk melacak perkembangan saya.
- Sebagai murid di bawah umur, saya ingin lokasi presisi saya tidak terekspos publik.

**Acceptance Criteria**

1. Registrasi akun guru/murid dilakukan Admin (single dan impor CSV); tidak ada pendaftaran mandiri publik pada MVP. Murid dapat mengaktifkan akun lewat tautan undangan sekali pakai (kedaluwarsa 7 hari).
2. Sesi memakai access token berumur pendek (15 menit) + refresh token httpOnly rotating; logout mencabut refresh token. Rate limit login: 5 gagal/15 menit per akun+IP, lalu lock sementara.
3. Sandi di-hash dengan argon2id; kebijakan minimal 8 karakter; paksa ganti sandi pada login pertama akun hasil impor.
4. Profil: nama, avatar (maks 200 KB setelah kompresi), kelas, bio. Murid tidak dapat mengubah peran/kelas.
5. Portofolio menampilkan grafik progres course, daftar lencana, dan galeri temuan (status: draf, menunggu, terverifikasi, ditolak) dengan paginasi cursor.
6. Edge case: akun dinonaktifkan saat sesi aktif → request berikutnya 401 dan klien membersihkan cache lokal sensitif (IndexedDB antrean tetap disimpan terenkripsi bila ada item belum tersinkron, dengan peringatan).

### 3.2 Dashboard Admin (P0)

**User stories:** sebagai Admin, saya ingin mengelola user, kelas, taksonomi, dan melihat log aktivitas untuk menjaga integritas sistem.

**Acceptance Criteria**

1. Tabel user dengan pencarian, filter peran/kelas, dan aksi massal (nonaktifkan, pindah kelas, reset sandi).
2. Impor CSV divalidasi per baris dengan laporan error yang dapat diunduh; proses idempoten berdasarkan email/NIS (tidak membuat duplikat).
3. Master taksonomi hierarkis (Kingdom → … → Spesies) dengan nama ilmiah, nama lokal, status konservasi (IUCN), flag 'sensitif' (lokasi dikaburkan), dan label kelas ML. Perubahan taksonomi yang dipakai observasi tidak boleh menghapus data; gunakan merge/alias dan soft delete.
4. Moderasi: antrean laporan konten, aksi sembunyikan/hapus observasi atau komentar, disertai alasan tersimpan di log.
5. Log aktivitas append-only (aktor, aksi, entitas, IP, waktu, diff ringkas) dengan filter dan ekspor CSV.
6. Manajemen versi model ML: unggah artefak model, tandai versi aktif, rollback satu klik (lihat 5.4).

### 3.3 Dashboard Guru (P0)

**User stories**

- Sebagai guru, saya ingin membuat course, soal, dan tugas observasi agar bisa mengelola pembelajaran.
- Sebagai guru, saya ingin antrean verifikasi dan penilaian yang terurut agar tidak ada yang terlewat.
- Sebagai guru, saya ingin analitik kelas untuk mengidentifikasi siswa yang tertinggal.

**Acceptance Criteria**

1. Pembuat course: bab/modul dapat diurutkan (drag-drop), status draf/terbit, penjadwalan terbit, duplikasi course.
2. Bank soal mendukung pilihan ganda, benar/salah, isian singkat, esai; tag topik/kesulitan; impor CSV; gambar soal lewat presigned upload.
3. Pembuat kuis: pilih soal manual/acak per tag, durasi, jendela waktu buka-tutup, jumlah percobaan, acak soal/opsi, tampilkan pembahasan (langsung/setelah tutup).
4. Tugas observasi: instruksi, tenggat, target (mis. 'minimal 3 spesies berbeda'), rubrik (identifikasi, kualitas foto, catatan, lokasi), bobot nilai, batasan area (opsional, poligon) dan batasan taksonomi (opsional).
5. Antrean verifikasi menampilkan foto, prediksi ML + skor, koreksi siswa, peta mini, metadata; aksi: **Setujui**, **Koreksi spesies** (pilih dari taksonomi), **Minta perbaikan** (dengan catatan), **Tolak**. Tersedia pintasan keyboard dan aksi massal untuk observasi berkeyakinan tinggi.
6. Antrean esai: tampilan berdampingan jawaban dan rubrik, simpan otomatis, nilai + umpan balik; status 'dinilai'. Nilai kuis final dihitung ulang otomatis saat esai dinilai.
7. Analitik kelas: progres per siswa, distribusi nilai, soal dengan tingkat kesalahan tertinggi, peta temuan kelas, spesies terbanyak. Data dari tabel agregat/materialized view yang di-refresh berkala (maks 5 menit tertunda).
8. Edge case: guru menghapus soal yang sudah dikerjakan → soal di-soft-delete dan snapshot soal tetap tersimpan pada attempt.

### 3.4 Halaman Utama Siswa (P0)

**User story:** sebagai murid, saya ingin melihat course aktif, progres, dan tenggat agar tahu prioritas.

**Acceptance Criteria**

1. Muat < 2 dtk pada 4G; menampilkan kartu course, progres (%), 'lanjutkan belajar', dan daftar tenggat 14 hari ke depan (kuis, tugas observasi) diurutkan terdekat.
2. Pengingat in-app untuk tenggat < 24 jam; pengingat push/web-push pada P1.
3. Data di-cache (TanStack Query persist) sehingga dapat dibuka offline dengan label 'terakhir diperbarui'.
4. Menampilkan banner jika ada observasi di antrean offline belum tersinkron.

### 3.5 Detail Course & Materi (P0)

**User stories:** sebagai murid, saya ingin membaca materi, memutar video, dan mengunduh dokumen dengan hemat kuota.

**Acceptance Criteria**

1. Navigasi bab/modul dengan status selesai; progres ditandai otomatis (bacaan: scroll ≥ 90%; video: ≥ 90% ditonton; dokumen: dibuka) atau manual.
2. Materi teks disajikan sebagai konten terstruktur (JSONB blok: heading, paragraf, gambar, tautan taksonomi) dan di-cache Redis serta HTTP cache (ETag).
3. Video: dukungan HLS/MP4 adaptif dengan default kualitas rendah di jaringan seluler, 'mode hemat data' dapat diubah, tanpa autoplay. Video di-host di R2/CDN atau embed penyedia eksternal.
4. Dokumen diunduh lewat presigned GET (kedaluwarsa 10 menit) dengan ukuran ditampilkan sebelum unduh.
5. Materi yang sudah dibuka dapat disimpan offline (P1) memakai Cache Storage.
6. Tautan taksonomi pada materi membuka kartu spesies dan temuan terverifikasi terkait di peta.

### 3.6 Pengerjaan & Rekap Kuis (P0)

**User stories**

- Sebagai murid, saya ingin mengerjakan kuis berwaktu dengan jawaban tersimpan aman walau sinyal putus sesaat.
- Sebagai murid, saya ingin melihat skor dan pembahasan setelah selesai.

**Acceptance Criteria**

1. **Mulai attempt:** server membuat attempt, menetapkan `deadline_at = min(now + durasi, tutup_kuis)`, dan mengembalikan paket soal (tanpa kunci jawaban). Soal diacak dengan seed per attempt agar urutan stabil saat reload.
2. **Timer otoriter di server:** klien hanya menampilkan hitung mundur dari `deadline_at` dan koreksi selisih jam (offset dari header Date). Jawaban yang tiba setelah `deadline_at + grace 10 dtk` ditolak.
3. **Simpan jawaban otomatis:** setiap perubahan jawaban di-debounce (≈ 800 ms) dan dikirim sebagai PATCH idempoten (`attempt_id`, `question_id`, `client_seq`). Server menerima hanya `client_seq` lebih baru. Salinan lokal disimpan di IndexedDB; saat offline, indikator 'tersimpan di perangkat' tampil dan antrean dikirim ulang saat online.
4. **Submit:** idempoten; submit ganda mengembalikan hasil yang sama. Jika waktu habis, server auto-submit pada deadline (job terjadwal) meskipun klien tertutup.
5. Penilaian otomatis untuk PG/BS/isian singkat dilakukan di server; esai berstatus 'menunggu penilaian'.
6. Rekap: skor, waktu, per-soal benar/salah, pembahasan sesuai kebijakan guru. Kunci jawaban tidak pernah dikirim ke klien sebelum diizinkan.
7. Anti-curang dasar: satu attempt aktif per siswa per kuis (dikunci di DB), log perpindahan tab/blur (informatif untuk guru), larangan salin-tempel opsional. Perangkat kedua yang membuka attempt aktif menerima peringatan; keduanya tetap menulis ke attempt yang sama dengan aturan last-seq-wins.
8. Edge case: baterai/penutupan browser → lanjutkan attempt selama sisa waktu; jam perangkat salah → tidak berpengaruh karena timer server; kuis ditutup guru di tengah pengerjaan → attempt berjalan tetap diberi waktu hingga `deadline_at` kecuali guru memilih 'tutup paksa'.

### 3.7 Media Explore – Peta & Galeri (P0)

**User stories**

- Sebagai pengguna, saya ingin melihat sebaran temuan tanaman di peta dan menelusuri galeri berfilter.
- Sebagai pengguna, saya ingin lencana yang menandai temuan terverifikasi guru.

**Acceptance Criteria**

1. Peta React-Leaflet memuat data berdasarkan **bounding box + zoom** dari PostGIS (`ST_MakeEnvelope`, indeks GiST). Pada zoom rendah, server mengembalikan klaster (`ST_ClusterDBSCAN` atau grid `ST_SnapToGrid`) bukan titik mentah; batas maksimum 500 fitur per respons.
2. Ubin peta menggunakan penyedia tile yang diizinkan; tile di-cache Service Worker (batas ukuran) dan tersedia opsi tile vektor/raster ringan. Atribusi OSM ditampilkan.
3. Galeri: infinite scroll cursor-based, thumbnail WebP/AVIF lewat varian ukuran (320/800 px) yang dibuat saat unggah; filter taksonomi (cascading), status verifikasi, kelas/sekolah, rentang tanggal, dan area peta aktif.
4. Lencana: 'Terverifikasi Guru' (centang), 'Menunggu verifikasi', 'Saran ML'. Hanya observasi berstatus terverifikasi yang tampil di publik secara default; draf dan menunggu hanya terlihat pemilik dan guru kelasnya (opsi guru untuk mengizinkan tampil 'belum diverifikasi').
5. **Privasi lokasi:** koordinat publik dikaburkan (generalisasi ke sel ±1 km) untuk (a) spesies berflag sensitif, (b) akun murid di bawah umur jika kebijakan sekolah aktif, (c) atas permintaan pemilik. Koordinat presisi tersimpan terpisah dan hanya dapat dibaca pemilik, guru kelasnya, dan Admin.
6. Detail observasi: foto, spesies, skor ML, catatan, peta mini, komentar (moderasi), tombol laporkan.
7. Edge case: titik di (0,0) atau di luar akurasi masuk akal (akurasi GPS > 100 m) ditandai peringatan; observasi dengan koordinat di dalam laut/di luar wilayah operasi ditandai untuk ditinjau guru; kerumunan titik identik ditangani dengan spiderfy.

### 3.8 Input Observasi & Deteksi ML (P0)

**User stories**

- Sebagai murid, saya ingin memindai tanaman real-time dan mendapat saran spesies/penyakit, lalu menyimpannya sebagai temuan.
- Sebagai murid, saya ingin tetap bisa merekam temuan walau tidak ada sinyal.

**Acceptance Criteria**

1. **Akuisisi:** kamera langsung (`getUserMedia`, kamera belakang) atau unggah dari galeri. Izin kamera/lokasi diminta kontekstual dengan penjelasan; jika ditolak, tersedia jalur manual.
2. **Kompresi di klien:** foto di-resize (sisi terpanjang default 2048 px untuk arsip, 640 px untuk thumbnail) dan dikodekan WebP/JPEG kualitas ≈ 0,8 di Web Worker/OffscreenCanvas; target ≤ 600 KB per foto. EXIF diproses: koordinat/waktu dibaca lalu **seluruh EXIF dibuang** dari berkas yang diunggah. Maksimum 5 foto per observasi (daun, bunga, buah, batang, keseluruhan).
3. **Inferensi klien:** model dimuat via ONNX Runtime Web (backend WebGPU → WebGL → WASM sebagai fallback bertingkat) atau TF.js. Model dikuantisasi (int8/fp16), ukuran ditargetkan ≤ 10 MB, di-cache oleh Service Worker dan diverifikasi checksum; pemuatan awal menampilkan progres dan hanya berjalan setelah persetujuan pada jaringan seluler (peringatan ukuran). Inferensi dijalankan di Web Worker agar UI tidak macet; target ≤ 700 ms per frame pada ponsel kelas menengah.
4. **Pemindaian real-time:** inferensi dibatasi 2–4 fps, hasil dihaluskan (rata-rata bergerak 5 frame) sebelum ditampilkan; tombol 'Tangkap' mengunci frame beresolusi penuh untuk inferensi akhir.
5. **Keluaran model:** Top-5 spesies + skor, klasifikasi penyakit (opsional, model kedua), dan `model_version`. Semua disimpan bersama observasi untuk audit.
6. **Ambang keyakinan (default, dapat dikonfigurasi Admin):** ≥ 0,80 = 'Keyakinan tinggi' (saran prefilled); 0,50–0,79 = 'Perlu konfirmasi' (tampilkan Top-5, siswa wajib memilih); < 0,50 = **fallback** (lihat 4.2).
7. **GPS otomatis:** `watchPosition` dengan `enableHighAccuracy`, mengambil sampel hingga akurasi ≤ 30 m atau batas 15 dtk; simpan lat, lng, akurasi, dan sumber (perangkat/EXIF/manual). Siswa dapat menggeser pin pada peta bila perlu.
8. Catatan lapangan (teks, maks 1.000 karakter), habitat, fase tumbuh, dan tautan ke tugas LMS (dropdown tugas aktif milik kelas siswa; opsional bila tidak ada tugas).
9. **Simpan:** observasi dibuat lokal terlebih dahulu (IndexedDB) dengan `client_uuid`, lalu masuk antrean unggah (lihat 4.1 dan 6.3). Status terlihat jelas: *Tersimpan di perangkat → Mengunggah → Terkirim → Menunggu verifikasi*.
10. Edge case: perangkat tanpa WebGL/WASM SIMD → mode 'tanpa saran ML' tetap dapat merekam; foto buram (variansi Laplacian rendah) memicu saran ulang foto; objek bukan tanaman (kelas 'bukan tanaman' atau semua skor rendah) → pesan jelas; memori rendah → turunkan resolusi input model dan lepaskan tensor (`dispose`); tab di-background menghentikan kamera; foto duplikat (hash perseptual) ditandai.

### 3.9 Chatbot AI Kontekstual (P0)

**User stories:** sebagai murid, saya ingin bertanya tentang materi atau hasil pemindaian terakhir dan mendapat jawaban yang relevan serta mengalir (streaming).

**Acceptance Criteria**

1. Widget mengambang di semua halaman siswa dan halaman penuh `/chat`; riwayat percakapan per sesi disimpan (retensi 90 hari).
2. **Konteks otomatis:** klien mengirim `context` ringkas: `{type: 'material', id}` atau `{type: 'observation', id}`. Server yang mengambil isi dari DB/Redis (bukan klien) agar tidak dapat dimanipulasi, memotong ke anggaran token (mis. ≤ 3.000 token konteks), dan menyusun system prompt (peran tutor botani, bahasa Indonesia, jawab ringkas, jangan membocorkan kunci kuis).
3. **Streaming SSE:** `POST /api/chat/stream` mengembalikan `text/event-stream` dengan event `token`, `done`, `error`; mendukung pembatalan (AbortController) dan lanjut-ulang sederhana. Header `X-Accel-Buffering: no` dan heartbeat tiap 15 dtk agar tidak diputus proxy.
4. **Pagar pengaman:** selama kuis aktif (attempt berjalan), chatbot menolak membantu menjawab soal kuis tersebut; filter konten tidak pantas; instruksi anti prompt-injection (materi dan catatan siswa diperlakukan sebagai data, bukan instruksi).
5. Batas penggunaan: 30 pesan/jam/siswa, panjang pesan ≤ 1.000 karakter, kuota harian per sekolah, circuit breaker bila Gemini error/limit (pesan fallback ramah).
6. Jawaban memuat tautan ke materi/spesies relevan; tombol umpan balik (👍/👎) disimpan untuk evaluasi mutu.
7. Log hanya menyimpan metadata dan teks percakapan; PII (nama lengkap, alamat) disamarkan sebelum dikirim ke API pihak ketiga; koordinat presisi tidak pernah dikirim ke LLM (hanya nama wilayah umum).

## 4. Alur Kerja Integrasi Utama (Core User Flows)

### 4.1 Alur Utama: Tugas Observasi (Scan → R2 → Explore → Verifikasi & Nilai)

1. **Guru membuat tugas** observasi (tenggat, rubrik, target) → dipublikasikan ke kelas.
2. **Murid membuka Input Observasi**, memilih tugas, memindai tanaman. Model klien memberi Top-5 + skor.
3. **Klien menyusun observasi lokal:** kompresi, hapus EXIF, ambil GPS, buat `client_uuid`, simpan ke IndexedDB (status `queued`).
4. **Sinkronisasi (saat online):**
   1. `POST /api/observations` dengan metadata (tanpa biner) dan header `Idempotency-Key = client_uuid` → server membuat record `status=uploading` dan mengembalikan daftar `media_id`.
   2. `POST /api/uploads/presign` per foto → server mengembalikan URL PUT R2 terikat (kunci objek, content-type, ukuran maksimum, kedaluwarsa 5 menit).
   3. Klien PUT langsung ke R2 (multipart bila > 5 MB, dengan retry eksponensial + jitter, dapat dilanjutkan per bagian).
   4. `POST /api/observations/:id/finalize` → server memverifikasi objek di R2 (`HEAD`: ukuran, tipe), menyimpan metadata, menandai `status=pending_review`, memicu pembuatan varian thumbnail (worker/Cloudflare Images/Worker) dan menautkan ke tugas.
5. **Media Explore:** observasi tampil di peta/galeri dengan lencana 'Menunggu verifikasi' (visibilitas sesuai 3.7.4).
6. **Guru memverifikasi** di antrean: setujui / koreksi spesies / minta perbaikan / tolak. Keputusan mengubah status (`verified`, `needs_revision`, `rejected`), memberi lencana, menyimpan `verified_taxon_id`, dan mencatat apakah saran ML benar (untuk evaluasi model).
7. **Penilaian:** guru mengisi rubrik; nilai tugas dihitung (bobot rubrik) dan dikirim ke buku nilai; murid diberi notifikasi in-app. Murid dapat merevisi dan mengirim ulang saat `needs_revision` (riwayat versi tersimpan).
8. **Pengayaan data:** observasi terverifikasi masuk dataset pelatihan (dengan persetujuan kebijakan sekolah) dan menaikkan statistik spesies/peta.

Penanganan kegagalan: kegagalan di langkah 4.3 tidak menggandakan observasi karena idempotensi; record `uploading` yang tidak di-finalize dalam 24 jam dibersihkan job (objek R2 yatim dihapus oleh lifecycle rule).

### 4.2 Alur Fallback: Confidence Score ML Rendah

1. Skor Top-1 < 0,50 atau selisih Top-1 dan Top-2 < 0,10 → UI menampilkan 'Kami belum yakin'.
2. Aplikasi menawarkan berurutan: (a) **Foto ulang berpanduan** (tips: dekatkan daun, cahaya cukup, latar polos; maks 2 percobaan); (b) **Pilih manual** lewat pencarian taksonomi atau penelusuran bertahap (famili/ciri: bentuk daun, bunga) dari data master; (c) **Kirim sebagai 'Belum teridentifikasi'** (`taxon_id` kosong, tingkat taksonomi tertinggi yang diketahui, mis. 'Famili Fabaceae', opsional).
3. Observasi berflag `low_confidence` masuk antrean guru dengan prioritas identifikasi, siswa tetap dapat menilai catatan lapangan dan kualitas foto pada rubrik.
4. Chatbot menawarkan bantuan ciri-ciri pembeda ('Apakah daunnya berseling atau berhadapan?') untuk membantu identifikasi manual, tanpa mengklaim kepastian.
5. Keputusan akhir guru dicatat sebagai label bernilai tinggi untuk pelatihan ulang (active learning).

### 4.3 Alur Ujian Serentak

Guru menerbitkan kuis → paket soal diprapanaskan ke Redis 10 menit sebelum jendela buka → murid mulai (Redis memberi paket soal, DB mencatat attempt) → autosave jawaban ke Redis dan antrean tulis ke PostgreSQL → submit → penilaian otomatis (worker) → rekap. Detail pada bagian 5.5.

## 5. Arsitektur Teknis & Desain Database

### 5.1 Arsitektur Tingkat Tinggi

- **Klien (SPA):** React + Vite + TS, TanStack Router (route-level code splitting, loader prefetch), TanStack Query (cache, optimistic update, persist offline), Shadcn UI + Tailwind (hanya komponen dipakai), React-Leaflet dimuat lazy hanya pada halaman peta. Service Worker (Workbox) untuk app shell, model ML, tile, dan background sync. Web Worker untuk kompresi gambar dan inferensi.
- **API:** Node.js + Hono (stateless, horizontal scaling di belakang load balancer). Hono RPC mengekspor tipe `AppType` ke klien; validasi dengan Zod (validator Hono) sehingga skema runtime = tipe compile-time. Prefix `/api/v1`.
- **Data:** PostgreSQL 16 + PostGIS via Drizzle ORM; PgBouncer (transaction pooling); read replica untuk analitik/galeri. Redis untuk cache, rate limit, antrean (BullMQ), dan pub/sub. Cloudflare R2 untuk objek; CDN di depannya.
- **Worker latar:** BullMQ untuk auto-submit kuis, penilaian, pembuatan thumbnail, refresh agregat analitik, pembersihan objek yatim, ekspor.
- **Observabilitas:** log terstruktur (pino), tracing (OpenTelemetry), metrik (Prometheus/Grafana), error tracking (Sentry), dashboard khusus 'hari ujian'.

### 5.2 Skema Database (PostgreSQL + PostGIS)

Konvensi: PK `uuid` (v7, terurut waktu), `created_at/updated_at timestamptz`, soft delete `deleted_at` pada entitas konten pengguna. Ekstensi: `postgis`, `pg_trgm`, `citext`.

| Tabel | Kolom Utama | Relasi / Catatan |
| --- | --- | --- |
| `users` | id, email (citext, unik), username (unik), password\_hash, role (admin/teacher/student), full\_name, avatar\_key, is\_active, last\_login\_at, settings (jsonb) | – |
| `classes` | id, name, school\_year, created\_by | – |
| `class_members` | class\_id, user\_id, role\_in\_class | PK (class\_id, user\_id); FK ke classes, users |
| `courses` | id, teacher\_id, title, description, status, cover\_key, published\_at | FK users |
| `course_classes` | course\_id, class\_id | PK gabungan; menentukan kelas yang mengakses course |
| `modules` | id, course\_id, position, title, status | FK courses; unik (course\_id, position) |
| `materials` | id, module\_id, position, type (text/video/document), title, content (jsonb), media\_key, version | FK modules; content berisi blok terstruktur |
| `material_progress` | user\_id, material\_id, status, progress\_pct, completed\_at | PK (user\_id, material\_id) |
| `question_bank` | id, teacher\_id, type, body (jsonb), options (jsonb), answer\_key (jsonb), explanation, tags text\[\], difficulty, version | answer\_key tidak pernah diekspos ke siswa |
| `quizzes` | id, course\_id, module\_id, title, duration\_sec, opens\_at, closes\_at, max\_attempts, shuffle, review\_policy, config (jsonb) | FK courses |
| `quiz_questions` | quiz\_id, question\_id, position, points, snapshot (jsonb) | snapshot soal dibekukan saat terbit |
| `quiz_attempts` | id, quiz\_id, user\_id, attempt\_no, started\_at, deadline\_at, submitted\_at, status, score, seed | unik parsial (quiz\_id, user\_id) WHERE status='in\_progress' |
| `attempt_answers` | attempt\_id, question\_id, answer (jsonb), client\_seq, is\_correct, points, graded\_by, feedback, answered\_at | PK (attempt\_id, question\_id) |
| `taxa` | id, parent\_id, rank, scientific\_name, common\_names (jsonb), iucn\_status, is\_sensitive, ml\_label (unik), path (ltree) | self-reference; indeks trigram pada nama |
| `assignments` | id, course\_id, title, instructions, due\_at, rubric (jsonb), target (jsonb), area (geography polygon, null), weight | FK courses |
| `observations` | id, client\_uuid, user\_id, assignment\_id (null), taxon\_id (saran siswa), verified\_taxon\_id, status (draft/uploading/pending\_review/verified/needs\_revision/rejected), ml\_top (jsonb), ml\_model\_version, ml\_confidence, low\_confidence, geom geography(Point,4326), geom\_public geography(Point,4326), gps\_accuracy\_m, location\_source, observed\_at, notes, habitat, verified\_by, verified\_at, visibility, deleted\_at | FK users, taxa, assignments; unik (user\_id, client\_uuid) |
| `observation_media` | id, observation\_id, object\_key, thumb\_key, mime, bytes, width, height, phash, position, status | FK observations |
| `observation_reviews` | id, observation\_id, reviewer\_id, decision, corrected\_taxon\_id, comment, ml\_was\_correct, created\_at | riwayat keputusan (append-only) |
| `assignment_submissions` | id, assignment\_id, user\_id, status, score, rubric\_scores (jsonb), feedback, graded\_by | unik (assignment\_id, user\_id) |
| `submission_observations` | submission\_id, observation\_id | menautkan banyak observasi ke satu pengumpulan |
| `comments`, `reports` | id, observation\_id/entity, user\_id, body/reason, hidden\_at/status | moderasi |
| `badges`, `user_badges` | kode, nama, kriteria; user\_id, badge\_id, awarded\_at | gamifikasi |
| `chat_sessions`, `chat_messages` | id, user\_id, context\_type, context\_id; session\_id, role, content, tokens, feedback | retensi 90 hari |
| `ml_models` | id, version, task, object\_key, sha256, size\_bytes, labels (jsonb), is\_active, metrics (jsonb) | satu aktif per task |
| `audit_logs` | id, actor\_id, action, entity\_type, entity\_id, ip, meta (jsonb), created\_at | append-only; dipartisi bulanan |

### 5.3 Indeks Performa

- `observations`: GiST pada `geom_public`; BRIN pada `observed_at`; B-tree komposit `(status, created_at DESC)`, `(user_id, created_at DESC)`, `(assignment_id, status)`; indeks parsial `WHERE status='pending_review'` untuk antrean guru; unik `(user_id, client_uuid)` untuk idempotensi.
- `taxa`: GIN trigram pada `scientific_name` dan nama lokal; indeks `parent_id`; unik `ml_label`.
- `quiz_attempts`: unik parsial in-progress; indeks `(quiz_id, status)`; indeks parsial `(deadline_at) WHERE status='in_progress'` untuk job auto-submit.
- `attempt_answers`: PK komposit; pertimbangkan partisi hash pada `attempt_id` bila melebihi 100 juta baris.
- `material_progress`, `class_members`: indeks sekunder pada sisi kebalikan PK.
- `audit_logs`: partisi per bulan + BRIN `created_at`.
- Kueri peta: gunakan `geom_public && ST_MakeEnvelope(...)` (memanfaatkan GiST) dan klaster dengan `ST_SnapToGrid`; materialized view `taxon_cell_counts` per sel grid/zoom untuk zoom rendah.
- Terapkan `EXPLAIN ANALYZE` pada kueri utama di CI terhadap data sintetis 5 juta observasi.

### 5.4 Distribusi Model ML

Model disimpan di R2 dengan nama berversi (`models/{task}/{version}/model.onnx`) dan manifest `latest.json` kecil. Klien membandingkan versi saat startup, mengunduh diam-diam di Wi-Fi bila ada pembaruan, dan mempertahankan versi lama sampai yang baru lolos verifikasi checksum. Setiap observasi mencatat `ml_model_version` agar akurasi dapat dianalisis per versi. Rollback = mengubah manifest.

### 5.5 Strategi Caching Redis untuk Ujian Serentak

**Masalah:** ribuan siswa memulai kuis dalam hitungan detik (thundering herd) dan menyimpan jawaban terus-menerus.

1. **Prapanas (warm-up):** job menyusun paket soal (tanpa kunci) ke `quiz:{id}:v{version}:paper` (JSON terkompresi) 10 menit sebelum `opens_at`; TTL hingga `closes_at + 1 jam`. Kunci jawaban disimpan terpisah di `quiz:{id}:keys` dan hanya diakses worker.
2. **Cache-aside + single-flight:** bila kunci hilang, hanya satu request yang membangun ulang (lock `SET NX PX`), lainnya menunggu atau retry singkat untuk mencegah stampede; tambahkan jitter pada TTL.
3. **Mulai attempt:** `INSERT ... ON CONFLICT DO NOTHING` terhadap indeks unik parsial in-progress sehingga idempoten; seed disimpan di `quiz_attempts`.
4. **Autosave jawaban:** `HSET attempt:{id}:answers {qid} {payload}` dengan skrip Lua 'tulis jika `client_seq` lebih baru'. Penulisan ke PostgreSQL dilakukan **batch** oleh worker (mis. tiap 5 dtk dan saat submit) dengan `INSERT ... ON CONFLICT DO UPDATE WHERE client_seq <` nilai baru, sehingga beban tulis DB turun > 90%. Ketahanan: Redis dengan AOF `everysec` dan replika; pada submit, jawaban dikonsolidasikan ke PostgreSQL secara sinkron sebelum konfirmasi (sumber kebenaran akhir).
5. **Timer:** `deadline_at` disimpan di DB dan `attempt:{id}:meta`; job BullMQ tertunda (delayed) pada deadline untuk auto-submit.
6. **Rate limit:** sliding window per user (PATCH jawaban ≤ 5/dtk) dan per IP; token bucket untuk endpoint mahal.
7. **Pengaman kapasitas:** pool koneksi DB dibatasi lewat PgBouncer; antrean tulis tidak pernah memblokir request; *load shedding* menolak endpoint non-kritis (analitik, galeri) saat CPU > 85% agar jalur ujian diprioritaskan; klien menangani HTTP 503 + `Retry-After` dengan jitter.
8. **Uji beban wajib:** skenario k6 5.000 pengguna mulai dalam 60 dtk dan menjawab 1 soal per 10 dtk selama 45 menit; lulus bila p95 < 300 ms dan 0 jawaban hilang pada uji kill-Redis/failover.
9. **Cache lain:** materi (`material:{id}:v{version}`, TTL 1 jam + invalidasi saat publish), daftar course siswa (TTL 60 dtk), tile klaster peta (`map:{zoom}:{bbox_hash}`, TTL 60–300 dtk), sesi/refresh token, ringkasan konteks chatbot.

### 5.6 Daftar Endpoint Utama Hono API (`/api/v1`)

| Domain | Endpoint | Peran | Keterangan |
| --- | --- | --- | --- |
| Auth | `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `POST /auth/activate`, `GET/PATCH /me` | Semua | Rate limit & rotasi token |
| Admin | `GET/POST/PATCH /admin/users`, `POST /admin/users/import`, `CRUD /admin/classes`, `CRUD /admin/taxa`, `GET /admin/audit-logs`, `GET/POST /admin/ml-models`, `GET/PATCH /admin/reports` | Admin | Impor idempoten |
| Course | `GET /courses`, `GET /courses/:id`, `CRUD /courses`, `CRUD /courses/:id/modules`, `CRUD /modules/:id/materials`, `POST /materials/:id/progress` | Guru/Murid | Scope kelas |
| Dokumen | `GET /materials/:id/download` | Murid | Presigned GET |
| Kuis | `CRUD /question-bank`, `CRUD /quizzes`, `POST /quizzes/:id/attempts`, `PATCH /attempts/:id/answers`, `POST /attempts/:id/submit`, `GET /attempts/:id/result` | Guru/Murid | Idempotensi & seq |
| Penilaian | `GET /grading/essays`, `PATCH /attempt-answers/:id/grade` | Guru | Antrean esai |
| Tugas | `CRUD /assignments`, `GET /assignments/mine`, `POST /assignments/:id/submissions`, `PATCH /submissions/:id/grade` | Guru/Murid | Rubrik |
| Upload | `POST /uploads/presign`, `POST /uploads/multipart/{init,part,complete}` | Murid/Guru | Lihat 6.2 |
| Observasi | `POST /observations`, `POST /observations/:id/finalize`, `PATCH/DELETE /observations/:id`, `GET /observations/mine`, `POST /observations/:id/review`, `GET /review/queue` | Murid/Guru | Idempotency-Key |
| Explore | `GET /explore/map?bbox=&zoom=&taxon=&status=`, `GET /explore/feed?cursor=&filters`, `GET /explore/observations/:id`, `POST /observations/:id/comments`, `POST /reports` | Semua | Cache + klaster |
| Taksonomi | `GET /taxa/search?q=`, `GET /taxa/:id` | Semua | Trigram |
| ML | `GET /ml/manifest` | Semua | ETag, cache panjang |
| Chat | `POST /chat/stream` (SSE), `GET /chat/sessions`, `POST /chat/messages/:id/feedback` | Murid/Guru | Rate limit & kuota |
| Analitik | `GET /analytics/classes/:id`, `GET /analytics/me` | Guru/Murid | Dari agregat |
| Sistem | `GET /healthz`, `GET /readyz` | Internal | Probe |

Semua respons memakai format error seragam `{code, message, details}`, paginasi cursor, versi API, serta tipe yang diekspor lewat Hono RPC (`hc<AppType>`).

## 6. Kebutuhan Non-Fungsional (NFR)

### 6.1 Performa & Skalabilitas

| Aspek | Target |
| --- | --- |
| Bundle awal (JS gzip) | ≤ 180 KB; halaman peta/ML dimuat lazy |
| LCP pada 4G ponsel menengah | ≤ 2,5 dtk; TTI ≤ 4 dtk |
| Latensi API (p95) | baca ≤ 200 ms; tulis ≤ 300 ms; simpan jawaban ≤ 300 ms |
| Konkurensi ujian | ≥ 5.000 attempt aktif; headroom 2× |
| Kueri peta (p95) | ≤ 400 ms untuk 1 juta observasi |
| TTFB token chatbot | ≤ 2 dtk |
| Inferensi ML klien | ≤ 700 ms per frame; model ≤ 10 MB |
| Skalabilitas | API stateless dengan autoscale horizontal; DB: replika baca dan partisi tabel besar; R2 + CDN untuk media |

Hemat kuota: kompresi Brotli, gambar WebP/AVIF responsif, tanpa autoplay, mode hemat data, paginasi kecil, respons hanya memuat kolom yang diperlukan, ETag/304.

### 6.2 Keamanan

**Presigned URL (Cloudflare R2, API kompatibel S3)**

1. URL dibuat hanya setelah otorisasi (peran, kuota, kepemilikan observasi): kedaluwarsa 5 menit untuk PUT dan 10 menit untuk GET.
2. Kunci objek ditentukan server, bukan klien: `obs/{userId}/{observationId}/{mediaId}.{ext}`; path dari klien tidak pernah diterima (mencegah path traversal/overwrite).
3. Batasan ditandatangani: `Content-Type` ∈ {image/webp, image/jpeg, image/png} dan `Content-Length` ≤ 2 MB. Karena R2 tidak mendukung POST policy bersyarat penuh, ukuran dan tipe divalidasi ulang saat `finalize` lewat `HEAD` + pemeriksaan magic bytes oleh worker; objek yang tidak lolos dihapus dan observasi ditolak.
4. Bucket privat; media publik disajikan lewat domain CDN dengan varian; media draf/belum diverifikasi lewat URL bertanda tangan berumur pendek. CORS dibatasi pada origin aplikasi dan metode PUT/GET.
5. Kuota: ≤ 30 presign/menit/user dan ≤ 100 MB/hari/user; moderasi gambar otomatis (klasifier konten) pada P1, dengan tombol laporkan pada MVP.
6. Lifecycle rule R2 menghapus objek di prefiks `tmp/` dan objek yatim setelah 24 jam.

**Keamanan umum:** HTTPS/HSTS; CSP ketat; cookie refresh token `httpOnly; Secure; SameSite=Lax`; proteksi CSRF; validasi Zod di semua input; ORM parametris (anti-SQL injection); sanitasi konten rich text (anti-XSS); rate limiting berlapis; RBAC server-side; rahasia di secret manager; audit log; backup harian + PITR PostgreSQL (RPO ≤ 5 menit, RTO ≤ 1 jam); minimisasi PII anak dan kebijakan retensi sesuai UU PDP Indonesia; EXIF dibuang; koordinat presisi tidak pernah publik.

### 6.3 Ketahanan Offline (Offline-Resilience di Lapangan)

1. **PWA:** app shell, rute observasi, dan model ML di-pre-cache Service Worker (Workbox); halaman observasi berfungsi penuh tanpa jaringan setelah kunjungan pertama. Pengguna disarankan 'Siapkan mode lapangan' (unduh model + tile area sekolah) saat memiliki Wi-Fi.
2. **Penyimpanan lokal:** IndexedDB (Dexie) menyimpan observasi, blob foto terkompresi, dan status antrean; minta `navigator.storage.persist()` dan pantau kuota (peringatan pada penggunaan > 80%; batas default 50 observasi tertunda).
3. **Antrean unggah (outbox pattern):** mesin status per item (`queued → uploading → uploaded → finalized | failed`), unggah dengan konkurensi 2, retry eksponensial + jitter, dapat dilanjutkan dari bagian multipart terakhir, dan aktif kembali otomatis saat event `online`/foreground. Background Sync API dipakai bila tersedia (Chromium); pada iOS/Safari yang belum mendukungnya, sinkronisasi berjalan saat aplikasi dibuka kembali dan pengguna melihat indikator jelas.
4. **Mode hemat data:** opsi unggah hanya lewat Wi-Fi; antrean menampilkan perkiraan ukuran.
5. **Konflik & idempotensi:** `client_uuid` menjamin tidak ada duplikat; edit setelah sinkron memakai `version`/ETag (If-Match), dan konflik ditampilkan ke siswa bila guru telah mengubah status. Server menang untuk status dan verifikasi; klien menang untuk konten draf miliknya.
6. **Kuis offline:** tidak didukung penuh demi integritas; namun jaringan putus sementara ditoleransi lewat penyimpanan jawaban lokal dan sinkronisasi saat tersambung selama `deadline_at` belum lewat.
7. **Data peta:** tile di-cache untuk area terbatas; titik GPS tetap tercatat offline; geocoding nama wilayah ditunda sampai online.
8. **Pengujian:** profil jaringan 2G/3G lambat, mode pesawat di tengah unggah, dan penutupan browser di tengah multipart masuk dalam suite E2E (Playwright + throttling).

### 6.4 Keandalan, Keterpantauan, Aksesibilitas

- Ketersediaan 99,9% pada jam ujian; health check, autoscale, deploy bergulir tanpa downtime, feature flag, dan *freeze* rilis 24 jam sebelum ujian besar.
- Dashboard 'ujian live': attempt aktif, p95 latensi, kedalaman antrean tulis, error rate; alarm otomatis.
- Aksesibilitas WCAG 2.1 AA (kontras, navigasi keyboard, label ARIA, teks alternatif foto, alternatif daftar untuk peta); lokalisasi Bahasa Indonesia dengan i18n siap multi-bahasa; mobile-first, mendukung Android 8+ dan iOS 15+.
- Kualitas ML: pemantauan akurasi dari keputusan guru, deteksi drift, evaluasi bias (spesies lokal vs global) pada setiap rilis model.

## 7. Roadmap Pengembangan

### 7.1 MVP (± 4–5 bulan)

| Sprint | Cakupan |
| --- | --- |
| 1–2 | Fondasi: monorepo (Hono RPC + Vite), CI/CD, skema DB inti, auth + RBAC, dashboard Admin (user, kelas, taksonomi), audit log |
| 3–4 | Course/materi, progres, halaman utama siswa, dashboard guru dasar |
| 5–6 | Bank soal, kuis berwaktu, autosave + Redis, auto-submit, penilaian otomatis & esai manual, uji beban 1.000 pengguna |
| 7–8 | Input observasi: kamera, kompresi, EXIF, GPS, presigned upload R2, antrean offline dasar, model ML v1 (spesies) di browser |
| 9–10 | Media Explore (peta, klaster, galeri, filter, lencana), antrean verifikasi guru, tugas observasi + rubrik, alur fallback confidence rendah |
| 11–12 | Chatbot SSE kontekstual, hardening keamanan, uji beban 5.000 pengguna, aksesibilitas, UAT sekolah percontohan |

**Kriteria rilis MVP:** semua P0 lulus acceptance criteria; uji beban ujian 5.000 serentak lulus; 0 kebocoran kunci jawaban pada uji keamanan; observasi offline tersinkron ≥ 98% pada uji lapangan; pentest tanpa temuan kritis/tinggi yang terbuka.

### 7.2 Fase Lanjutan

| Fase | Fitur |
| --- | --- |
| 2 (bulan 6–9) | Deteksi penyakit tanaman (model kedua), materi offline, web-push, gamifikasi (lencana, papan peringkat kelas), proctoring ringan, ekspor nilai/rapor, impor soal format QTI/Moodle XML |
| 3 (bulan 10–14) | PWA terpasang penuh + background sync lanjutan, moderasi gambar otomatis, active learning (pelatihan ulang model dari label guru) dengan pipeline MLOps, kolaborasi antar-sekolah, kontribusi ke GBIF/iNaturalist (dengan persetujuan & pengaburan lokasi) |
| 4 | Analitik prediktif (risiko siswa tertinggal), rekomendasi materi adaptif, multi-tenant penuh untuk banyak sekolah/dinas, pencarian visual (similarity) di galeri |

### 7.3 Risiko Utama & Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Akurasi model rendah untuk flora lokal | Frustrasi siswa, beban guru | Dataset lokal, ambang konservatif, fallback manual, human-in-the-loop, metrik per versi |
| Perangkat siswa lemah / tanpa WebGL | Inferensi lambat atau gagal | Fallback WASM bertingkat, model terkuantisasi, mode tanpa ML |
| Lonjakan ujian melebihi kapasitas | Kuis gagal | Prapanas, autosave via Redis, load shedding, uji beban rutin, rilis beku |
| Kebocoran lokasi spesies langka / data anak | Risiko keselamatan & satwa | Pengaburan koordinat, flag sensitif, EXIF dibuang, pemisahan data presisi |
| Biaya/limit API Gemini | Chatbot tidak tersedia | Kuota, caching konteks, circuit breaker, pesan fallback, pemantauan biaya |
| iOS membatasi Background Sync & storage | Sinkronisasi tertunda | Sinkronisasi saat foreground, indikator jelas, peringatan kuota IndexedDB |
| Penyalahgunaan unggahan | Konten tidak pantas | Presigned terbatas, validasi tipe, laporan & moderasi, review guru sebelum publik |

### 7.4 Asumsi & Pertanyaan Terbuka

1. Apakah observasi belum terverifikasi boleh tampil publik, atau hanya setelah disetujui guru? (Default PRD: hanya terverifikasi.)
2. Sumber dan lisensi dataset pelatihan model ML, serta kebutuhan persetujuan orang tua untuk data anak.
3. Penyedia tile peta dan batas penggunaannya (tile publik OSM tidak untuk lalu lintas besar; pertimbangkan penyedia berbayar atau self-host).
4. Hosting video: R2/CDN sendiri atau embed pihak ketiga.
5. Skala target multi-sekolah pada tahun pertama, untuk menentukan kebutuhan partisi dan topologi Redis (cluster vs single).
