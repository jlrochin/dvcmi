"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateTestUsers() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const createUsers = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Definir los usuarios de prueba
      const testUsers = [
        {
          email: "admin@hospital.com",
          password: "Admin123!",
          userData: {
            username: "admin",
            name: "Administrador Principal",
            role: "Administrador",
          },
        },
        {
          email: "farmacia@hospital.com",
          password: "Farmacia123!",
          userData: {
            username: "farmacia",
            name: "Jefe de Farmacia",
            role: "Farmacéutico",
          },
        },
        {
          email: "asistente@hospital.com",
          password: "Asistente123!",
          userData: {
            username: "asistente",
            name: "Asistente Médico",
            role: "Asistente",
          },
        },
      ]

      // Crear cada usuario
      for (const user of testUsers) {
        // 1. Crear el usuario en la autenticación de Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
        })

        if (authError) throw new Error(`Error al crear usuario ${user.email}: ${authError.message}`)

        if (authData.user) {
          // 2. Insertar datos adicionales en la tabla users
          const { error: userError } = await supabase.from("users").insert({
            id: authData.user.id,
            email: user.email,
            username: user.userData.username,
            name: user.userData.name,
            role: user.userData.role,
          })

          if (userError) throw new Error(`Error al insertar datos de usuario ${user.email}: ${userError.message}`)
        }
      }

      setResult({
        success: true,
        message:
          "Usuarios de prueba creados correctamente. Credenciales:\n\n" +
          "1. Administrador\n" +
          "   Usuario: admin\n" +
          "   Contraseña: Admin123!\n\n" +
          "2. Farmacéutico\n" +
          "   Usuario: farmacia\n" +
          "   Contraseña: Farmacia123!\n\n" +
          "3. Asistente\n" +
          "   Usuario: asistente\n" +
          "   Contraseña: Asistente123!",
      })
    } catch (error) {
      console.error("Error al crear usuarios:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al crear usuarios",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Usuarios de Prueba</CardTitle>
        <CardDescription>
          Crea tres usuarios de prueba para el sistema: Administrador, Farmacéutico y Asistente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={createUsers} disabled={loading} className="w-full">
          {loading ? "Creando usuarios..." : "Crear Usuarios de Prueba"}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-md ${
              result.success
                ? "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            }`}
          >
            <pre className="whitespace-pre-wrap">{result.message}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

