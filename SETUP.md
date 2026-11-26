# Setup Backend dan Database FloraLearn

Dokumen ini menjelaskan rencana setup backend dan database sesuai arsitektur di
[PRD.md](./PRD.md), untuk development di WSL 2 dan pengelolaan database memakai
DBeaver.

> **Kondisi repository saat ini:** aplikasi masih berupa frontend Vite dan
> beberapa fitur demo menyimpan data di `localStorage`. Belum ada API Hono,
> koneksi PostgreSQL, migrasi Drizzle, ataupun file Docker Compose. Ikuti
> langkah di bawah untuk menyiapkan fondasi; data browser yang sudah ada tidak
> otomatis dipindahkan ke database.

## 1. Arsitektur development yang dituju

```text
Browser
  └── React + Vite (http://localhost:3000)
        └── Hono API (http://localhost:8787/api/v1)
              ├── PostgreSQL 16 + PostGIS (localhost:54329)
              └── Redis 7 (localhost:6379)

DBeaver di Windows ───────────────> PostgreSQL di Docker Desktop / WSL 2
```

Komponen API yang disarankan:

- **Hono + Node.js** untuk API stateless, dengan Hono RPC untuk kontrak tipe
  frontend/backend.
- **Zod + `@hono/zod-validator`** untuk validasi input.
- **PostgreSQL 16 + PostGIS**, diakses menggunakan **Drizzle ORM** dan driver
  `pg`.
- **Redis 7** sebagai fondasi cache, rate limit, dan antrean BullMQ. Tahap awal
  dapat menjalankan Redis tanpa worker; job kuis dan pekerjaan latar
  ditambahkan saat fitur terkait mulai dibuat.
- **Pino** untuk log terstruktur dan **Vitest** untuk test.
- **Cloudflare R2** dan Gemini hanya diperlukan saat mengimplementasikan fitur
  upload/AI; kredensialnya tidak dibutuhkan untuk menyalakan fondasi lokal.

Untuk menghindari pemindahan frontend besar-besaran di awal, pertahankan
frontend di root repository dan tambahkan aplikasi API di `server/`. Jalankan
Vite dan Hono di terminal terpisah. Ini dapat dirapikan menjadi workspace
monorepo kemudian.

## 2. Prasyarat WSL

### 2.1 Siapkan WSL 2

Gunakan distro Linux berbasis Ubuntu di WSL 2. Di PowerShell Windows:

```powershell
wsl --status
wsl --list --verbose
```

Pastikan distro yang dipakai menunjukkan versi `2`. Buka distro tersebut, lalu
jalankan perintah berikut di terminal WSL:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git build-essential
```

Simpan repository di filesystem Linux, misalnya `~/projects/FloraLearn`, bukan
di `/mnt/c/...`. Lokasi Linux biasanya memberikan performa filesystem yang
lebih baik untuk Vite, TypeScript, dan `node_modules`.

### 2.2 Node.js

Gunakan Node.js **22.12 atau lebih baru** agar sesuai dengan toolchain frontend
Vite saat ini. Pilih satu pengelola versi Node yang cocok untuk WSL, seperti
`nvm`, atau instal Node melalui cara yang sudah digunakan di lingkungan Anda.
Jangan memakai instalasi Node Windows dari dalam terminal WSL.

Verifikasi:

```bash
node --version
npm --version
```

Jalankan juga frontend yang sudah ada untuk memastikan dependensinya normal:

```bash
cd ~/projects/FloraLearn
npm ci
npm run dev
```

Frontend saat ini berjalan pada port `3000`.

### 2.3 Docker Desktop

Cara yang direkomendasikan untuk PostgreSQL + PostGIS adalah Docker Desktop di
Windows dengan integrasi WSL:

1. Pastikan Docker Desktop terpasang dan berjalan di Windows.
2. Pada Docker Desktop, aktifkan **Settings → Resources → WSL Integration**.
3. Aktifkan integrasi untuk distro WSL yang dipakai.
4. Buka kembali terminal WSL dan cek:

```bash
docker version
docker compose version
```

Jangan menjalankan PostgreSQL native di WSL dan container PostgreSQL pada port
yang sama. Panduan ini menggunakan Docker Desktop; jika memilih instalasi
native, sesuaikan port dan langkah koneksi DBeaver.

## 3. Menjalankan PostgreSQL dan Redis lokal

Tambahkan `.env.db.example` ke root repository:

```dotenv
POSTGRES_DB=floralearn_dev
POSTGRES_USER=floralearn_admin
POSTGRES_PASSWORD=GANTI_DENGAN_PASSWORD_LOKAL_YANG_KUAT
POSTGRES_PORT=54329
REDIS_PORT=6379
```

Buat `.env.db` lokal dan ganti password-nya:

```bash
cp .env.db.example .env.db
openssl rand -hex 32
```

Salin hasil `openssl` ke `POSTGRES_PASSWORD` di `.env.db`. **Jangan commit file
`.env.db`.** `.gitignore` saat ini mengabaikan `.env`, tetapi belum mencakup
`.env.db`. Tambahkan aturan berikut sebelum menyimpan kredensial:

```gitignore
.env.*
!.env.*.example
```

Tambahkan `compose.yaml` pada root repository:

```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4
    restart: unless-stopped
    env_file:
      - .env.db
    ports:
      - "127.0.0.1:${POSTGRES_PORT:-54329}:5432"
    volumes:
      - floralearn_postgres_data:/var/lib/postgresql/data
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U \"$${POSTGRES_USER}\" -d \"$${POSTGRES_DB}\"",
        ]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    ports:
      - "127.0.0.1:${REDIS_PORT:-6379}:6379"
    volumes:
      - floralearn_redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  floralearn_postgres_data:
  floralearn_redis_data:
