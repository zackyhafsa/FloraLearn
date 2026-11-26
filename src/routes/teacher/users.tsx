import { createFileRoute } from '@tanstack/react-router'

import { AppShell } from '@/components/layout/app-header'
import { UsersManagementView } from '@/components/users/users-management-view'

export const Route = createFileRoute('/teacher/users')({
  component: TeacherUsersPage,
})

function TeacherUsersPage() {
  return (
    <AppShell>
      <UsersManagementView mode="teacher" />
    </AppShell>
  )
}
