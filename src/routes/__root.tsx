import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TooltipProvider } from '@/components/ui/tooltip'

import '../styles.css'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const session = getSession()
    if (location.pathname === '/login' && session) {
      throw redirect({ to: session.role === 'student' ? '/' : session.role === 'teacher' ? '/teacher' : '/admin' })
    }
    if (location.pathname !== '/login' && !session) throw redirect({ to: '/login' })
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <TooltipProvider>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </TooltipProvider>
  )
}