```

Jalankan service dari root repository:

```bash
docker compose --env-file .env.db up -d
docker compose ps
docker compose logs --tail=100 postgres
```

`postgres` seharusnya menjadi `healthy`; Redis dapat dicek dengan:

```bash
docker compose exec redis redis-cli ping
```

Output normalnya `PONG`. Jika port `54329` atau `6379` sudah dipakai, ubah
nilainya di `.env.db`, lalu jalankan ulang Compose.

### Catatan koneksi

- Dari proses Node yang dijalankan langsung di WSL, PostgreSQL dapat diakses
  melalui `127.0.0.1:54329` dan Redis melalui `127.0.0.1:6379`.
- Dari container API yang nanti ditambahkan ke Compose, gunakan nama service
  dan port internal: `postgres:5432` serta `redis:6379`.
- Port database dan Redis di Compose diikat ke `127.0.0.1`, bukan semua
  interface jaringan. Pertahankan ini untuk development lokal.

## 4. Membuat ekstensi dan role database

### 4.1 Sambungkan DBeaver

Buat koneksi baru di DBeaver:

| Field | Nilai |
| --- | --- |
| Driver | PostgreSQL |
| Host | `localhost` |
| Port | `54329` (atau nilai `POSTGRES_PORT`) |
| Database | `floralearn_dev` |
| Username | Nilai `POSTGRES_USER` di `.env.db` |
| Password | Nilai `POSTGRES_PASSWORD` di `.env.db` |
| SSL | Nonaktif untuk database lokal |

Klik **Test Connection**, unduh driver jika diminta, lalu **Finish**. DBeaver
Windows biasanya dapat mengakses port WSL 2/Docker Desktop melalui `localhost`.
Jangan menggunakan IP WSL kecuali port forwarding localhost memang tidak
tersedia.

### 4.2 Aktifkan ekstensi Postgres

Di DBeaver, buka SQL Editor pada database `floralearn_dev` dan jalankan sebagai
akun admin development:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS ltree;
```

Ekstensi tersebut berasal dari rancangan PRD:

- `postgis` untuk geometri/geografi observasi dan area tugas.
- `citext` untuk email/username yang tidak peka huruf besar-kecil.
- `pg_trgm` untuk pencarian nama taksonomi.
- `ltree` untuk jalur hierarki taksonomi.

Verifikasi:

```sql
SELECT version();
SELECT postgis_full_version();
SELECT extname
FROM pg_extension
WHERE extname IN ('postgis', 'citext', 'pg_trgm', 'ltree')
ORDER BY extname;
```

### 4.3 Pisahkan role migrasi dan runtime

Untuk development sederhana, akun `POSTGRES_USER` dibuat sebagai admin
database oleh image Docker. Gunakan akun tersebut untuk setup awal melalui
DBeaver, bukan sebagai credential API jangka panjang.

Buat role terpisah untuk migrasi dan request aplikasi. Ganti nilai password
contoh sebelum menjalankan SQL:

