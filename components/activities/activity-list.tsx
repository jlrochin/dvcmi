"use client"

import { Activity, Package, ArrowUp, RefreshCw, Trash, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ActivityItem = {
  id: string
  type: string
  action: string
  medication?: string
  quantity?: string
  warehouse?: string
  details?: string
  created_at: string
  users: {
    name: string
    role: string
  }
}

interface ActivityListProps {
  activities: ActivityItem[]
  isLoading?: boolean
}

export function ActivityList({ activities = [], isLoading = false }: ActivityListProps) {
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Obtener icono según el tipo y acción
  const getActivityIcon = (type: string, action: string) => {
    if (type === "inventory") {
      switch (action) {
        case "add":
          return <ArrowUp className="h-5 w-5 text-green-500" />
        case "update":
          return <RefreshCw className="h-5 w-5 text-blue-500" />
        case "remove":
          return <Trash className="h-5 w-5 text-red-500" />
        default:
          return <Package className="h-5 w-5 text-gray-500" />
      }
    } else if (type === "system") {
      return <Database className="h-5 w-5 text-purple-500" />
    }

    return <Activity className="h-5 w-5 text-gray-500" />
  }

  // Obtener título según el tipo y acción
  const getActivityTitle = (activity: ActivityItem) => {
    const { type, action, medication, users } = activity

    if (type === "inventory") {
      switch (action) {
        case "add":
          return `${users.name} agregó ${medication || "un medicamento"} al inventario`
        case "update":
          return `${users.name} actualizó ${medication || "un medicamento"} en el inventario`
        case "remove":
          return `${users.name} eliminó ${medication || "un medicamento"} del inventario`
        default:
          return `${users.name} realizó una acción en el inventario`
      }
    } else if (type === "system") {
      return `Acción del sistema: ${action}`
    }

    return `${users.name} realizó una acción`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">No hay actividades registradas</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="mr-3">{getActivityIcon(activity.type, activity.action)}</div>
              <div>
                <CardTitle className="text-base">{getActivityTitle(activity)}</CardTitle>
                <CardDescription>
                  {formatDate(activity.created_at)} • {activity.users.role}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {(activity.details || activity.warehouse || activity.quantity) && (
            <CardContent className="pt-0">
              {activity.details && <p className="text-sm">{activity.details}</p>}
              {activity.warehouse && <p className="text-sm text-muted-foreground">Almacén: {activity.warehouse}</p>}
              {activity.quantity && <p className="text-sm text-muted-foreground">Cantidad: {activity.quantity}</p>}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

