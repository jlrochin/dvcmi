"use client"

import { useAuth } from "@/lib/auth-context"
import { ModeToggle } from "@/components/mode-toggle"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-muted-foreground md:inline-block">{user?.name || user?.email}</span>
        <ModeToggle />
      </div>
    </header>
  )
}

