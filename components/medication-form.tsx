"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Medication } from "./medication-management-page"
import { warehouses } from "@/lib/data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// Importar CheckCircle
import { Trash, CheckCircle } from "lucide-react"

// Esquema de validación para el formulario
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

interface MedicationFormProps {
  medication?: Medication
  onSubmit: (medication: Medication) => void
  onDelete?: (medication: Medication) => void
  isUpdate: boolean
}

// Actualizar la función MedicationForm para incluir reseteo del formulario
export function MedicationForm({ medication, onSubmit, onDelete, isUpdate }: MedicationFormProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Inicializar el formulario con react-hook-form y zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: medication
      ? {
          name: medication.name,
          lot: medication.lot,
          quantity: medication.quantity,
          expiryDate: medication.expiryDate,
          status: medication.status as "Normal" | "Bajo Stock",
          warehouse: medication.warehouse,
        }
      : {
          name: "",
          lot: "",
          quantity: 0,
          expiryDate: "",
          status: "Normal",
          warehouse: "Antimicrobianos",
        },
  })

  // Resetear el formulario cuando cambia el medicamento seleccionado
  useEffect(() => {
    if (medication) {
      form.reset({
        name: medication.name,
        lot: medication.lot,
        quantity: medication.quantity,
        expiryDate: medication.expiryDate,
        status: medication.status as "Normal" | "Bajo Stock",
        warehouse: medication.warehouse,
      })
    }
  }, [medication, form])

  // Manejar el envío del formulario
  function handleFormSubmit(values: FormValues) {
    if (isUpdate && medication) {
      // Actualizar medicamento existente
      onSubmit({
        ...medication,
        ...values,
      })
    } else {
      // Crear nuevo medicamento con ID temporal
      onSubmit({
        id: Date.now(),
        ...values,
      })

      // Resetear el formulario después de enviar
      form.reset({
        name: "",
        lot: "",
        quantity: 0,
        expiryDate: "",
        status: "Normal",
        warehouse: "Antimicrobianos",
      })

      // Marcar como enviado para mostrar animación
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 2000)
    }
  }

  // Manejar la eliminación de un medicamento
  function handleDelete() {
    if (medication && onDelete) {
      onDelete(medication)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="flex justify-between pt-4">
          {isUpdate && onDelete ? (
            <>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el medicamento {medication?.name}{" "}
                      del inventario.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit" className="button-hover transition-all duration-300">
                Actualizar
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              className={`button-hover transition-all duration-300 ml-auto ${isSubmitted ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Medicamento Agregado
                </>
              ) : isUpdate ? (
                "Actualizar"
              ) : (
                "Dar de Alta"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

