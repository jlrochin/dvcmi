"use client"

import { useEffect, useState } from "react"
import { PieChart as Chart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useTheme } from "next-themes"
import { inventoryData } from "@/lib/data"

interface CategoryData {
  name: string
  value: number
}

export function PieChart() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<CategoryData[]>([])

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calcular datos del inventario actual
  useEffect(() => {
    // Agrupar cantidades por almacén
    const warehouseTotals = inventoryData.reduce(
      (acc, item) => {
        if (!acc[item.warehouse]) {
          acc[item.warehouse] = 0
        }
        acc[item.warehouse] += item.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    // Calcular el total
    const total = Object.values(warehouseTotals).reduce((sum, value) => sum + value, 0)

    // Convertir a porcentajes
    const categoryData: CategoryData[] = Object.entries(warehouseTotals).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
    }))

    setData(categoryData)
  }, [])

  if (!mounted) {
    return null
  }

  // Colores para el tema claro y oscuro
  const COLORS =
    theme === "dark"
      ? ["#3b82f6", "#8b5cf6", "#10b981", "#06b6d4", "#f59e0b"] // Oscuro: Azul, Púrpura, Verde, Cyan, Ámbar
      : ["#2563eb", "#7c3aed", "#059669", "#0891b2", "#d97706"] // Claro: Azul, Púrpura, Verde, Cyan, Ámbar

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Chart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
              borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
              color: theme === "dark" ? "#e5e7eb" : "#374151",
            }}
          />
          <Legend />
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}

