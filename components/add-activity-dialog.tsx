"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { warehouses } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"

// Esquema de validación para el formulario
const formSchema = z.object({
  action: z.enum(["retiró", "agregó", "actualizó"]),
  medication: z.string().min(3, { message: "El medicamento debe tener al menos 3 caracteres" }),
  quantity: z.string().min(1, { message: "La cantidad es requerida" }),
  warehouse: z.enum(warehouses as [string, ...string[]]),
})

type FormValues = z.infer<typeof formSchema>

interface AddActivityDialogProps {
  onAddActivity: (activity: any) => void
}

export function AddActivityDialog({ onAddActivity }: AddActivityDialogProps) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: "retiró",
      medication: "",
      quantity: "",
      warehouse: "Antimicrobianos",
    },
  })

  // Manejar el envío del formulario
  function onSubmit(values: FormValues) {
    if (!user) return

    // Crear una nueva actividad con un ID único
    const newActivity = {
      id: Date.now(), // Usar timestamp como ID único
      type: "inventory",
      user: {
        name: user.name,
        avatar: user.avatar,
      },
      action: values.action,
      medication: values.medication,
      quantity: values.quantity,
      warehouse: values.warehouse,
      timestamp: new Date().toISOString(),
    }

    // Llamar a la función para añadir la actividad
    onAddActivity(newActivity)

    // Guardar actividad en localStorage
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    // Resetear el formulario y cerrar el diálogo
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto transition-all duration-300 hover:bg-primary/10 hover-slide-right"
        >
          <Plus className="mr-2 h-4 w-4" />
          Simular Actividad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Simular Nueva Actividad</DialogTitle>
          <DialogDescription>Complete el formulario para simular una nueva actividad en el sistema.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acción</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una acción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="retiró">Retiró</SelectItem>
                      <SelectItem value="agregó">Agregó</SelectItem>
                      <SelectItem value="actualizó">Actualizó</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Paracetamol 500mg" {...field} />
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
                    <Input placeholder="Ej: 20 frascos" {...field} />
                  </FormControl>
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
                        <SelectValue placeholder="Seleccione un almacén" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse} value={warehouse}>
                          {warehouse}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="button-hover transition-all duration-300">
                Simular
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

