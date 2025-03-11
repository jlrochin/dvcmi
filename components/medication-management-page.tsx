"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedicationSearch } from "@/components/medication-search"
import { MedicationForm } from "@/components/medication-form"
import { inventoryData } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"

export interface Medication {
  id: number
  name: string
  lot: string
  quantity: number
  expiryDate: string
  status: string
  warehouse: string
  code?: string
}

export function MedicationManagementPage() {
  // Actualizar el estado para incluir mensajes de confirmación
  const [medications, setMedications] = useState<Medication[]>([])
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("search")
  const { user } = useAuth()

  // Cargar medicamentos al iniciar
  useEffect(() => {
    // Agregar un código único a cada medicamento (simulado)
    const medicationsWithCodes = inventoryData.map((med, index) => ({
      ...med,
      code: `MED${(index + 1).toString().padStart(4, "0")}`,
    }))
    setMedications(medicationsWithCodes)
  }, [])

  // Función para manejar la selección de un medicamento
  const handleSelectMedication = (medication: Medication | null) => {
    setSelectedMedication(medication)
  }

  // Actualizar la función handleAddMedication para mostrar confirmación y limpiar campos
  const handleAddMedication = (medication: Medication) => {
    // Generar un ID único
    const newId = Math.max(...medications.map((m) => m.id), 0) + 1

    // Generar un código único
    const newCode = `MED${newId.toString().padStart(4, "0")}`

    // Crear el nuevo medicamento
    const newMedication = {
      ...medication,
      id: newId,
      code: newCode,
    }

    // Actualizar la lista de medicamentos
    setMedications([...medications, newMedication])

    // Registrar actividad
    if (user) {
      const addActivity = {
        id: Date.now(),
        type: "inventory",
        user: {
          name: user.name,
          avatar: user.avatar,
        },
        action: "agregó",
        medication: medication.name,
        quantity: `${medication.quantity} frascos`,
        warehouse: medication.warehouse,
        timestamp: new Date().toISOString(),
        details: `Alta de medicamento con código ${newCode}`,
      }

      // Guardar actividad en localStorage
      const activities = JSON.parse(localStorage.getItem("activities") || "[]")
      localStorage.setItem("activities", JSON.stringify([addActivity, ...activities]))
    }

    // Mostrar mensaje de éxito
    setSuccessMessage(`Se ha dado de alta el medicamento ${medication.name} con código ${newCode}`)

    toast({
      title: "Medicamento agregado",
      description: `Se ha dado de alta el medicamento ${medication.name} con código ${newCode}`,
    })

    // Limpiar la selección y resetear el formulario
    setSelectedMedication(null)

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  // Actualizar la función handleUpdateMedication para mostrar confirmación y limpiar campos
  const handleUpdateMedication = (updatedMedication: Medication) => {
    // Encontrar el medicamento original para comparar cambios
    const originalMedication = medications.find((m) => m.id === updatedMedication.id)

    // Actualizar la lista de medicamentos
    setMedications(medications.map((m) => (m.id === updatedMedication.id ? updatedMedication : m)))

    // Registrar actividad
    if (user && originalMedication) {
      // Crear un registro de los cambios realizados
      const changes: Record<string, { from: any; to: any }> = {}

      // Comparar cada campo para detectar cambios
      if (originalMedication.name !== updatedMedication.name) {
        changes.name = { from: originalMedication.name, to: updatedMedication.name }
      }
      if (originalMedication.lot !== updatedMedication.lot) {
        changes.lot = { from: originalMedication.lot, to: updatedMedication.lot }
      }
      if (originalMedication.quantity !== updatedMedication.quantity) {
        changes.quantity = { from: originalMedication.quantity, to: updatedMedication.quantity }
      }
      if (originalMedication.expiryDate !== updatedMedication.expiryDate) {
        changes.expiryDate = { from: originalMedication.expiryDate, to: updatedMedication.expiryDate }
      }
      if (originalMedication.status !== updatedMedication.status) {
        changes.status = { from: originalMedication.status, to: updatedMedication.status }
      }
      if (originalMedication.warehouse !== updatedMedication.warehouse) {
        changes.warehouse = { from: originalMedication.warehouse, to: updatedMedication.warehouse }
      }

      // Crear un resumen de los cambios
      const changesArray = Object.keys(changes)
      const changesSummary =
        changesArray.length > 0 ? `Campos modificados: ${changesArray.join(", ")}` : "No se detectaron cambios"

      const updateActivity = {
        id: Date.now(),
        type: "inventory",
        user: {
          name: user.name,
          avatar: user.avatar,
        },
        action: "actualizó",
        medication: updatedMedication.name,
        quantity: `${updatedMedication.quantity} frascos`,
        warehouse: updatedMedication.warehouse,
        timestamp: new Date().toISOString(),
        details: `Actualización de medicamento con código ${updatedMedication.code}`,
        changes: changes,
      }

      // Guardar actividad en localStorage
      const activities = JSON.parse(localStorage.getItem("activities") || "[]")
      localStorage.setItem("activities", JSON.stringify([updateActivity, ...activities]))
    }

    // Mostrar mensaje de éxito
    setSuccessMessage(`Se ha actualizado el medicamento ${updatedMedication.name} correctamente`)

    toast({
      title: "Medicamento actualizado",
      description: `Se ha actualizado el medicamento ${updatedMedication.name}`,
    })

    // Limpiar la selección
    setSelectedMedication(null)

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  // Actualizar la función handleRemoveMedication para mostrar confirmación
  const handleRemoveMedication = (medication: Medication) => {
    // Actualizar la lista de medicamentos
    setMedications(medications.filter((m) => m.id !== medication.id))

    // Registrar actividad
    if (user) {
      const removeActivity = {
        id: Date.now(),
        type: "inventory",
        user: {
          name: user.name,
          avatar: user.avatar,
        },
        action: "eliminó",
        medication: medication.name,
        quantity: `${medication.quantity} frascos`,
        warehouse: medication.warehouse,
        timestamp: new Date().toISOString(),
        details: `Baja de medicamento con código ${medication.code}`,
      }

      // Guardar actividad en localStorage
      const activities = JSON.parse(localStorage.getItem("activities") || "[]")
      localStorage.setItem("activities", JSON.stringify([removeActivity, ...activities]))
    }

    // Mostrar mensaje de éxito
    setSuccessMessage(`Se ha eliminado el medicamento ${medication.name} correctamente`)

    toast({
      title: "Medicamento eliminado",
      description: `Se ha dado de baja el medicamento ${medication.name}`,
      variant: "destructive",
    })

    // Limpiar la selección
    setSelectedMedication(null)

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  // Actualizar el return para incluir el componente Tabs con manejo de cambio de tab
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Medicamentos</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="search" className="flex-1 sm:flex-none">
            Buscar y Gestionar
          </TabsTrigger>
          <TabsTrigger value="add" className="flex-1 sm:flex-none">
            Dar de Alta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle>Buscar Medicamento</CardTitle>
              <CardDescription>Ingrese el código o nombre del medicamento para buscarlo</CardDescription>
            </CardHeader>
            <CardContent>
              <MedicationSearch medications={medications} onSelectMedication={handleSelectMedication} />

              {successMessage && !selectedMedication && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {successMessage}
                  </p>
                </div>
              )}

              {selectedMedication && (
                <div className="mt-6">
                  <MedicationForm
                    medication={selectedMedication}
                    onSubmit={handleUpdateMedication}
                    onDelete={handleRemoveMedication}
                    isUpdate={true}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle>Dar de Alta Medicamento</CardTitle>
              <CardDescription>Complete el formulario para dar de alta un nuevo medicamento</CardDescription>
            </CardHeader>
            <CardContent>
              {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {successMessage}
                  </p>
                </div>
              )}
              <MedicationForm
                onSubmit={handleAddMedication}
                isUpdate={false}
                key={successMessage} // Esto fuerza al componente a recrearse cuando hay un mensaje de éxito
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

