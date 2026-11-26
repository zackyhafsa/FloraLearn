import { getUsers, type UserRole } from '@/lib/user-store'

export type { UserRole }

export type SessionUser = {
  id: string
  name: string
  email: string
  role: UserRole
  className?: string
  subject?: string
}

const SESSION_KEY = 'ekostream_session'

export function getSession(): SessionUser | null {
  if (typeof window === 'undefined') return null
  const value = localStorage.getItem(SESSION_KEY)
  if (!value) return null
  try {
    const session = JSON.parse(value) as Partial<SessionUser>
    if (
      !session.id ||
      typeof session.name !== 'string' ||
      typeof session.email !== 'string' ||
      !['student', 'teacher', 'admin'].includes(session.role ?? '')
    ) {
      logout()
      return null
    }
    return session as SessionUser
  } catch {
    logout()
    return null
  }
}

export function authenticate(
  email: string,
  password: string,
): { ok: true; user: SessionUser } | { ok: false; error: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const account = getUsers().find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
  )

  if (!account) {
    return { ok: false, error: 'Email atau kata sandi tidak sesuai.' }
  }

  if (account.status === 'Nonaktif') {
    return { ok: false, error: 'Akun Anda sedang dinonaktifkan oleh administrator.' }
  }

  const session: SessionUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    className: account.className,
    subject: account.subject,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { ok: true, user: session }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
