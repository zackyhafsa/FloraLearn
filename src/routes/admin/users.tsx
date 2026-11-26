import { createFileRoute } from '@tanstack/react-router'

import { AppShell } from '@/components/layout/app-header'
import { UsersManagementView } from '@/components/users/users-management-view'

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  return (
    <AppShell>
      <UsersManagementView mode="admin" />
    </AppShell>
  )
}
