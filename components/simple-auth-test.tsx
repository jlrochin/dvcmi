"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SimpleAuthTest() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const testSignIn = async () => {
    if (!email || !password) {
      setResult("Por favor ingresa email y contraseña")
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Intentar iniciar sesión directamente con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error de autenticación:", error)
        setResult(`Error: ${error.message}`)
      } else {
        setResult(`Inicio de sesión exitoso. Usuario ID: ${data.user?.id}`)

        // Cerrar sesión para no afectar el estado de la aplicación
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      setResult(`Error inesperado: ${error instanceof Error ? error.message : "Desconocido"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Prueba Simple de Autenticación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@ejemplo.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contraseña</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button onClick={testSignIn} disabled={loading} className="w-full">
          {loading ? "Verificando..." : "Probar Inicio de Sesión"}
        </Button>

        {result && (
          <div
            className={`mt-4 p-3 rounded-md ${
              result.includes("exitoso")
                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

