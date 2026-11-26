import * as React from 'react'

import {
  USERS_CHANGE_EVENT,
  getUsers,
  type UserAccount,
  type UserRole,
} from '@/lib/user-store'

/** Menyinkronkan seluruh akun pengguna di localStorage. */
export function useUsers(): UserAccount[] {
  const [users, setUsers] = React.useState<UserAccount[]>(() => getUsers())

  React.useEffect(() => {
    const sync = () => setUsers(getUsers())
    sync()
    window.addEventListener(USERS_CHANGE_EVENT, sync)
    return () => window.removeEventListener(USERS_CHANGE_EVENT, sync)
  }, [])

  return users
}

/** Mengambil daftar akun yang difilter berdasarkan peran (misal khusus siswa). */
export function useUsersByRole(role: UserRole): UserAccount[] {
  const users = useUsers()
  return React.useMemo(() => users.filter((u) => u.role === role), [users, role])
}
