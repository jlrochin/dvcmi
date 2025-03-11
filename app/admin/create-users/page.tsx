import CreateTestUsers from "@/scripts/create-test-users"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function CreateUsersPage() {
  return (
    <DashboardLayout title="Crear Usuarios de Prueba">
      <CreateTestUsers />
    </DashboardLayout>
  )
}

