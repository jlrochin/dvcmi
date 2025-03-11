"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleMigrateData = async () => {
    setMigrating(true)
    setMigrationResult(null)

    try {
      const response = await fetch("/api/migrate", {
        method: "POST",
      })

      const result = await response.json()
      setMigrationResult(result)
    } catch (error) {
      setMigrationResult({
        success: false,
        message: "Error al ejecutar la migración",
      })
    } finally {
      setMigrating(false)
    }
  }

  return (
    <DashboardLayout title="Configuración">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>Detalles de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Nombre:</div>
                <div>{user?.name || "No disponible"}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Email:</div>
                <div>{user?.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Rol:</div>
                <div>{user?.role}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {user?.role === "Administrador" && (
          <Card>
            <CardHeader>
              <CardTitle>Herramientas de Administración</CardTitle>
              <CardDescription>Opciones avanzadas para administradores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Migración de Datos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Migra datos de ejemplo al inventario. Esta acción solo debe realizarse una vez.
                </p>
                <Button onClick={handleMigrateData} disabled={migrating}>
                  {migrating ? "Migrando datos..." : "Migrar Datos de Ejemplo"}
                </Button>

                {migrationResult && (
                  <div
                    className={`mt-4 p-3 rounded-md ${
                      migrationResult.success
                        ? "bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                        : "bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                    }`}
                  >
                    {migrationResult.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

