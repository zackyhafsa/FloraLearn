export type UserRole = 'student' | 'teacher' | 'admin'
export type UserStatus = 'Aktif' | 'Nonaktif'

export interface UserAccount {
  id: string
  name: string
  email: string
  role: UserRole
  password: string
  status: UserStatus
  identifier?: string
  className?: string
  subject?: string
  createdAt: string
}

const USERS_KEY = 'ekostream_users'
export const USERS_CHANGE_EVENT = 'ekostream-users-change'

const seedUsers: UserAccount[] = [
  {
    id: 'student-1',
    name: 'Dika Pratama',
    email: 'dika.pratama@siswa.ekostream.id',
    role: 'student',
    password: 'ekostream',
    status: 'Aktif',
    identifier: '0081234567',
    className: '10 IPA 1',
    createdAt: '2026-11-01',
  },
  {
    id: 'student-2',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@siswa.ekostream.id',
    role: 'student',
    password: 'ekostream',
    status: 'Aktif',
    identifier: '0081234568',
    className: '10 IPA 1',
    createdAt: '2026-11-02',
  },
  {
    id: 'student-3',
    name: 'Rizky Maulana',
    email: 'rizky.maulana@siswa.ekostream.id',
    role: 'student',
    password: 'ekostream',
    status: 'Aktif',
    identifier: '0081234570',
    className: '10 IPA 2',
    createdAt: '2026-11-03',
  },
  {
    id: 'teacher-1',
    name: 'Pak Budi Santoso, M.Pd.',
    email: 'budi.santoso@guru.ekostream.id',
    role: 'teacher',
    password: 'ekostream',
    status: 'Aktif',
    identifier: '198504122010011005',
    subject: 'Biologi Kelas 10',
    createdAt: '2026-10-15',
  },
  {
    id: 'admin-1',
    name: 'Admin Kurikulum',
    email: 'admin@sekolah.ekostream.id',
    role: 'admin',
    password: 'ekostream',
    status: 'Aktif',
    createdAt: '2026-10-01',
  },
]

function dispatchUsersChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(USERS_CHANGE_EVENT))
  }
}

export function getUsers(): UserAccount[] {
  if (typeof window === 'undefined') return seedUsers
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers))
    return seedUsers
  }
  try {
    const parsed = JSON.parse(raw) as UserAccount[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers))
      return seedUsers
    }
    return parsed
  } catch {
    return seedUsers
  }
}

export function saveUsers(users: UserAccount[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  dispatchUsersChange()
}

export function createUser(
  input: Omit<UserAccount, 'id' | 'createdAt'>,
): { ok: true; user: UserAccount } | { ok: false; error: string } {
  const users = getUsers()
  const normalizedEmail = input.email.trim().toLowerCase()

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { ok: false, error: `Email "${normalizedEmail}" sudah terdaftar.` }
  }

  const newUser: UserAccount = {
    ...input,
    id: `${input.role}-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password || 'ekostream',
    identifier: input.identifier?.trim() || undefined,
    className: input.role === 'student' ? input.className || '10 IPA 1' : undefined,
    subject: input.role === 'teacher' ? input.subject || 'Biologi' : undefined,
    createdAt: new Date().toISOString().slice(0, 10),
  }

  saveUsers([newUser, ...users])
  return { ok: true, user: newUser }
}

export function updateUser(
  id: string,
  patch: Partial<Omit<UserAccount, 'id' | 'createdAt'>>,
): { ok: true } | { ok: false; error: string } {
  const users = getUsers()
  if (patch.email) {
    const normalizedEmail = patch.email.trim().toLowerCase()
    const duplicate = users.some(
      (u) => u.id !== id && u.email.toLowerCase() === normalizedEmail,
    )
    if (duplicate) {
      return { ok: false, error: `Email "${normalizedEmail}" sudah digunakan akun lain.` }
    }
    patch = { ...patch, email: normalizedEmail }
  }

  const updated = users.map((u) => {
    if (u.id !== id) return u
    const nextRole = patch.role ?? u.role
    return {
      ...u,
      ...patch,
      name: patch.name !== undefined ? patch.name.trim() : u.name,
      className: nextRole === 'student' ? (patch.className ?? u.className ?? '10 IPA 1') : undefined,
      subject: nextRole === 'teacher' ? (patch.subject ?? u.subject ?? 'Biologi') : undefined,
    }
  })

  saveUsers(updated)
  return { ok: true }
}

export function deleteUser(id: string) {
  const users = getUsers()
  saveUsers(users.filter((u) => u.id !== id))
}
