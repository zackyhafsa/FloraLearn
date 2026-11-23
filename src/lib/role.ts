export type UserRole = 'student' | 'teacher' | 'admin'

export function getActiveRole(): UserRole {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('flora_active_role') as UserRole
    if (saved === 'teacher' || saved === 'student' || saved === 'admin') {
      return saved
    }
    if (window.location.pathname.startsWith('/teacher')) {
      return 'teacher'
    }
  }
  return 'student'
}

export function setActiveRole(role: UserRole) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('flora_active_role', role)
    window.dispatchEvent(new CustomEvent('flora-role-change', { detail: role }))
  }
}
