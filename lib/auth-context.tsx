"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definir la estructura del usuario
export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

// Definir la estructura del contexto de autenticación
interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Función de login simulada
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simular una llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Usuarios de prueba
    const users = [
      {
        id: "1",
        name: "Dr. García",
        email: "garcia@hospital.com",
        username: "garcia",
        password: "password123",
        role: "Médico",
        avatar: "G",
      },
      {
        id: "2",
        name: "Dra. Martínez",
        email: "martinez@hospital.com",
        username: "martinez",
        password: "password123",
        role: "Farmacéutico",
        avatar: "M",
      },
      {
        id: "3",
        name: "Enfermero López",
        email: "lopez@hospital.com",
        username: "lopez",
        password: "password123",
        role: "Enfermero",
        avatar: "L",
      },
    ]

    // Buscar por nombre de usuario o correo electrónico
    const foundUser = users.find((u) => (u.username === username || u.email === username) && u.password === password)

    if (foundUser) {
      // Eliminar la contraseña antes de almacenar el usuario
      const { password: _, username: __, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      // Registrar actividad de inicio de sesión
      const loginActivity = {
        id: Date.now(),
        type: "login",
        user: {
          name: userWithoutPassword.name,
          avatar: userWithoutPassword.avatar,
        },
        action: "inició sesión",
        timestamp: new Date().toISOString(),
        details: `Inicio de sesión desde ${navigator.userAgent}`,
      }

      // Guardar actividad en localStorage
      const activities = JSON.parse(localStorage.getItem("activities") || "[]")
      localStorage.setItem("activities", JSON.stringify([loginActivity, ...activities]))

      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  // Función de logout
  const logout = () => {
    // Registrar actividad de cierre de sesión
    if (user) {
      const logoutActivity = {
        id: Date.now(),
        type: "logout",
        user: {
          name: user.name,
          avatar: user.avatar,
        },
        action: "cerró sesión",
        timestamp: new Date().toISOString(),
        details: `Cierre de sesión`,
      }

      // Guardar actividad en localStorage
      const activities = JSON.parse(localStorage.getItem("activities") || "[]")
      localStorage.setItem("activities", JSON.stringify([logoutActivity, ...activities]))
    }

    // Eliminar usuario de localStorage
    localStorage.removeItem("user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

