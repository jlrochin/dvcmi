"use client"

import { useState, useEffect } from "react"
import { FileText, FileSpreadsheet, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Filter, Search, LogIn, LogOut, Package, RefreshCw, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Definir tipos para las actividades
interface ActivityUser {
  name: string
  avatar: string
}

interface ActivityChange {
  from: any
  to: any
}

interface Activity {
  id: number
  type: string
  user: ActivityUser
  action: string
  timestamp: string
  medication?: string
  quantity?: string
  warehouse?: string
  details?: string
  changes?: Record<string, ActivityChange>
}

export function ReportsPage() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [expandedActivities, setExpandedActivities] = useState<Record<number, boolean>>({})

  // Cargar actividades desde localStorage
  useEffect(() => {
    const storedActivities = localStorage.getItem("activities")
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities))
    }
  }, [])

  // Filtrar actividades según la búsqueda
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredActivities(activities)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = activities.filter(
      (activity) =>
        activity.user.name.toLowerCase().includes(query) ||
        (activity.medication && activity.medication.toLowerCase().includes(query)) ||
        (activity.warehouse && activity.warehouse.toLowerCase().includes(query)) ||
        (activity.details && activity.details.toLowerCase().includes(query)),
    )

    setFilteredActivities(filtered)
  }, [searchQuery, activities])

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "dd MMM yyyy, HH:mm:ss", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  // Función para renderizar el icono según el tipo de actividad
  const renderActivityIcon = (type: string, action?: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4 text-green-500" />
      case "logout":
        return <LogOut className="h-4 w-4 text-red-500" />
      case "inventory":
        if (action === "actualizó") {
          return <Edit className="h-4 w-4 text-blue-500" />
        }
        return <Package className="h-4 w-4 text-blue-500" />
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />
    }
  }

  // Función para manejar la exportación
  const handleExport = (format: "pdf" | "excel") => {
    // Simulación de exportación
    const delay = Math.floor(Math.random() * 1000) + 500 // Entre 500ms y 1500ms

    toast({
      title: `Exportando a ${format.toUpperCase()}`,
      description: "Preparando el archivo para descargar...",
    })

    setTimeout(() => {
      toast({
        title: "Exportación completada",
        description: `El archivo ha sido exportado en formato ${format.toUpperCase()}.`,
        variant: "success",
      })

      // Aquí se simula la descarga de un archivo
      const element = document.createElement("a")
      element.setAttribute("href", "data:text/plain;charset=utf-8,")
      element.setAttribute("download", `reporte-actividades.${format}`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, delay)
  }

  // Función para alternar la expansión de una actividad
  const toggleExpand = (id: number) => {
    setExpandedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Función para renderizar los cambios detallados
  const renderChanges = (changes?: Record<string, ActivityChange>) => {
    if (!changes || Object.keys(changes).length === 0) {
      return null
    }

    // Mapeo de nombres de campos para mostrar en español
    const fieldNames: Record<string, string> = {
      name: "Nombre",
      lot: "Lote",
      quantity: "Cantidad",
      expiryDate: "Fecha de vencimiento",
      status: "Estado",
      warehouse: "Almacén",
    }

    return (
      <div className="space-y-2 mt-2">
        <h4 className="text-sm font-medium">Detalles de los cambios:</h4>
        <div className="bg-muted/30 p-3 rounded-md space-y-2">
          {Object.entries(changes).map(([field, { from, to }]) => (
            <div key={field} className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-medium">{fieldNames[field] || field}</div>
              <div className="text-red-500 line-through">{from}</div>
              <div className="text-green-500">{to}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Función para renderizar una actividad individual
  const renderActivity = (activity: Activity) => {
    const isExpanded = expandedActivities[activity.id]
    const hasChanges = activity.changes && Object.keys(activity.changes).length > 0

    return (
      <div key={activity.id} className="border-b pb-4">
        <div className="flex items-start transition-all duration-300 hover:bg-muted/30 hover:pl-2 rounded-md p-2">
          <Avatar className="h-9 w-9 mt-1">
            <AvatarFallback>{activity.user.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm font-medium leading-none">
                <span className="font-semibold">{activity.user.name}</span> {activity.action}
                {activity.medication && (
                  <>
                    {" "}
                    <span className="font-semibold">{activity.medication}</span>
                    {activity.quantity && ` (${activity.quantity})`}
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                {renderActivityIcon(activity.type, activity.action)}
                <span className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</span>
              </div>
            </div>

            {activity.warehouse && (
              <div className="mt-1">
                <Badge variant="outline">Almacén: {activity.warehouse}</Badge>
              </div>
            )}

            {activity.details && <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>}

            {hasChanges && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-8 text-xs flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                onClick={() => toggleExpand(activity.id)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Ocultar detalles
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Ver detalles de cambios
                  </>
                )}
              </Button>
            )}

            {isExpanded && hasChanges && renderChanges(activity.changes)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto transition-all duration-300 hover-slide-right"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                Exportar a PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar a Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            Todas las Actividades
          </TabsTrigger>
          <TabsTrigger value="login" className="flex-1 sm:flex-none">
            Inicios de Sesión
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex-1 sm:flex-none">
            Movimientos de Inventario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle>Registro de Actividades</CardTitle>
              <CardDescription>Historial completo de actividades en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por usuario, medicamento o almacén..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>

              <div className="space-y-4">
                {filteredActivities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No se encontraron actividades.</p>
                ) : (
                  filteredActivities.map((activity) => renderActivity(activity))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle>Inicios de Sesión</CardTitle>
              <CardDescription>Registro de inicios y cierres de sesión en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por usuario..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>

              <div className="space-y-4">
                {filteredActivities
                  .filter((activity) => activity.type === "login" || activity.type === "logout")
                  .map((activity) => renderActivity(activity))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="pb-3">
              <CardTitle>Movimientos de Inventario</CardTitle>
              <CardDescription>Registro de movimientos de medicamentos en el inventario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por usuario, medicamento o almacén..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>

              <div className="space-y-4">
                {filteredActivities
                  .filter((activity) => activity.type === "inventory")
                  .map((activity) => renderActivity(activity))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

