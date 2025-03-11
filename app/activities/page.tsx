"use client"

import { useState, useEffect } from "react"
import { getActivities } from "@/lib/activity-service"
import { ActivityList } from "@/components/activities/activity-list"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true)
        const data = await getActivities()
        setActivities(data)
      } catch (err) {
        console.error("Error al cargar actividades:", err)
        setError("No se pudo cargar el registro de actividades. Por favor, intente de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  return (
    <DashboardLayout title="Registro de Actividades">
      {error && <Card className="mb-4 p-4 bg-red-50 text-red-600 border-red-200">{error}</Card>}

      <ActivityList activities={activities} isLoading={loading} />
    </DashboardLayout>
  )
}

