import * as React from 'react'
import {
  FireIcon,
  Leaf01Icon,
  Menu01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { AppSidebar, SidebarNav, SidebarProfileCard } from './app-sidebar'
import { NotificationsNav } from './notifications-nav'
import { UserNav } from './user-nav'

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile trigger + Search */}
      <div className="flex items-center gap-3">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Buka navigasi"
              >
                <HugeiconsIcon icon={Menu01Icon} />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 p-6 flex flex-col justify-between">
            <SheetHeader className="p-0 text-left">
              <SheetTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                  <HugeiconsIcon icon={Leaf01Icon} size={20} />
                </span>
                FloraLearn
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Platform Pembelajaran & Observasi Botani
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 my-6 overflow-y-auto">
              <SidebarNav onItemClick={() => setMobileMenuOpen(false)} />
            </div>
            <SidebarProfileCard />
          </SheetContent>
        </Sheet>

        {/* Global Search */}
        <div className="relative w-64 sm:w-80">
          <HugeiconsIcon
            icon={Search01Icon}
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Cari materi, tanaman, takson..."
            className="pl-9 h-9 text-xs sm:text-sm bg-muted/30"
          />
        </div>
      </div>

      {/* Right: Streak, Notifications, Profile */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex items-center gap-1.5 py-1 px-3 cursor-default"
              >
                <HugeiconsIcon icon={FireIcon} className="text-amber-500" />
                <span className="font-semibold text-foreground">5 Hari Beruntun</span>
              </Badge>
            }
          />
          <TooltipContent>Streak belajar aktif! Terus selesaikan materi setiap hari.</TooltipContent>
        </Tooltip>

        {/* Notifications Dropdown */}
        <NotificationsNav />

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* User Profile & Role Switcher */}
        <UserNav />
      </div>
    </header>
  )
}

/** Shell that wraps sidebar + header + main content. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col justify-between border-r border-border bg-sidebar px-6 py-6">
        <AppSidebar />
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
