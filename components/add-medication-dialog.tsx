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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { warehouses } from "@/lib/data"

// Esquema de validación para el formulario actualizado para incluir almacén
const formSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  lot: z.string().min(3, { message: "El lote debe tener al menos 3 caracteres" }),
  quantity: z.coerce.number().min(1, { message: "La cantidad debe ser al menos 1" }),
  expiryDate: z.string().refine(
    (date) => {
      const today = new Date()
      const expiryDate = new Date(date)
      return expiryDate > today
    },
    { message: "La fecha de vencimiento debe ser en el futuro" },
  ),
  status: z.enum(["Normal", "Bajo Stock"]),
  warehouse: z.enum(warehouses as [string, ...string[]]),
})

type FormValues = z.infer<typeof formSchema>

interface AddMedicationDialogProps {
  onAddMedication: (medication: any) => void
}

export function AddMedicationDialog({ onAddMedication }: AddMedicationDialogProps) {
  const [open, setOpen] = useState(false)

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lot: "",
      quantity: 0,
      expiryDate: "",
      status: "Normal",
      warehouse: "Antimicrobianos",
    },
  })

  // Manejar el envío del formulario
  function onSubmit(values: FormValues) {
    // Crear un nuevo medicamento con un ID único
    const newMedication = {
      id: Date.now(), // Usar timestamp como ID único
      ...values,
    }

    // Llamar a la función para añadir el medicamento
    onAddMedication(newMedication)

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
          Agregar Medicamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Medicamento</DialogTitle>
          <DialogDescription>Complete el formulario para agregar un nuevo medicamento al inventario.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Medicamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Paracetamol 500mg" {...field} />
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
                  <FormLabel>Número de Lote</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: LOT12345" {...field} />
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
                  <FormLabel>Cantidad (Frascos)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Vencimiento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Fecha en formato YYYY-MM-DD</FormDescription>
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
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Bajo Stock">Bajo Stock</SelectItem>
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
                Agregar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

