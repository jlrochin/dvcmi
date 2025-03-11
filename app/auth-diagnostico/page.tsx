"use client"

import { AuthTest } from "@/components/diagnostics/auth-test"

export default function AuthDiagnosticoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Autenticación</h1>
      <AuthTest />
    </div>
  )
}

