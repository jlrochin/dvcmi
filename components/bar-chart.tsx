"use client"

import { useEffect, useState } from "react"
import { BarChart as Chart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTheme } from "next-themes"
import { inventoryData } from "@/lib/data"

interface MonthlyData {
  name: string
  Antimicrobianos: number
  Oncológicos: number
  NPT: number
  Soluciones: number
  Insumos: number
}

export function BarChart() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<MonthlyData[]>([])

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

    // Crear datos mensuales (simulados para los meses anteriores)
    const monthlyData: MonthlyData[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"].map((month, index) => {
      // Para el último mes (Junio), usar datos reales del inventario
      if (index === 5) {
        return {
          name: month,
          Antimicrobianos: warehouseTotals["Antimicrobianos"] || 0,
          Oncológicos: warehouseTotals["Oncológicos"] || 0,
          NPT: warehouseTotals["NPT"] || 0,
          Soluciones: warehouseTotals["Soluciones"] || 0,
          Insumos: warehouseTotals["Insumos"] || 0,
        }
      }

      // Para los meses anteriores, generar datos simulados basados en los datos actuales
      const randomFactor = 0.7 + Math.random() * 0.6 // Factor entre 0.7 y 1.3
      return {
        name: month,
        Antimicrobianos: Math.round((warehouseTotals["Antimicrobianos"] || 0) * randomFactor),
        Oncológicos: Math.round((warehouseTotals["Oncológicos"] || 0) * randomFactor),
        NPT: Math.round((warehouseTotals["NPT"] || 0) * randomFactor),
        Soluciones: Math.round((warehouseTotals["Soluciones"] || 0) * randomFactor),
        Insumos: Math.round((warehouseTotals["Insumos"] || 0) * randomFactor),
      }
    })

    setData(monthlyData)
  }, [])

  if (!mounted) {
    return null
  }

  // Colores para el tema claro y oscuro
  const colors = {
    Antimicrobianos: theme === "dark" ? "#3b82f6" : "#2563eb", // Azul
    Oncológicos: theme === "dark" ? "#8b5cf6" : "#7c3aed", // Púrpura
    NPT: theme === "dark" ? "#10b981" : "#059669", // Verde
    Soluciones: theme === "dark" ? "#06b6d4" : "#0891b2", // Cyan
    Insumos: theme === "dark" ? "#f59e0b" : "#d97706", // Ámbar
    text: theme === "dark" ? "#e5e7eb" : "#374151",
    grid: theme === "dark" ? "#374151" : "#e5e7eb",
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Chart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="name" stroke={colors.text} />
          <YAxis stroke={colors.text} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
              borderColor: colors.grid,
              color: colors.text,
            }}
          />
          <Legend />
          <Bar dataKey="Antimicrobianos" fill={colors.Antimicrobianos} />
          <Bar dataKey="Oncológicos" fill={colors.Oncológicos} />
          <Bar dataKey="NPT" fill={colors.NPT} />
          <Bar dataKey="Soluciones" fill={colors.Soluciones} />
          <Bar dataKey="Insumos" fill={colors.Insumos} />
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}

