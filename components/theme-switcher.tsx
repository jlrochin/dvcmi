"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Laptop, Check, Palette } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
          {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
          {theme === "theme-blue-dark" && <Palette className="h-[1.2rem] w-[1.2rem] text-blue-400" />}
          {theme === "theme-green-pastel" && <Palette className="h-[1.2rem] w-[1.2rem] text-green-400" />}
          {theme === "theme-pink-pastel" && <Palette className="h-[1.2rem] w-[1.2rem] text-pink-400" />}
          {theme === "system" && <Laptop className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between">
          <div className="flex items-center">
            <Sun className="mr-2 h-4 w-4 text-amber-500" />
            <span>Claro</span>
          </div>
          {theme === "light" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between">
          <div className="flex items-center">
            <Moon className="mr-2 h-4 w-4 text-slate-400" />
            <span>Oscuro</span>
          </div>
          {theme === "dark" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-blue-dark")} className="flex items-center justify-between">
          <div className="flex items-center">
            <Palette className="mr-2 h-4 w-4 text-blue-500" />
            <span>Azul Oscuro</span>
          </div>
          {theme === "theme-blue-dark" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-green-pastel")} className="flex items-center justify-between">
          <div className="flex items-center">
            <Palette className="mr-2 h-4 w-4 text-green-500" />
            <span>Verde Pastel</span>
          </div>
          {theme === "theme-green-pastel" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("theme-pink-pastel")} className="flex items-center justify-between">
          <div className="flex items-center">
            <Palette className="mr-2 h-4 w-4 text-pink-500" />
            <span>Rosa Pastel</span>
          </div>
          {theme === "theme-pink-pastel" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center justify-between">
          <div className="flex items-center">
            <Laptop className="mr-2 h-4 w-4" />
            <span>Sistema</span>
          </div>
          {theme === "system" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

