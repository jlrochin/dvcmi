"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CrossIcon as MedicalCross } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeSwitcher } from "@/components/theme-switcher"

// Esquema de validación para el formulario
const formSchema = z.object({
  username: z.string().min(3, { message: "El usuario debe tener al menos 3 caracteres" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // Manejar el envío del formulario
  async function onSubmit(values: FormValues) {
    setError(null)

    try {
      const success = await login(values.username, values.password)

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Credenciales inválidas. Por favor, intente de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Por favor, intente de nuevo.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 theme-blue-dark:bg-blue-950 theme-green-pastel:bg-green-50 theme-pink-pastel:bg-pink-50 p-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-md transition-all duration-500 hover:shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <MedicalCross className="h-10 w-10 text-blue-600 dark:text-blue-400 theme-blue-dark:text-blue-400 theme-green-pastel:text-green-600 theme-pink-pastel:text-pink-600 transition-transform duration-300 hover:scale-110 hover-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold">Dashboard Almacén Hospitalario</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese su nombre de usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full button-hover transition-all duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 theme-blue-dark:bg-blue-600 theme-blue-dark:hover:bg-blue-700 theme-green-pastel:bg-green-600 theme-green-pastel:hover:bg-green-700 theme-pink-pastel:bg-pink-600 theme-pink-pastel:hover:bg-pink-700"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">
            Usuarios de prueba: garcia, martinez, lopez
            <br />
            Contraseña: password123
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