```sql
CREATE ROLE floralearn_migrator LOGIN PASSWORD 'GANTI_PASSWORD_MIGRATOR';
CREATE ROLE floralearn_app LOGIN PASSWORD 'GANTI_PASSWORD_RUNTIME';

GRANT CONNECT ON DATABASE floralearn_dev TO floralearn_migrator, floralearn_app;
CREATE SCHEMA app AUTHORIZATION floralearn_migrator;
GRANT USAGE ON SCHEMA app TO floralearn_app;

ALTER DEFAULT PRIVILEGES FOR ROLE floralearn_migrator IN SCHEMA app
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO floralearn_app;
ALTER DEFAULT PRIVILEGES FOR ROLE floralearn_migrator IN SCHEMA app
  GRANT USAGE, SELECT ON SEQUENCES TO floralearn_app;
ALTER DEFAULT PRIVILEGES FOR ROLE floralearn_migrator IN SCHEMA app
  GRANT USAGE ON TYPES TO floralearn_app;
```

Gunakan `floralearn_migrator` untuk membuat dan menjalankan migrasi Drizzle.
Gunakan `floralearn_app` untuk koneksi request API. Role runtime tidak boleh
memiliki izin `CREATE`, `ALTER`, `DROP`, atau superuser. Untuk prototype lokal,
kredensial boleh berada di file env yang di-ignore; jangan menggunakan pola
password development tersebut di server publik.

> Bila migration atau driver memerlukan akses ke fungsi PostGIS yang dipasang
> di schema `public`, pastikan `public` ada di `search_path`, atau berikan
> `USAGE` pada schema ekstensi secara eksplisit. Jangan memindahkan objek
> ekstensi secara manual setelah dipasang.

## 5. Membuat aplikasi Hono

### 5.1 Struktur folder yang disarankan

Pertahankan aplikasi Vite yang ada di root dan buat struktur API berikut:

```text
server/
├── drizzle/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── db/
│   │   ├── client.ts
│   │   └── schema/
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── error-handler.ts
│   ├── routes/
│   │   └── v1/
│   ├── schemas/
│   ├── services/
│   └── workers/
├── .env
├── .env.example
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### 5.2 Inisialisasi package

Jalankan dari root repository:

```bash
mkdir -p server/src/{db/schema,middleware,routes/v1,schemas,services,workers}
cd server
npm init -y
npm pkg set type=module
npm install hono @hono/node-server @hono/zod-validator zod drizzle-orm pg dotenv pino argon2
npm install -D typescript tsx drizzle-kit @types/node @types/pg vitest
npx tsc --init
```

Perbarui `server/package.json` agar memiliki script berikut:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "test": "vitest run"
  }
}
```

Buat `server/tsconfig.json` dengan module mode Node:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": false
  },
  "include": ["src/**/*.ts"]
}
```

Di backend ESM, gunakan ekstensi `.js` pada relative import TypeScript, misalnya
`import { app } from './app.js'`, sesuai aturan resolusi NodeNext.

### 5.3 Konfigurasi env API

Buat `server/.env.example`:

```dotenv
NODE_ENV=development
HOST=0.0.0.0
PORT=8787

# Encode karakter khusus password sebagai URL encoding.
DATABASE_URL=postgresql://floralearn_app:GANTI_PASSWORD_RUNTIME@127.0.0.1:54329/floralearn_dev
REDIS_URL=redis://127.0.0.1:6379

# Daftar origin eksplisit; jangan gunakan * bersama credential/cookie.
CORS_ORIGINS=http://localhost:3000

# Buat secret acak sendiri; jangan gunakan nilai contoh.
ACCESS_TOKEN_SECRET=GANTI_DENGAN_SECRET_ACAK
ACCESS_TOKEN_TTL_SECONDS=900
REFRESH_TOKEN_TTL_DAYS=30
```

Buat file lokal:

```bash
cp .env.example .env
openssl rand -hex 48
```

Masukkan hasil secret ke `ACCESS_TOKEN_SECRET` dan password runtime pada
`DATABASE_URL`. File env berisi credential tidak boleh masuk Git. Aturan
`.gitignore` pada root yang dijelaskan di atas juga akan mengabaikan
`server/.env` setelah ditambahkan.

Jangan menaruh secret server dalam variabel `VITE_*`; variabel dengan prefix
tersebut tersedia di bundle browser. Gunakan hanya URL API publik seperti
`VITE_API_BASE_URL=http://localhost:8787/api/v1` pada env frontend.

