"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

type TestResult = {
  name: string
  status: "success" | "error" | "pending"
  message: string
  details?: string
}

export function ConnectionTest() {
  const [results, setResults] = useState<TestResult[]>([
    { name: "Conexión a Supabase", status: "pending", message: "Pendiente" },
    { name: "Tablas existentes", status: "pending", message: "Pendiente" },
    { name: "Permisos de lectura", status: "pending", message: "Pendiente" },
    { name: "Permisos de escritura", status: "pending", message: "Pendiente" },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<"success" | "error" | "pending">("pending")

  const updateResult = (index: number, result: Partial<TestResult>) => {
    setResults((prev) => {
      const newResults = [...prev]
      newResults[index] = { ...newResults[index], ...result }
      return newResults
    })
  }

  const runTests = async () => {
    setIsRunning(true)
    setOverallStatus("pending")

    // Reiniciar resultados
    setResults((prev) => prev.map((r) => ({ ...r, status: "pending", message: "Pendiente", details: undefined })))

    try {
      // Test 1: Conexión básica a Supabase
      updateResult(0, { status: "pending", message: "Verificando conexión..." })
      try {
        const { data, error } = await supabase.from("_test_connection").select("*").limit(1)

        // Este error es esperado si la tabla no existe, pero indica que la conexión funciona
        if (error && error.code === "42P01") {
          // Código para "relation does not exist"
          updateResult(0, {
            status: "success",
            message: "Conexión establecida correctamente",
            details: "La conexión a Supabase funciona, aunque la tabla de prueba no existe (lo cual es normal).",
          })
        } else if (error) {
          updateResult(0, {
            status: "error",
            message: "Error al conectar",
            details: `Error: ${error.message} (Código: ${error.code})`,
          })
          throw new Error("Falló la conexión básica")
        } else {
          updateResult(0, {
            status: "success",
            message: "Conexión establecida correctamente",
          })
        }
      } catch (e) {
        if (!(e instanceof Error && e.message === "Falló la conexión básica")) {
          updateResult(0, {
            status: "error",
            message: "Error inesperado",
            details: e instanceof Error ? e.message : "Error desconocido",
          })
          throw e
        }
      }

      // Test 2: Listar tablas
      updateResult(1, { status: "pending", message: "Verificando tablas..." })
      try {
        // Consultar información del esquema para ver tablas
        const { data, error } = await supabase
          .from("information_schema.tables")
          .select("table_name")
          .eq("table_schema", "public")
          .order("table_name")

        if (error) {
          updateResult(1, {
            status: "error",
            message: "Error al listar tablas",
            details: `Error: ${error.message}`,
          })
        } else if (!data || data.length === 0) {
          updateResult(1, {
            status: "error",
            message: "No se encontraron tablas",
            details: "No hay tablas en el esquema público de la base de datos.",
          })
        } else {
          const tableNames = data.map((t) => t.table_name).join(", ")
          updateResult(1, {
            status: "success",
            message: `${data.length} tablas encontradas`,
            details: `Tablas: ${tableNames}`,
          })
        }
      } catch (e) {
        updateResult(1, {
          status: "error",
          message: "Error inesperado",
          details: e instanceof Error ? e.message : "Error desconocido",
        })
      }

      // Test 3: Permisos de lectura (intentar leer de la tabla users)
      updateResult(2, { status: "pending", message: "Verificando permisos de lectura..." })
      try {
        const { data, error } = await supabase.from("users").select("id, email, username, role").limit(5)

        if (error) {
          updateResult(2, {
            status: "error",
            message: "Error al leer datos",
            details: `Error: ${error.message}`,
          })
        } else {
          updateResult(2, {
            status: "success",
            message: `Lectura exitosa: ${data.length} usuarios encontrados`,
            details:
              data.length > 0
                ? `Primer usuario: ${data[0].username} (${data[0].role})`
                : "No hay usuarios en la base de datos.",
          })
        }
      } catch (e) {
        updateResult(2, {
          status: "error",
          message: "Error inesperado",
          details: e instanceof Error ? e.message : "Error desconocido",
        })
      }

      // Test 4: Permisos de escritura (intentar insertar y luego eliminar un registro de prueba)
      updateResult(3, { status: "pending", message: "Verificando permisos de escritura..." })
      try {
        const testId = `test_${Date.now()}`

        // Intentar insertar
        const { data: insertData, error: insertError } = await supabase
          .from("activities")
          .insert({
            id: testId,
            user_id: "00000000-0000-0000-0000-000000000000", // ID ficticio
            type: "test",
            action: "connection_test",
            details: "Prueba de conexión - Este registro se eliminará automáticamente",
          })
          .select()

        if (insertError) {
          updateResult(3, {
            status: "error",
            message: "Error al insertar datos",
            details: `Error: ${insertError.message}`,
          })
        } else {
          // Intentar eliminar el registro de prueba
          const { error: deleteError } = await supabase.from("activities").delete().eq("id", testId)

          if (deleteError) {
            updateResult(3, {
              status: "error",
              message: "Inserción exitosa pero error al eliminar",
              details: `Error al eliminar: ${deleteError.message}`,
            })
          } else {
            updateResult(3, {
              status: "success",
              message: "Inserción y eliminación exitosas",
              details: "Se pudo insertar y eliminar un registro de prueba correctamente.",
            })
          }
        }
      } catch (e) {
        updateResult(3, {
          status: "error",
          message: "Error inesperado",
          details: e instanceof Error ? e.message : "Error desconocido",
        })
      }

      // Determinar estado general
      setResults((prev) => {
        const hasErrors = prev.some((r) => r.status === "error")
        setOverallStatus(hasErrors ? "error" : "success")
        return prev
      })
    } finally {
      setIsRunning(false)
    }
  }

  // Iconos para cada estado
  const getStatusIcon = (status: "success" | "error" | "pending") => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Diagnóstico de Conexión a Supabase
          <Button onClick={runTests} disabled={isRunning} size="sm">
            {isRunning ? "Ejecutando pruebas..." : "Ejecutar pruebas"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(result.status)}
                  <span className="ml-2 font-medium">{result.name}</span>
                </div>
                <span
                  className={`text-sm ${
                    result.status === "success"
                      ? "text-green-600"
                      : result.status === "error"
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  {result.message}
                </span>
              </div>
              {result.details && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  {result.details}
                </div>
              )}
            </div>
          ))}

          {overallStatus !== "pending" && (
            <div
              className={`mt-4 p-4 rounded-md ${
                overallStatus === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {overallStatus === "success"
                ? "✅ La conexión a Supabase está funcionando correctamente."
                : "❌ Se encontraron problemas con la conexión a Supabase. Revisa los detalles arriba."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

