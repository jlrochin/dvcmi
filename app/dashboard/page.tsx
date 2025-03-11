"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { InventorySummary } from "@/components/dashboard/inventory-summary"
import { Package, Activity, AlertTriangle, Calendar } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Medicamentos"
          value="--"
          description="Medicamentos en inventario"
          icon={<Package />}
        />
        <StatsCard
          title="Medicamentos por Vencer"
          value="--"
          description="En los próximos 3 meses"
          icon={<Calendar />}
          trend="up"
          trendValue="+2 desde ayer"
        />
        <StatsCard
          title="Medicamentos Agotados"
          value="--"
          description="Requieren reposición"
          icon={<AlertTriangle />}
          trend="down"
          trendValue="-1 desde ayer"
        />
        <StatsCard title="Actividades Recientes" value="--" description="En las últimas 24 horas" icon={<Activity />} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <InventorySummary />
        <RecentActivities />
      </div>
    </DashboardLayout>
  )
}

