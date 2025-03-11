"use client"

import { TableHeader } from "@/components/ui/table"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock, Store, Edit, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface InventoryTableProps {
  searchQuery?: string
  filterByStatus?: string
  filterByExpiry?: number
  filterByWarehouse?: string
  data: any[]
  onDelete?: (id: number) => void
  onEdit?: (item: any) => void
}

export function InventoryTable({
  searchQuery = "",
  filterByStatus,
  filterByExpiry,
  filterByWarehouse,
  data,
  onDelete,
  onEdit,
}: InventoryTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Función para calcular días hasta vencimiento
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Función para determinar el color según los días hasta el vencimiento
  const getExpiryColor = (days: number) => {
    if (days <= 90) return "bg-red-50 text-red-600 border-red-200" // 3 meses o menos
    if (days <= 180) return "bg-amber-50 text-amber-600 border-amber-200" // 6 meses o menos
    return "bg-emerald-50 text-emerald-600 border-emerald-200" // Más de 6 meses
  }

  // Filtrar datos según los criterios
  const filteredData = data.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = !filterByStatus || item.status === filterByStatus
    const matchesExpiry = !filterByExpiry || getDaysUntilExpiry(item.expiryDate) <= filterByExpiry
    const matchesWarehouse = !filterByWarehouse || item.warehouse === filterByWarehouse

    return matchesSearch && matchesStatus && matchesExpiry && matchesWarehouse
  })

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0

    let valueA, valueB

    switch (sortColumn) {
      case "name":
        valueA = a.name
        valueB = b.name
        break
      case "lot":
        valueA = a.lot
        valueB = b.lot
        break
      case "quantity":
        valueA = a.quantity
        valueB = b.quantity
        break
      case "expiryDate":
        valueA = new Date(a.expiryDate).getTime()
        valueB = new Date(b.expiryDate).getTime()
        break
      case "status":
        valueA = a.status
        valueB = b.status
        break
      case "warehouse":
        valueA = a.warehouse
        valueB = b.warehouse
        break
      case "code":
        valueA = a.code || ""
        valueB = b.code || ""
        break
      default:
        return 0
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Función para cambiar el ordenamiento
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Renderizar icono de ordenamiento
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  // Actualizar el renderizado del badge de fecha de vencimiento
  const renderExpiryBadge = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate)
    const formattedDate = format(new Date(expiryDate), "dd/MM/yyyy", { locale: es })
    const colorClass = getExpiryColor(days)

    return (
      <Badge variant="outline" className={cn("w-full justify-center whitespace-nowrap", colorClass)}>
        <Clock className="mr-1 h-3 w-3 shrink-0" />
        {formattedDate}
        <span className="ml-1 text-xs">({days} días)</span>
      </Badge>
    )
  }

  // Actualizar el renderizado del badge de estado
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Bajo Stock":
        return (
          <Badge variant="outline" className="w-full justify-center bg-amber-50 text-amber-600 border-amber-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Bajo Stock
          </Badge>
        )
      case "Normal":
        return (
          <Badge variant="outline" className="w-full justify-center bg-emerald-50 text-emerald-600 border-emerald-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Normal
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="w-full justify-center">
            {status}
          </Badge>
        )
    }
  }

  // Actualizar el renderizado del badge de almacén
  const renderWarehouseBadge = (warehouse: string) => {
    const colorClass = colors[warehouse] || "bg-gray-50 text-gray-600 border-gray-200"

    return (
      <Badge variant="outline" className={cn("w-full justify-center whitespace-nowrap", colorClass)}>
        <Store className="mr-1 h-3 w-3 shrink-0" />
        {warehouse}
      </Badge>
    )
  }

  const colors = {
    Antimicrobianos: "bg-blue-50 text-blue-600 border-blue-200",
    Oncológicos: "bg-violet-50 text-violet-600 border-violet-200",
    NPT: "bg-rose-50 text-rose-600 border-rose-200",
    Soluciones: "bg-cyan-50 text-cyan-600 border-cyan-200",
    Insumos: "bg-teal-50 text-teal-600 border-teal-200",
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                  Medicamento
                  {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead className="w-[10%]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("code")}>
                  Código
                  {renderSortIcon("code")}
                </div>
              </TableHead>
              <TableHead className="w-[10%]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("lot")}>
                  Lote
                  {renderSortIcon("lot")}
                </div>
              </TableHead>
              <TableHead className="w-[8%]">
                <div
                  className="flex items-center justify-end cursor-pointer w-full"
                  onClick={() => handleSort("quantity")}
                >
                  Frascos
                  {renderSortIcon("quantity")}
                </div>
              </TableHead>
              <TableHead className="w-[15%]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("expiryDate")}>
                  Fecha de Vencimiento
                  {renderSortIcon("expiryDate")}
                </div>
              </TableHead>
              <TableHead className="w-[10%]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("status")}>
                  Estado
                  {renderSortIcon("status")}
                </div>
              </TableHead>
              <TableHead className="w-[15%]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("warehouse")}>
                  Almacén
                  {renderSortIcon("warehouse")}
                </div>
              </TableHead>
              {(onEdit || onDelete) && <TableHead className="w-[12%] text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onEdit || onDelete ? 8 : 7} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => (
                <TableRow key={item.id} className="transition-colors duration-200 hover:bg-muted/50">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.code || "-"}</TableCell>
                  <TableCell>{item.lot}</TableCell>
                  <TableCell>
                    <div className="text-left w-full tabular-nums">{item.quantity}</div>
                  </TableCell>
                  <TableCell className="min-w-[200px]">{renderExpiryBadge(item.expiryDate)}</TableCell>
                  <TableCell>{renderStatusBadge(item.status)}</TableCell>
                  <TableCell>{renderWarehouseBadge(item.warehouse)}</TableCell>
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(item.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

