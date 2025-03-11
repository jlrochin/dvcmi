"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AddActivityDialog } from "@/components/add-activity-dialog"
import { recentActivityData as initialActivityData } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Store } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface RecentActivityProps {
  className?: string
}

export function RecentActivity({ className }: RecentActivityProps) {
  const [activities, setActivities] = useState(initialActivityData)

  // Cargar actividades desde localStorage al iniciar
  useEffect(() => {
    const storedActivities = localStorage.getItem("activities")
    if (storedActivities) {
      const parsedActivities = JSON.parse(storedActivities)
      // Filtrar solo actividades de inventario y limitar a 4
      const inventoryActivities = parsedActivities.filter((activity: any) => activity.type === "inventory").slice(0, 4)

      if (inventoryActivities.length > 0) {
        setActivities(inventoryActivities)
      }
    }
  }, [])

  // Función para añadir una nueva actividad
  const handleAddActivity = (newActivity: any) => {
    setActivities((prevActivities) => [newActivity, ...prevActivities.slice(0, 3)])
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "dd MMM, HH:mm", { locale: es })
    } catch (error) {
      return "Hace un momento"
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Actividad Reciente</h3>
        <AddActivityDialog onAddActivity={handleAddActivity} />
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center transition-all duration-300 hover:bg-muted/30 hover:pl-2 rounded-md p-2"
          >
            <Avatar className="h-9 w-9 transition-transform duration-300 hover:scale-110">
              <AvatarFallback>{activity.user.avatar}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
                <span className="font-semibold">{activity.medication}</span> ({activity.quantity})
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {typeof activity.timestamp === "string" && activity.timestamp.includes("T")
                    ? formatDate(activity.timestamp)
                    : activity.timestamp}
                </p>
                <Badge variant="outline" size="sm" className="text-xs">
                  <Store className="mr-1 h-3 w-3" />
                  {activity.warehouse}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

