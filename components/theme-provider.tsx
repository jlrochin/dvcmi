"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark", "theme-blue-dark", "theme-green-pastel", "theme-pink-pastel"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

