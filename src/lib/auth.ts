export type UserRole = 'student' | 'teacher' | 'admin'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

const SESSION_KEY = 'flora_session'

const accounts: Array<SessionUser & { password: string }> = [
  { id: 'student-1', name: 'Dika Pratama', email: 'dika.pratama@siswa.floralearn.id', password: 'floralearn', role: 'student' },
  { id: 'teacher-1', name: 'Pak Budi Santoso, M.Pd.', email: 'budi.santoso@guru.floralearn.id', password: 'floralearn', role: 'teacher' },
  { id: 'admin-1', name: 'Admin Kurikulum', email: 'admin@sekolah.floralearn.id', password: 'floralearn', role: 'admin' },
]

export function getSession(): SessionUser | null {
  if (typeof window === 'undefined') return null
  const value = localStorage.getItem(SESSION_KEY)
  if (!value) return null
  try {
    const session = JSON.parse(value) as Partial<SessionUser>
    if (!session.id || typeof session.name !== 'string' || typeof session.email !== 'string' || !['student', 'teacher', 'admin'].includes(session.role ?? '')) {
      logout()
      return null
    }
    return session as SessionUser
  } catch {
    logout()
    return null
  }
}

export function login(email: string, password: string): SessionUser | null {
  const account = accounts.find((item) => item.email === email && item.password === password)
  if (!account) return null
  const session: SessionUser = { id: account.id, name: account.name, email: account.email, role: account.role }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
