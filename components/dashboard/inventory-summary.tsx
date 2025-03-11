"use client"

import { useEffect, useState } from "react"
import { getInventoryItems } from "@/lib/inventory-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle } from "lucide-react"

export function InventorySummary() {
  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    expiringSoon: 0,
    outOfStock: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInventory() {
      try {
        setLoading(true)
        const data = await getInventoryItems()

        // Calcular resumen
        const now = new Date()
        const threeMonthsFromNow = new Date()
        threeMonthsFromNow.setMonth(now.getMonth() + 3)

        const summary = {
          total: data.length,
          available: data.filter((item) => item.status === "Disponible").length,
          expiringSoon: data.filter((item) => {
            const expiryDate = new Date(item.expiry_date)
            return expiryDate > now && expiryDate < threeMonthsFromNow
          }).length,
          outOfStock: data.filter((item) => item.status === "Agotado").length,
        }

        setSummary(summary)
      } catch (error) {
        console.error("Error al cargar inventario:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInventory()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resumen de Inventario</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 w-20 rounded bg-muted"></div>
                <div className="h-6 w-12 rounded bg-muted"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="flex items-center text-sm text-muted-foreground">
                <Package className="mr-1 h-4 w-4" /> Total
              </p>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <div>
              <p className="flex items-center text-sm text-muted-foreground">
                <Package className="mr-1 h-4 w-4" /> Disponibles
              </p>
              <p className="text-2xl font-bold">{summary.available}</p>
            </div>
            <div>
              <p className="flex items-center text-sm text-muted-foreground">
                <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" /> Por vencer
              </p>
              <p className="text-2xl font-bold">{summary.expiringSoon}</p>
            </div>
            <div>
              <p className="flex items-center text-sm text-muted-foreground">
                <AlertTriangle className="mr-1 h-4 w-4 text-red-500" /> Agotados
              </p>
              <p className="text-2xl font-bold">{summary.outOfStock}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

