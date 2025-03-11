"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export function AuthTest() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"pending" | "success" | "error">("pending")

  // Probar la conexión básica a Supabase
  const testConnection = async () => {
    setConnectionStatus("pending")
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error de conexión:", error)
        setConnectionStatus("error")
        return false
      }

      setConnectionStatus("success")
      return true
    } catch (error) {
      console.error("Error inesperado:", error)
      setConnectionStatus("error")
      return false
    }
  }

  // Probar la creación de un usuario temporal
  const testCreateUser = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Primero verificar la conexión
      const isConnected = await testConnection()
      if (!isConnected) {
        setResult({
          success: false,
          message: "Error de conexión a Supabase",
          details: "No se pudo establecer conexión con el servicio de autenticación.",
        })
        return
      }

      // Generar un email único para evitar conflictos
      const testEmail = `test_${Date.now()}@example.com`
      const testPassword = "Test123!"

      // Intentar crear un usuario
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      })

      if (error) {
        setResult({
          success: false,
          message: "Error al crear usuario de prueba",
          details: `Error: ${error.message}`,
        })
      } else {
        setResult({
          success: true,
          message: "Usuario de prueba creado correctamente",
          details: `Se creó el usuario ${testEmail} (Este usuario no será utilizable sin confirmación de email)`,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error inesperado",
        details: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setLoading(false)
    }
  }

  // Probar inicio de sesión con credenciales proporcionadas
  const testSignIn = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Primero verificar la conexión
      const isConnected = await testConnection()
      if (!isConnected) {
        setResult({
          success: false,
          message: "Error de conexión a Supabase",
          details: "No se pudo establecer conexión con el servicio de autenticación.",
        })
        return
      }

      // Intentar iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult({
          success: false,
          message: "Error al iniciar sesión",
          details: `Error: ${error.message}`,
        })
      } else {
        // Verificar si el usuario existe en la tabla users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user?.id)
          .single()

        if (userError) {
          setResult({
            success: false,
            message: "Autenticación exitosa pero falta registro en tabla users",
            details: `El usuario se autenticó correctamente, pero no se encontró en la tabla users. Error: ${userError.message}`,
          })
        } else {
          setResult({
            success: true,
            message: "Inicio de sesión exitoso",
            details: `Usuario autenticado: ${userData.username || userData.email} (${userData.role})`,
          })
        }

        // Cerrar sesión para no afectar el estado de la aplicación
        await supabase.auth.signOut()
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error inesperado",
        details: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico de Autenticación</CardTitle>
          <CardDescription>Verifica la conexión con el servicio de autenticación de Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="font-medium">Estado de conexión:</div>
            <div className="flex items-center">
              {connectionStatus === "pending" ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : connectionStatus === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="ml-2">
                {connectionStatus === "pending"
                  ? "No verificado"
                  : connectionStatus === "success"
                    ? "Conectado"
                    : "Error de conexión"}
              </span>
            </div>
          </div>

          <Button onClick={testConnection} variant="outline" size="sm">
            Verificar Conexión
          </Button>

          <div className="border-t pt-4">
            <Button onClick={testCreateUser} disabled={loading}>
              {loading ? "Probando..." : "Probar Creación de Usuario"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Probar Inicio de Sesión</CardTitle>
          <CardDescription>Intenta iniciar sesión con credenciales específicas</CardDescription>
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
            {loading ? "Probando inicio de sesión..." : "Probar Inicio de Sesión"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          <AlertTitle className="flex items-center">
            {result.success ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
            {result.message}
          </AlertTitle>
          {result.details && <AlertDescription className="mt-2">{result.details}</AlertDescription>}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Solución de problemas comunes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. Credenciales incorrectas</h3>
            <p className="text-sm text-muted-foreground">
              Verifica que estás usando el nombre de usuario y contraseña correctos. Recuerda que el sistema usa el
              campo "username" para iniciar sesión, no el email directamente.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">2. Problemas con la tabla users</h3>
            <p className="text-sm text-muted-foreground">
              El sistema requiere que cada usuario tenga una entrada correspondiente en la tabla "users" con campos como
              "username" y "role".
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">3. Configuración de Supabase</h3>
            <p className="text-sm text-muted-foreground">
              Verifica que las credenciales de Supabase (URL y clave anónima) sean correctas en el archivo
              lib/supabase.ts.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">4. Crear un usuario administrador manualmente</h3>
            <p className="text-sm text-muted-foreground">
              Si no puedes iniciar sesión, puedes crear un usuario administrador directamente desde la interfaz de
              Supabase.
              <ol className="list-decimal list-inside mt-2 ml-4 space-y-1">
                <li>Ve al panel de Supabase y navega a Authentication &gt; Users</li>
                <li>Crea un nuevo usuario con email y contraseña</li>
                <li>Luego ve a la tabla "users" en el Editor SQL</li>
                <li>Inserta manualmente un registro con el ID del usuario, username, role="Administrador"</li>
              </ol>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

