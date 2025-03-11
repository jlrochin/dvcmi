"use client"

import { useState, useEffect } from "react"
import { getInventoryItems } from "@/lib/inventory-service"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"

export default function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function loadInventory() {
      try {
        setLoading(true)
        const data = await getInventoryItems()
        setInventory(data)
      } catch (err) {
        console.error("Error al cargar inventario:", err)
        setError("No se pudo cargar el inventario. Por favor, intente de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    loadInventory()
  }, [])

  return (
    <DashboardLayout title="Inventario de Medicamentos">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => router.push("/inventory/new")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo Medicamento
        </Button>
      </div>

      {error && <Card className="mb-4 p-4 bg-red-50 text-red-600 border-red-200">{error}</Card>}

      <InventoryTable data={inventory} isLoading={loading} />
    </DashboardLayout>
  )
}

