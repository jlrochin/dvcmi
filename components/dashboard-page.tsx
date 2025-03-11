"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "@/components/bar-chart"
import { PieChart } from "@/components/pie-chart"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { inventoryData } from "@/lib/data"

export function DashboardPage() {
  const [expiringMeds, setExpiringMeds] = useState<any[]>([])

  useEffect(() => {
    // Calcular días hasta vencimiento para cada medicamento
    const medsWithDays = inventoryData.map((med) => {
      const today = new Date()
      const expiry = new Date(med.expiryDate)
      const diffTime = expiry.getTime() - today.getTime()
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return {
        ...med,
        days,
      }
    })

    // Filtrar medicamentos que vencen en los próximos 90 días y ordenar por días
    const expiring = medsWithDays
      .filter((med) => med.days <= 90)
      .sort((a, b) => a.days - b.days)
      .slice(0, 4)

    setExpiringMeds(expiring)
  }, [])

  // Función para determinar el color según los días hasta el vencimiento
  const getExpiryColor = (days: number) => {
    if (days <= 30) return "bg-red-500"
    if (days <= 60) return "bg-orange-500"
    return "bg-green-500"
  }

  // Función para determinar el color del texto según los días hasta el vencimiento
  const getExpiryTextColor = (days: number) => {
    if (days <= 30) return "text-red-500"
    if (days <= 60) return "text-orange-500"
    return "text-green-500"
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">
            Vista General
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 sm:flex-none">
            Analítica
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StatsCards />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7 lg:col-span-4 card-hover">
              <CardHeader>
                <CardTitle>Consumo Mensual de Medicamentos</CardTitle>
                <CardDescription>Tendencia de consumo en los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart />
              </CardContent>
            </Card>

            <Card className="col-span-7 lg:col-span-3 card-hover">
              <CardHeader>
                <CardTitle>Distribución por Categorías</CardTitle>
                <CardDescription>Porcentaje de medicamentos por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7 lg:col-span-4 card-hover">
              <CardHeader className="pb-2">
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimos movimientos en el inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>

            <Card className="col-span-7 lg:col-span-3 card-hover">
              <CardHeader>
                <CardTitle>Medicamentos Próximos a Vencer</CardTitle>
                <CardDescription>Medicamentos que vencen en los próximos 90 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expiringMeds.length > 0 ? (
                    expiringMeds.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className={`mr-2 h-2 w-2 rounded-full ${getExpiryColor(item.days)}`} />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Vence: {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`text-sm font-medium ${getExpiryTextColor(item.days)}`}>{item.days} días</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No hay medicamentos próximos a vencer.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Análisis Detallado</CardTitle>
                <CardDescription>Análisis detallado del consumo de medicamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Esta sección mostrará análisis detallados cuando se conecte a un backend.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

