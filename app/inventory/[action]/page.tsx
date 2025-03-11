"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { createInventoryItem, updateInventoryItem, getInventoryItem } from "@/lib/inventory-service"
import { logInventoryActivity } from "@/lib/activity-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

// Esquema de validación
const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lot: z.string().min(1, { message: "El lote es requerido" }),
  quantity: z.coerce.number().positive({ message: "La cantidad debe ser positiva" }),
  expiry_date: z.string().min(1, { message: "La fecha de vencimiento es requerida" }),
  status: z.string().min(1, { message: "El estado es requerido" }),
  warehouse: z.string().min(1, { message: "El almacén es requerido" }),
  code: z.string().optional(),
  origin: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function InventoryFormPage({ params }: { params: { action: string } }) {
  const { action } = params
  const isEditing = action !== "new"
  const itemId = isEditing ? action : null
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lot: "",
      quantity: 0,
      expiry_date: "",
      status: "Disponible",
      warehouse: "Principal",
      code: "",
      origin: "",
    },
  })

  useEffect(() => {
    async function loadItem() {
      if (itemId) {
        try {
          const item = await getInventoryItem(itemId)
          form.reset({
            ...item,
            expiry_date: new Date(item.expiry_date).toISOString().split("T")[0],
          })
        } catch (err) {
          console.error("Error al cargar el item:", err)
          setError("No se pudo cargar el medicamento. Por favor, intente de nuevo.")
        } finally {
          setInitialLoading(false)
        }
      }
    }

    loadItem()
  }, [itemId, form])

  async function onSubmit(values: FormValues) {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      if (isEditing && itemId) {
        await updateInventoryItem(itemId, values)
        await logInventoryActivity({
          userId: user.id,
          action: "update",
          medication: values.name,
          quantity: values.quantity.toString(),
          warehouse: values.warehouse,
          details: `Actualización de ${values.name} (Lote: ${values.lot})`,
        })
      } else {
        const newItem = await createInventoryItem({
          ...values,
          created_by: user.id,
        })
        await logInventoryActivity({
          userId: user.id,
          action: "add",
          medication: values.name,
          quantity: values.quantity.toString(),
          warehouse: values.warehouse,
          details: `Nuevo medicamento: ${values.name} (Lote: ${values.lot})`,
        })
      }

      router.push("/inventory")
    } catch (err) {
      console.error("Error al guardar:", err)
      setError("Ocurrió un error al guardar. Por favor, intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <DashboardLayout title={isEditing ? "Editar Medicamento" : "Nuevo Medicamento"}>
        <div className="flex justify-center p-8">Cargando...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={isEditing ? "Editar Medicamento" : "Nuevo Medicamento"}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Actualizar información" : "Ingresar nuevo medicamento"}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">{error}</div>}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Medicamento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lote</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Vencimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Disponible">Disponible</SelectItem>
                          <SelectItem value="Agotado">Agotado</SelectItem>
                          <SelectItem value="Por vencer">Por vencer</SelectItem>
                          <SelectItem value="Vencido">Vencido</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Almacén</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar almacén" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Principal">Principal</SelectItem>
                          <SelectItem value="Secundario">Secundario</SelectItem>
                          <SelectItem value="Emergencia">Emergencia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origen (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push("/inventory")}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