### 5.4 Drizzle config dan koneksi

Buat `server/drizzle.config.ts`:

```ts
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

Deklarasikan tabel di schema Drizzle `app` (misalnya menggunakan
`pgSchema('app')`), bukan `pgTable` di schema `public`. Buat custom type atau
SQL migration terkontrol untuk kolom ekstensi seperti `citext` dan
`geography`; pastikan migration membuat ekstensi sebelum membuat tabel yang
memakainya.

Validasi env wajib saat proses boot, bukan dengan fallback diam-diam. Buat
`server/src/db/client.ts` dengan `pg.Pool` dan `drizzle-orm/node-postgres`:

```ts
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema/index.js'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL wajib diisi.')
}

export const pool = new Pool({
  connectionString,
  max: Number(process.env.DB_POOL_MAX ?? 10),
})

export const db = drizzle(pool, { schema })
```

Tambahkan penanganan penutupan `pool.end()` pada graceful shutdown aplikasi.
Nilai pool di atas hanya contoh awal untuk development; ukuran production harus
disesuaikan dengan kapasitas PostgreSQL dan jumlah replika API. PgBouncer
transaction pooling dari PRD ditambahkan saat beban dan deployment mulai
membutuhkannya.

### 5.5 Health check dan route API pertama

Buat `server/src/app.ts` untuk menyusun instance Hono, middleware CORS,
middleware error terpusat, dan route:

- `GET /healthz`: proses API hidup.
- `GET /readyz`: API dapat mengakses PostgreSQL dan, bila diwajibkan oleh
  feature yang aktif, Redis.
- API bisnis menggunakan prefix `/api/v1`.

Contoh app Hono minimal:

```ts
import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const app = new Hono()

app.use(
  '/api/*',
  cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : null),
    credentials: true,
  }),
)

app.get('/healthz', (c) => c.json({ status: 'ok' }))

export const api = new Hono().basePath('/api/v1')
api.get('/healthz', (c) => c.json({ status: 'ok' }))
app.route('/', api)

export type AppType = typeof app
```

Contoh tersebut hanya memeriksa proses hidup. Implementasi `/readyz` harus
benar-benar melakukan query ringan `SELECT 1` melalui pool dan mengembalikan
status non-2xx bila dependency yang diwajibkan tidak siap. Tambahkan
`@hono/node-server` di `server/src/index.ts` untuk menjalankan `app.fetch`
pada port `8787` dan menutup pool saat proses dihentikan:

```ts
import 'dotenv/config'
import { serve } from '@hono/node-server'
import { app } from './app.js'
import { pool } from './db/client.js'

const port = Number(process.env.PORT ?? 8787)
const hostname = process.env.HOST ?? '0.0.0.0'

const server = serve(
  { fetch: app.fetch, hostname, port },
  (info) => console.log(`Hono API listening on http://${info.address}:${info.port}`),
)

let shuttingDown = false

