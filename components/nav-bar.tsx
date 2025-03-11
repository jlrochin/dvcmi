"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CrossIcon as MedicalCross, Menu, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeSwitcher } from "@/components/theme-switcher"

// Actualizar el array de rutas para incluir la nueva página de Excel
const routes = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Inventario",
    path: "/dashboard/inventario",
  },
  {
    name: "Medicamentos",
    path: "/dashboard/medicamentos",
  },
  {
    name: "Reportes",
    path: "/dashboard/reportes",
  },
  {
    name: "Excel",
    path: "/dashboard/excel",
  },
]

export function NavBar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <MedicalCross className="h-6 w-6 text-blue-600 dark:text-blue-400 theme-blue-dark:text-blue-400 theme-green-pastel:text-green-600 theme-pink-pastel:text-pink-600" />
          <span className="ml-2 text-xl font-bold">Dashboard Almacén Hospitalario</span>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="transition-all duration-300 hover:bg-primary/10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === route.path ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {route.name}
                </Link>
              ))}
              <div className="mt-auto pt-4 border-t">
                {user && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeSwitcher />
                      <Button variant="ghost" size="icon" onClick={logout}>
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center space-x-4">
          {/* Desktop menu */}
          <nav className="flex items-center space-x-6 mr-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary relative",
                  pathname === route.path
                    ? "text-primary after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary"
                    : "text-muted-foreground after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>

          {/* Theme switcher */}
          <ThemeSwitcher />

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 flex items-center gap-2 transition-all duration-300 hover:bg-primary/10"
                >
                  <Avatar className="h-8 w-8 transition-transform duration-300 hover:scale-110">
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/perfil" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

