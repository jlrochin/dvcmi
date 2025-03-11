"use client"

import { useEffect, useState } from "react"
import { getActivities } from "@/lib/activity-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Package, ArrowUp, RefreshCw, Trash } from "lucide-react"

type ActivityItem = {
  id: string
  type: string
  action: string
  medication?: string
  details?: string
  created_at: string
  users: {
    name: string
    role: string
  }
}

export function RecentActivities() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true)
        const data = await getActivities()
        setActivities(data.slice(0, 5)) // Mostrar solo las 5 más recientes
      } catch (error) {
        console.error("Error al cargar actividades:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Obtener icono según el tipo y acción
  const getActivityIcon = (type: string, action: string) => {
    if (type === "inventory") {
      switch (action) {
        case "add":
          return <ArrowUp className="h-4 w-4 text-green-500" />
        case "update":
          return <RefreshCw className="h-4 w-4 text-blue-500" />
        case "remove":
          return <Trash className="h-4 w-4 text-red-500" />
        default:
          return <Package className="h-4 w-4 text-gray-500" />
      }
    }

    return <Activity className="h-4 w-4 text-gray-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actividades Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="space-y-1">
                  <div className="h-4 w-32 rounded bg-muted"></div>
                  <div className="h-3 w-24 rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No hay actividades recientes</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                  {getActivityIcon(activity.type, activity.action)}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {activity.users.name}{" "}
                    {activity.action === "add"
                      ? "agregó"
                      : activity.action === "update"
                        ? "actualizó"
                        : activity.action === "remove"
                          ? "eliminó"
                          : "realizó acción en"}{" "}
                    {activity.medication || "un medicamento"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