function shutdown() {
  if (shuttingDown) return
  shuttingDown = true

  server.close(async (error) => {
    if (error) {
      console.error('HTTP server shutdown failed', error)
      process.exitCode = 1
    }

    try {
      await pool.end()
    } catch (error) {
      console.error('Database pool shutdown failed', error)
      process.exitCode = 1
    }
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
```

Semua endpoint yang menerima input harus menggunakan schema Zod melalui
`zValidator`. Daftarkan `onError` dan `notFound` agar API selalu mengembalikan
format error PRD yang konsisten:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Permintaan tidak valid.",
  "details": {}
}
```

Jalankan backend dari terminal WSL terpisah:

```bash
cd ~/projects/FloraLearn/server
npm run dev
```

Cek:

```bash
curl -i http://localhost:8787/healthz
curl -i http://localhost:8787/api/v1/healthz
```

## 6. Skema awal dan migrasi

Gunakan Drizzle sebagai **sumber skema**, dan simpan semua perubahan database
sebagai migration files yang ditinjau sebelum dijalankan. DBeaver dipakai untuk
menjelajah data, menjalankan query development, dan memeriksa rencana kueri;
jangan menjadikan perubahan manual DBeaver sebagai pengganti migration.

### 6.1 Urutan implementasi tabel

Bangun skema bertahap mengikuti dependensi di PRD:

1. **Akun dan kelas:** `users`, `user_sessions` (atau `refresh_tokens` untuk
   menyimpan hash refresh token yang dapat dicabut), `classes`, `class_members`.
2. **Course dan materi:** `courses`, `course_classes`, `modules`, `materials`,
   `material_progress`.
3. **Kuis:** `question_bank`, `quizzes`, `quiz_questions`, `quiz_attempts`,
   `attempt_answers`.
4. **Tugas dan observasi:** `taxa`, `assignments`, `observations`,
   `observation_media`, `observation_reviews`, `assignment_submissions`,
   `submission_observations`.
5. **Komunitas dan administrasi:** `comments`, `reports`, `badges`,
   `user_badges`, `chat_sessions`, `chat_messages`, `ml_models`, `audit_logs`.

Jangan membuat semua tabel fase lanjutan sebelum API dan alur bisnisnya mulai
dibangun. Setiap migration sebaiknya kecil, memiliki tujuan yang jelas, dan
berjalan pada database kosong serta database development yang sudah memiliki
data.

### 6.2 Aturan skema dari PRD

- Gunakan `uuid` sebagai primary key. Untuk baseline PostgreSQL 16, buat UUID
  v7 di layer aplikasi; jangan mengasumsikan fungsi UUID v7 tersedia bawaan.
- Gunakan `snake_case`, `timestamptz` untuk waktu, `text` untuk string, dan
  `jsonb` hanya untuk konten semi-terstruktur.
- `users.email` memakai `citext UNIQUE`; password disimpan sebagai hash Argon2id,
  bukan teks biasa. Jangan pernah mengirim `answer_key` kuis kepada client
  sebelum kebijakan review memperbolehkannya.
- Tambahkan `NOT NULL`, `CHECK`, `UNIQUE`, serta aturan `ON DELETE` sesuai
  makna data. Kolom foreign key yang sering di-join/filter harus diberi indeks
  eksplisit karena PostgreSQL tidak otomatis membuat indeks FK.
- Gunakan `deleted_at` untuk soft delete pada konten yang riwayatnya perlu
  dipertahankan. Log audit bersifat append-only.
- Simpan koordinat presisi dan koordinat publik secara terpisah. Kolom
  geospasial menggunakan PostGIS `geography(Point, 4326)` sesuai PRD.
- Jangan simpan file foto/PDF besar sebagai `bytea`; simpan object key R2 pada
  database. Blob PDF lokal yang sekarang di IndexedDB perlu dipindahkan melalui
  alur upload terotorisasi.

Contoh migration fondasi untuk pengguna di schema `app`:

```sql
CREATE SCHEMA IF NOT EXISTS app;
CREATE TYPE app.user_role AS ENUM ('admin', 'teacher', 'student');

CREATE TABLE app.users (
  id uuid PRIMARY KEY,
  email citext NOT NULL UNIQUE,
  username citext NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role app.user_role NOT NULL,
  full_name text NOT NULL,
  avatar_key text,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
```

ID pada contoh dihasilkan sebagai UUID v7 oleh aplikasi. Penambahan tabel dan
foreign key berikutnya harus menggunakan schema `app` dan mempertahankan tipe
referensi yang konsisten.

### 6.3 Membuat dan menjalankan migration

Setelah schema Drizzle pertama ditambahkan:

```bash
cd server
npm run db:generate
```

Tinjau SQL yang dihasilkan di `server/drizzle/`. Pastikan migration pertama
membuat ekstensi/schema yang diperlukan sebelum membuat kolom yang memakai
`citext`, `geography`, atau tipe ekstensi lain. Migration ekstensi dapat ditulis
sebagai SQL migration manual yang menjadi bagian dari riwayat Drizzle.

Jalankan migration:

```bash
npm run db:migrate
```

Untuk database development yang baru, jangan memakai `drizzle-kit push` sebagai
pengganti migration yang disimpan di Git. Setelah migration berhasil, periksa
di DBeaver:

```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'app'
ORDER BY table_name;
```

Tambahkan seed development lewat script idempoten terpisah, misalnya
`server/src/db/seed.ts`. Seed tidak boleh mengandung password produksi. Akun
demo yang disemai harus menyimpan hash Argon2id dan hanya tersedia pada
development.

## 7. Auth, RBAC, dan keamanan

PRD menetapkan access token singkat (15 menit), refresh token rotating melalui
cookie `httpOnly`, serta password Argon2id. Implementasikan auth server-side
sebelum menghubungkan fitur manajemen user:

1. `POST /api/v1/auth/login` memvalidasi email/password dan status akun.
2. Password diverifikasi dengan Argon2id. Rate limit login berdasarkan akun
   dan IP; PRD menetapkan 5 percobaan gagal per 15 menit.
3. Access token berumur pendek; refresh token disimpan sebagai cookie
   `httpOnly`, `Secure` di production, `SameSite=Lax`, dan dirotasi saat refresh.
4. `POST /api/v1/auth/logout` mencabut refresh token di server dan
   membersihkan cookie.
5. Middleware Hono mengambil identitas dari token, lalu memeriksa role dan
   scope pada setiap endpoint. Jangan menjadikan menu/sidebar atau React state
   sebagai kontrol akses.
6. API admin hanya dapat membuat peran yang diizinkan untuk admin; API guru
   hanya mengizinkan pengelolaan siswa pada kelasnya. Aturan ini harus dicek
   kembali di server, meskipun UI juga membatasi pilihan.
7. Terapkan CORS dengan origin yang eksplisit, validasi Zod, query parameter
   ORM, batas ukuran request, rate limit, dan HTTPS di production.
8. Jangan menyimpan access/refresh token, password, atau data sensitif di
   `localStorage`. `localStorage` boleh tetap dipakai untuk preferensi UI yang
   tidak sensitif.

Untuk development pada localhost, gunakan origin yang konsisten, misalnya
`http://localhost:3000` untuk frontend dan `http://localhost:8787` untuk API.
Jangan mencampur `localhost` dengan `127.0.0.1` pada cookie/CORS tanpa alasan;
browser menganggap keduanya origin berbeda.

## 8. Menghubungkan frontend ke Hono RPC

Setelah `AppType` diekspor dari aplikasi Hono, buat client API di frontend
menggunakan `hc<AppType>` dari `hono/client`. Import tipe server sebagai
**type-only** agar kode server tidak masuk ke bundle browser. Konfigurasikan
`VITE_API_BASE_URL` untuk alamat publik API; jangan menaruh `DATABASE_URL`,
secret token, kredensial Redis, R2, atau Gemini pada variabel `VITE_*`.
Saat mulai membuat client frontend, tambahkan dependency `hono` pada package
root (`npm install hono`). Untuk endpoint auth berbasis cookie, konfigurasikan
client fetch agar mengirim credential (`credentials: 'include'`); jangan
menyimpan token di browser storage.

Pindahkan data satu domain setiap kali:

1. Auth dan user management: ganti `authenticate`/`user-store` dan pembacaan
   sesi lokal dengan endpoint auth dan `/admin/users`.
2. Course, modul, dan progres: ganti operasi `course-store` dengan API yang
   menerapkan akses kelas/course di server.
3. Kuis: buat attempt dan nilai di server; jangan pernah mengirim kunci jawaban
   melalui response siswa.
4. Observasi/upload: simpan metadata di PostgreSQL dan blob ke R2 menggunakan
   presigned URL.

TanStack Query dapat dipakai untuk cache dan invalidasi data API. Jangan
menghapus fallback/demo `localStorage` sebelum alur penggantinya diuji.

### CORS development

Hono harus mengizinkan origin frontend yang tepat, misalnya
`http://localhost:3000`, dan credential hanya jika cookie auth digunakan.
Dengan credential, server wajib mengembalikan origin eksplisit; `*` tidak
diperbolehkan. Pada production, gunakan daftar domain production, HTTPS,
cookie `Secure`, perlindungan CSRF, dan header keamanan.

## 9. Redis dan pekerjaan latar

Redis tersedia di Compose untuk digunakan backend melalui
`REDIS_URL=redis://127.0.0.1:6379`. Tambahkan BullMQ ketika job pertama
dibutuhkan. Berdasarkan PRD, penggunaan lanjutannya mencakup:

- auto-submit kuis pada `deadline_at`;
- pembuatan thumbnail dan pembersihan object yatim;
- refresh agregat analitik;
- antrean pemrosesan jawaban kuis.

Jangan menjadikan Redis sebagai satu-satunya sumber kebenaran. PostgreSQL tetap
menjadi sumber data permanen; sebelum mengonfirmasi submit kuis, konsolidasikan
jawaban ke PostgreSQL seperti yang ditetapkan PRD.

Periksa status Redis:

```bash
docker compose exec redis redis-cli ping
```

DBeaver tidak mengelola Redis. Untuk pemeriksaan sederhana gunakan `redis-cli`
di container; dashboard Redis bukan prasyarat development.

## 10. Perintah sehari-hari

Jalankan tiap proses pada terminal WSL terpisah.

**Terminal 1 — database dan cache**

```bash
cd ~/projects/FloraLearn
docker compose --env-file .env.db up -d
```

**Terminal 2 — backend**

```bash
cd ~/projects/FloraLearn/server
npm run dev
```

**Terminal 3 — frontend**

```bash
cd ~/projects/FloraLearn
npm run dev
```

**Status dan log**

```bash
docker compose ps
docker compose logs -f postgres
docker compose logs -f redis
```

**Hentikan container tanpa menghapus data**

```bash
docker compose down
```

**Hapus container sekaligus database lokal** — tindakan ini menghapus seluruh
data pada volume; lakukan hanya jika memang ingin reset:

```bash
docker compose down -v
```

## 11. Backup dan pemulihan development

Buat backup SQL dari container:

```bash
mkdir -p backups
docker compose exec -T postgres sh -c \
  'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  > "backups/floralearn-$(date +%F-%H%M).sql"
```

Pulihkan backup ke database yang sudah dibuat:

```bash
docker compose exec -T postgres sh -c \
  'psql -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  < backups/NAMA_FILE_BACKUP.sql
```

Folder `backups/` berisi data aplikasi dan sebaiknya masuk `.gitignore`.
Backup development ini bukan pengganti backup production. PRD meminta backup
harian dan point-in-time recovery untuk deployment production.

## 12. Troubleshooting

### DBeaver tidak dapat tersambung

1. Pastikan Docker Desktop aktif dan WSL Integration untuk distro sudah
   diaktifkan.
2. Di WSL jalankan `docker compose ps` dan pastikan `postgres` berstatus
   `healthy`.
3. Pastikan DBeaver memakai `localhost`, port `54329`, database serta user dari
   `.env.db`.
4. Pastikan tidak ada PostgreSQL lain yang memakai port host tersebut. Ubah
   `POSTGRES_PORT` jika perlu dan mulai ulang Compose.
5. Lihat `docker compose logs --tail=100 postgres`.

### API menampilkan connection refused

- Pastikan PostgreSQL dan Redis berjalan.
- Pastikan backend memakai host/port yang tepat: dari WSL gunakan port host
  (`127.0.0.1:54329`); dari container gunakan nama service (`postgres:5432`).
- Pastikan `.env` API benar-benar dibaca oleh Node dan password pada
  `DATABASE_URL` sudah URL-encoded bila mengandung karakter khusus.

### Ekstensi PostGIS tidak ditemukan

- Pastikan Compose menggunakan image PostGIS `postgis/postgis`, bukan image
  PostgreSQL standar.
- Jalankan `SELECT postgis_full_version();` di database yang benar.
- Pastikan ekstensi dibuat oleh role yang berhak sebelum migration membuat
  kolom geography/geometry.

### Perubahan schema tidak muncul di database

- Jalankan `npm run db:generate`, tinjau file SQL yang dibuat, lalu
  `npm run db:migrate`.
- Pastikan backend dan Drizzle menunjuk database/schema yang sama dengan
  koneksi aktif di DBeaver.
- Jangan mengandalkan perubahan manual di DBeaver; buat migration agar perubahan
  dapat diulang oleh anggota tim dan CI.

## 13. Sebelum production

Setup ini hanya untuk development lokal. Sebelum deploy:

- pindahkan secret ke secret manager, rotasi semua password, batasi jaringan DB
  agar tidak publik, aktifkan TLS dan backup/PITR;
- gunakan role database terpisah dengan hak minimum dan PgBouncer bila
  topologi membutuhkan pool transaction;
- pasang Redis terkelola/terproteksi dengan persistence, monitoring, dan
  kebijakan failover;
- konfigurasi domain CORS, cookie `Secure`, CSRF, CSP, HSTS, rate limit,
  observability, alert, serta health/readiness probe;
- uji restore backup, migrasi dari database berisi data, dan beban kueri;
- pastikan RBAC, kepemilikan data siswa, lokasi presisi, dan kunci jawaban
  ditegakkan di server.

Target skala, seluruh endpoint, tabel domain, indeks geospasial, strategi Redis,
dan acceptance criteria tetap mengikuti [PRD.md](./PRD.md). Jangan menganggap
semua fitur tabel/worker di PRD sudah tersedia hanya karena fondasi development
ini sudah hidup.
