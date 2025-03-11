"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { inventoryData } from "@/lib/data"

interface StatsData {
  total: number
  lowStock: number
  normalStock: number
  expiringSoon: number
  totalChange: number
  lowStockChange: number
  normalStockChange: number
  expiringSoonChange: number
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    lowStock: 0,
    normalStock: 0,
    expiringSoon: 0,
    totalChange: 0,
    lowStockChange: 0,
    normalStockChange: 0,
    expiringSoonChange: 2,
  })

  useEffect(() => {
    // Calcular estadísticas del inventario actual
    const currentStats = {
      total: inventoryData.reduce((sum, item) => sum + item.quantity, 0),
      lowStock: inventoryData.filter((item) => item.status === "Bajo Stock").length,
      normalStock: inventoryData.filter((item) => item.status === "Normal").length,
      expiringSoon: inventoryData.filter((item) => {
        const today = new Date()
        const expiryDate = new Date(item.expiryDate)
        const diffTime = expiryDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 90
      }).length,
    }

    // Simular cambios respecto al mes anterior (en una aplicación real, esto vendría de la base de datos)
    const changes = {
      totalChange: ((currentStats.total - 1100) / 1100) * 100,
      lowStockChange: ((currentStats.lowStock - 24) / 24) * 100,
      normalStockChange: ((currentStats.normalStock - 1050) / 1050) * 100,
      expiringSoonChange: 2, // Cambio fijo para este ejemplo
    }

    setStats({
      ...currentStats,
      ...changes,
    })
  }, [])

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Medicamentos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalChange >= 0 ? "+" : ""}
            {stats.totalChange.toFixed(0)}% respecto al mes anterior
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bajo Stock</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lowStock}</div>
          <p className="text-xs text-muted-foreground">
            {stats.lowStockChange >= 0 ? "+" : ""}
            {stats.lowStockChange.toFixed(0)}% respecto al mes anterior
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Normal</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.normalStock}</div>
          <p className="text-xs text-muted-foreground">
            {stats.normalStockChange >= 0 ? "+" : ""}
            {stats.normalStockChange.toFixed(0)}% respecto al mes anterior
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próximos a Vencer</CardTitle>
          <Clock className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expiringSoon}</div>
          <p className="text-xs text-muted-foreground">+{stats.expiringSoonChange} desde la semana pasada</p>
        </CardContent>
      </Card>
    </div>
  )
}

