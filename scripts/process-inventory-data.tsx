"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { inventoryData } from "@/lib/data"

export default function ProcessInventoryData() {
  const [activeTab, setActiveTab] = useState("antimicrobianos")

  // Filtrar datos por categoría
  const antimicrobianos = inventoryData.filter(
    (item) => item.warehouse.includes("Antimicrobianos") || item.warehouse.includes("ANT"),
  )

  const oncologicos = inventoryData.filter(
    (item) => item.warehouse.includes("Oncológicos") || item.warehouse.includes("ONC"),
  )

  const npt = inventoryData.filter((item) => item.warehouse.includes("NPT"))

  // Función para exportar datos a CSV
  const exportToCSV = (data, filename) => {
    // Crear encabezados
    const headers = ["ID", "Nombre", "Lote", "Cantidad", "Fecha Caducidad", "Estado", "Almacén", "Código", "Origen"]

    // Convertir datos a formato CSV
    const csvRows = []
    csvRows.push(headers.join(","))

    for (const item of data) {
      const values = [
        item.id,
        `"${item.name}"`,
        item.lot,
        item.quantity,
        item.expiryDate,
        item.status,
        `"${item.warehouse}"`,
        item.code,
        item.origin,
      ]
      csvRows.push(values.join(","))
    }

    // Crear blob y descargar
    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })

    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Procesamiento de Datos de Inventario</CardTitle>
          <CardDescription>Visualiza y exporta los datos de inventario por categoría</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="antimicrobianos">Antimicrobianos</TabsTrigger>
              <TabsTrigger value="oncologicos">Oncológicos</TabsTrigger>
              <TabsTrigger value="npt">NPT</TabsTrigger>
            </TabsList>

            <TabsContent value="antimicrobianos">
              <div className="mb-4">
                <Button onClick={() => exportToCSV(antimicrobianos, "antimicrobianos.csv")}>
                  Exportar Antimicrobianos
                </Button>
              </div>
              <div className="overflow-auto max-h-96">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Nombre</th>
                      <th className="p-2 text-left">Lote</th>
                      <th className="p-2 text-left">Cantidad</th>
                      <th className="p-2 text-left">Caducidad</th>
                      <th className="p-2 text-left">Estado</th>
                      <th className="p-2 text-left">Almacén</th>
                      <th className="p-2 text-left">Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {antimicrobianos.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.lot}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.expiryDate}</td>
                        <td className="p-2">{item.status}</td>
                        <td className="p-2">{item.warehouse}</td>
                        <td className="p-2">{item.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="oncologicos">
              <div className="mb-4">
                <Button onClick={() => exportToCSV(oncologicos, "oncologicos.csv")}>Exportar Oncológicos</Button>
              </div>
              <div className="overflow-auto max-h-96">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Nombre</th>
                      <th className="p-2 text-left">Lote</th>
                      <th className="p-2 text-left">Cantidad</th>
                      <th className="p-2 text-left">Caducidad</th>
                      <th className="p-2 text-left">Estado</th>
                      <th className="p-2 text-left">Almacén</th>
                      <th className="p-2 text-left">Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oncologicos.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.lot}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.expiryDate}</td>
                        <td className="p-2">{item.status}</td>
                        <td className="p-2">{item.warehouse}</td>
                        <td className="p-2">{item.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="npt">
              <div className="mb-4">
                <Button onClick={() => exportToCSV(npt, "npt.csv")}>Exportar NPT</Button>
              </div>
              <div className="overflow-auto max-h-96">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Nombre</th>
                      <th className="p-2 text-left">Lote</th>
                      <th className="p-2 text-left">Cantidad</th>
                      <th className="p-2 text-left">Caducidad</th>
                      <th className="p-2 text-left">Estado</th>
                      <th className="p-2 text-left">Almacén</th>
                      <th className="p-2 text-left">Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {npt.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.lot}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.expiryDate}</td>
                        <td className="p-2">{item.status}</td>
                        <td className="p-2">{item.warehouse}</td>
                        <td className="p-2">{item.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

