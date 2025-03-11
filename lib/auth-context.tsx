"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"

// Modificar el tipo User para incluir username
type User = {
  id: string
  email: string
  username: string
  role: string
  name?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Actualizar la función que obtiene los datos del usuario para incluir username
  useEffect(() => {
    // Verificar sesión actual
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Obtener datos del usuario desde la tabla users
        const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (data) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            username: data.username || "",
            role: data.role,
            name: data.name,
          })
        }
      }

      setLoading(false)
    }

    checkSession()

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Obtener datos del usuario desde la tabla users
        const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (data) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            username: data.username || "",
            role: data.role,
            name: data.name,
          })
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Modificar la función signIn para usar username en lugar de email
  const signIn = async (username: string, password: string) => {
    // Primero obtenemos el email asociado al username
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("username", username)
      .single()

    if (userError || !userData) {
      throw new Error("Usuario no encontrado")
    }

    // Luego hacemos el login con el email
    const { error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password,
    })

    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

