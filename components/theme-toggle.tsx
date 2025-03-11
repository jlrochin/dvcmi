"use client"

import { Moon, Sun, CircleDot } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Function to cycle through themes
  const cycleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark")
    } else if (resolvedTheme === "dark") {
      setTheme("blue-dark")
    } else {
      setTheme("light")
    }
  }

  // Get icon based on current theme
  const getThemeIcon = () => {
    switch (resolvedTheme) {
      case "light":
        return <Moon className="h-[1.2rem] w-[1.2rem] text-blue-700" />
      case "dark":
        return <CircleDot className="h-[1.2rem] w-[1.2rem] text-blue-400" />
      case "blue-dark":
        return <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
      default:
        return <Moon className="h-[1.2rem] w-[1.2rem] text-blue-700" />
    }
  }

  // Get tooltip text based on current theme
  const getThemeTooltip = () => {
    switch (resolvedTheme) {
      case "light":
        return "Cambiar a modo oscuro"
      case "dark":
        return "Cambiar a modo azul oscuro"
      case "blue-dark":
        return "Cambiar a modo claro"
      default:
        return "Cambiar tema"
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      className="rounded-full w-9 h-9 transition-all duration-300 hover:bg-primary/10"
      title={getThemeTooltip()}
    >
      {getThemeIcon()}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}

