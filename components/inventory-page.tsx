"use client"

import { useState } from "react"
import { InventoryTable } from "@/components/inventory-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Download, Store } from "lucide-react"
import { AddMedicationDialog } from "@/components/add-medication-dialog"
import { inventoryData as initialInventoryData, warehouses } from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [inventoryData, setInventoryData] = useState(initialInventoryData)
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>(undefined)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { user } = useAuth()

  // Función para añadir un nuevo medicamento
  const handleAddMedication = (newMedication: any) => {
    setInventoryData((prevData) => [...prevData, newMedication])

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
        medication: newMedication.name,
        quantity: `${newMedication.quantity} frascos`,
        warehouse: newMedication.warehouse,
        timestamp: new Date().toISOString(),
        details: `Adición de medicamento al inventario`,
      }

      // Guardar actividad en localStorage
      const activities = JSON.parse(localStorage.getItem("activities") || "[]")
      localStorage.setItem("activities", JSON.stringify([addActivity, ...activities]))
    }
  }

  // Función para eliminar un medicamento
  const handleDeleteMedication = (id: number) => {
    setInventoryData((prevData) => prevData.filter((item) => item.id !== id))
  }

  // Función para editar un medicamento
  const handleEditMedication = (item: any) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  // Función para guardar los cambios de un medicamento editado
  const handleSaveEdit = (updatedItem: any) => {
    // Encontrar el item original para comparar los cambios
    const originalItem = inventoryData.find((item) => item.id === updatedItem.id)

    // Crear un registro de los cambios realizados
    const changes: Record<string, { from: any; to: any }> = {}

    // Comparar cada campo para detectar cambios
    if (originalItem) {
      if (originalItem.name !== updatedItem.name) {
        changes.name = { from: originalItem.name, to: updatedItem.name }
      }
      if (originalItem.lot !== updatedItem.lot) {
        changes.lot = { from: originalItem.lot, to: updatedItem.lot }
      }
      if (originalItem.quantity !== updatedItem.quantity) {
        changes.quantity = { from: originalItem.quantity, to: updatedItem.quantity }
      }
      if (originalItem.expiryDate !== updatedItem.expiryDate) {
        changes.expiryDate = { from: originalItem.expiryDate, to: updatedItem.expiryDate }
      }
      if (originalItem.status !== updatedItem.status) {
        changes.status = { from: originalItem.status, to: updatedItem.status }
      }
      if (originalItem.warehouse !== updatedItem.warehouse) {
        changes.warehouse = { from: originalItem.warehouse, to: updatedItem.warehouse }
      }
    }

    // Actualizar el inventario
    setInventoryData((prevData) => prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item)))

    // Registrar actividad con los cambios
    if (user) {
      // Crear un resumen de los cambios
      const changesArray = Object.keys(changes)
      const changesSummary =
        changesArray.length > 0 ? `Campos modificados: ${changesArray.join(", ")}` : "No se detectaron cambios"

      const editActivity = {
        id: Date.now(),
        type: "inventory",
        user: {
          name: user.name,
          avatar: user.avatar,
        },
        action: "actualizó",
        medication: updatedItem.name,
        quantity: `${updatedItem.quantity} frascos`,
        warehouse: updatedItem.warehouse,
        timestamp: new Date().toISOString(),
        details: changesSummary,
        changes: changes, // Guardar los cambios detallados
      }

      // Guardar actividad en localStorage
      const activities = JSON.parse(localStorage.getItem("activities") || "[]")
      localStorage.setItem("activities", JSON.stringify([editActivity, ...activities]))
    }

    setIsEditDialogOpen(false)
    setEditingItem(null)
  }

  // Función para limpiar el filtro de almacén
  const clearWarehouseFilter = () => {
    setSelectedWarehouse(undefined)
  }

  // Función para exportar a Excel
  const exportToExcel = () => {
    // Crear un array con los datos a exportar
    const dataToExport = inventoryData.map((item) => ({
      ID: item.id,
      Nombre: item.name,
      Lote: item.lot,
      Cantidad: item.quantity,
      "Fecha Caducidad": item.expiryDate,
      Estado: item.status,
      Almacén: item.warehouse,
      Código: item.code || "",
      Origen: item.origin || "",
    }))

    // Convertir a CSV
    const headers = Object.keys(dataToExport[0])
    let csvContent = headers.join(",") + "\n"

    dataToExport.forEach((item) => {
      const values = headers.map((header) => {
        const value = item[header]
        // Escapar comillas y encerrar en comillas si contiene comas
        return typeof value === "string" && (value.includes(",") || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value
      })
      csvContent += values.join(",") + "\n"
    })

    // Crear un blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "inventario.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto transition-all duration-300 hover-slide-right"
            onClick={exportToExcel}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <AddMedicationDialog onAddMedication={handleAddMedication} />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            Todos
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="flex-1 sm:flex-none">
            Bajo Stock
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex-1 sm:flex-none">
            Próximos a Vencer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle>Inventario Completo</CardTitle>
              <CardDescription>Listado de todos los medicamentos disponibles en el almacén</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nombre, lote o código..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full md:w-auto transition-all duration-300 hover:bg-primary/10"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="font-normal">Almacén</DropdownMenuLabel>
                      {warehouses.map((warehouse) => (
                        <DropdownMenuCheckboxItem
                          key={warehouse}
                          checked={selectedWarehouse === warehouse}
                          onCheckedChange={() => setSelectedWarehouse(warehouse)}
                        >
                          {warehouse}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {selectedWarehouse && (
                    <Button variant="ghost" size="sm" onClick={clearWarehouseFilter} className="w-full md:w-auto">
                      <Badge className="mr-2">
                        <Store className="mr-1 h-3 w-3" />
                        {selectedWarehouse}
                      </Badge>
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>

              <div className="overflow-auto">
                <InventoryTable
                  searchQuery={searchQuery}
                  filterByWarehouse={selectedWarehouse}
                  data={inventoryData}
                  onDelete={handleDeleteMedication}
                  onEdit={handleEditMedication}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle>Medicamentos con Bajo Stock</CardTitle>
              <CardDescription>Medicamentos que requieren reposición</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nombre, lote o código..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full md:w-auto transition-all duration-300 hover:bg-primary/10"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="font-normal">Almacén</DropdownMenuLabel>
                      {warehouses.map((warehouse) => (
                        <DropdownMenuCheckboxItem
                          key={warehouse}
                          checked={selectedWarehouse === warehouse}
                          onCheckedChange={() => setSelectedWarehouse(warehouse)}
                        >
                          {warehouse}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {selectedWarehouse && (
                    <Button variant="ghost" size="sm" onClick={clearWarehouseFilter} className="w-full md:w-auto">
                      <Badge className="mr-2">
                        <Store className="mr-1 h-3 w-3" />
                        {selectedWarehouse}
                      </Badge>
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>

              <div className="overflow-auto">
                <InventoryTable
                  filterByStatus="Bajo Stock"
                  filterByWarehouse={selectedWarehouse}
                  data={inventoryData}
                  onDelete={handleDeleteMedication}
                  onEdit={handleEditMedication}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle>Medicamentos Próximos a Vencer</CardTitle>
              <CardDescription>Medicamentos que vencen en los próximos 90 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nombre, lote o código..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full md:w-auto transition-all duration-300 hover:bg-primary/10"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="font-normal">Almacén</DropdownMenuLabel>
                      {warehouses.map((warehouse) => (
                        <DropdownMenuCheckboxItem
                          key={warehouse}
                          checked={selectedWarehouse === warehouse}
                          onCheckedChange={() => setSelectedWarehouse(warehouse)}
                        >
                          {warehouse}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {selectedWarehouse && (
                    <Button variant="ghost" size="sm" onClick={clearWarehouseFilter} className="w-full md:w-auto">
                      <Badge className="mr-2">
                        <Store className="mr-1 h-3 w-3" />
                        {selectedWarehouse}
                      </Badge>
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>

              <div className="overflow-auto">
                <InventoryTable
                  filterByExpiry={90}
                  filterByWarehouse={selectedWarehouse}
                  data={inventoryData}
                  onDelete={handleDeleteMedication}
                  onEdit={handleEditMedication}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de edición */}
      {editingItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Medicamento</DialogTitle>
              <DialogDescription>Actualice la información del medicamento.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-name" className="text-right text-sm font-medium">
                  Nombre
                </label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-lot" className="text-right text-sm font-medium">
                  Lote
                </label>
                <Input
                  id="edit-lot"
                  className="col-span-3"
                  value={editingItem.lot}
                  onChange={(e) => setEditingItem({ ...editingItem, lot: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-quantity" className="text-right text-sm font-medium">
                  Cantidad
                </label>
                <Input
                  id="edit-quantity"
                  type="number"
                  className="col-span-3"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-expiry" className="text-right text-sm font-medium">
                  Vencimiento
                </label>
                <Input
                  id="edit-expiry"
                  type="date"
                  className="col-span-3"
                  value={editingItem.expiryDate}
                  onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-status" className="text-right text-sm font-medium">
                  Estado
                </label>
                <select
                  id="edit-status"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                >
                  <option value="Normal">Normal</option>
                  <option value="Bajo Stock">Bajo Stock</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-warehouse" className="text-right text-sm font-medium">
                  Almacén
                </label>
                <select
                  id="edit-warehouse"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingItem.warehouse}
                  onChange={(e) => setEditingItem({ ...editingItem, warehouse: e.target.value })}
                >
                  {warehouses.map((warehouse) => (
                    <option key={warehouse} value={warehouse}>
                      {warehouse}
                    </option>
                  ))}
                </select>
              </div>
              {editingItem.code && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-code" className="text-right text-sm font-medium">
                    Código
                  </label>
                  <Input
                    id="edit-code"
                    className="col-span-3"
                    value={editingItem.code}
                    onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={() => handleSaveEdit(editingItem)}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

