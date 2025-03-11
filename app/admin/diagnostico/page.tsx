import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ConnectionTest } from "@/components/diagnostics/connection-test"

export default function DiagnosticoPage() {
  return (
    <DashboardLayout title="Diagnóstico de Conexión">
      <div className="max-w-4xl mx-auto">
        <ConnectionTest />
      </div>
    </DashboardLayout>
  )
}

