"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, Activity, Users, Settings, LogOut, Menu, X } from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Inventario",
      href: "/inventory",
      icon: Package,
    },
    {
      name: "Actividades",
      href: "/activities",
      icon: Activity,
    },
  ]

  // Solo mostrar la sección de usuarios a administradores
  if (user?.role === "Administrador") {
    navItems.push({
      name: "Usuarios",
      href: "/users",
      icon: Users,
    })
  }

  navItems.push({
    name: "Configuración",
    href: "/settings",
    icon: Settings,
  })

  return (
    <>
      {/* Botón de menú móvil */}
      <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay para móvil */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeSidebar} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 dark:bg-gray-900 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Almacén Hospitalario</h2>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="mb-2 flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary text-center text-primary-foreground">
              <span className="leading-8">{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </>
  )
}

