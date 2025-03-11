"use client"

import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Pause, Play, Bot } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface MedicationRecord {
  folio: string
  patient: string
  medication: string
  dose: string
  vials: number
  opt: string
  lot: string
  comments: string
  solution: string
  volume: string
  quantity: number
  solutionLot: string
  isNew?: boolean
  dispensed?: boolean
}

export function SurtimientoTable() {
  const [records, setRecords] = useState<MedicationRecord[]>([])
  const [botPaused, setBotPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulated bot updates - replace this with your real-time data source
  useEffect(() => {
    // Initial data
    setRecords([
      {
        folio: "17219",
        patient: "LOPEZ MAGAÑA, MARIA DE JESUS",
        medication: "levofloxacino 500 mg",
        dose: "750 mg",
        vials: 1,
        opt: "1.5",
        lot: "Y24E250-V",
        comments: "",
        solution: "Sin Solución",
        volume: "",
        quantity: 1,
        solutionLot: "Sin Lote Solución",
        isNew: false,
      },
      {
        folio: "19297",
        patient: "LOPEZ MAGAÑA, JOSE ASCENCION",
        medication: "levofloxacino 500 mg",
        dose: "750 mg",
        vials: 1,
        opt: "1.5",
        lot: "Y24E250-V",
        comments: "",
        solution: "Sin Solución",
        volume: "",
        quantity: 1,
        solutionLot: "Sin Lote Solución",
        isNew: false,
      },
      {
        folio: "17430",
        patient: "GONZALEZ VAZQUEZ, ALAN",
        medication: "ceftriaxona 1000 mg",
        dose: "2000 mg",
        vials: 2,
        opt: "2",
        lot: "J24T017-A",
        comments: "",
        solution: "Cloruro de Sodio 0.9% Envase con 100 ml",
        volume: "100 mL",
        quantity: 1,
        solutionLot: "VZ4277",
        isNew: false,
      },
    ])

    // Start the bot if not paused
    if (!botPaused) {
      startBot()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [botPaused])

  // Function to start the bot
  const startBot = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      const newRecord: MedicationRecord = {
        folio: Math.floor(Math.random() * 100000).toString(),
        patient: "NUEVO PACIENTE " + Math.floor(Math.random() * 100),
        medication: Math.random() > 0.5 ? "ceftriaxona 1000 mg" : "vancomicina 500 mg",
        dose: Math.random() > 0.5 ? "2000 mg" : "1000 mg",
        vials: Math.floor(Math.random() * 3) + 1,
        opt: Math.random() > 0.5 ? "2" : "1",
        lot: Math.random() > 0.5 ? "J24T017-A" : "M24012A-V",
        comments: "",
        solution: Math.random() > 0.3 ? "Cloruro de Sodio 0.9% Envase con 100 ml" : "Sin Solución",
        volume: Math.random() > 0.3 ? "100 mL" : "",
        quantity: 1,
        solutionLot: Math.random() > 0.3 ? "VZ4277" : "Sin Lote Solución",
        isNew: true,
      }

      setRecords((prev) => [newRecord, ...prev])

      // Remove the highlight after animation
      setTimeout(() => {
        setRecords((prev) =>
          prev.map((record) => (record.folio === newRecord.folio ? { ...record, isNew: false } : record)),
        )
      }, 3000)
    }, 10000) // Updates every 10 seconds for demo
  }

  // Function to toggle bot pause state
  const toggleBotPause = () => {
    setBotPaused((prev) => !prev)
  }

  // Function to mark a record as dispensed
  const markAsDispensed = (folio: string) => {
    setRecords((prev) =>
      prev.map((record) => (record.folio === folio ? { ...record, dispensed: !record.dispensed } : record)),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <span className="font-medium">
            Bot de Surtimiento:
            <span className={botPaused ? "text-red-500 ml-2" : "text-green-500 ml-2"}>
              {botPaused ? "Pausado" : "Activo"}
            </span>
          </span>
        </div>
        <Button
          onClick={toggleBotPause}
          variant={botPaused ? "default" : "outline"}
          size="sm"
          className={botPaused ? "bg-blue-500 hover:bg-blue-600" : "border-blue-200 text-blue-700"}
        >
          {botPaused ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Reanudar Bot
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pausar Bot
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr className="bg-muted/50">
                <th className="w-[80px] p-2 text-left">Folio</th>
                <th className="w-[180px] p-2 text-left">Paciente</th>
                <th className="w-[180px] p-2 text-left">Medicamento</th>
                <th className="w-[80px] p-2 text-left">Dosis</th>
                <th className="w-[70px] p-2 text-center">Frascos</th>
                <th className="w-[50px] p-2 text-center">Opt</th>
                <th className="w-[100px] p-2 text-left">Lote</th>
                <th className="w-[120px] p-2 text-left">Comentario</th>
                <th className="w-[180px] p-2 text-left">Solución</th>
                <th className="w-[80px] p-2 text-left">Volumen</th>
                <th className="w-[80px] p-2 text-center">Cantidad</th>
                <th className="w-[100px] p-2 text-left">Lote Solución</th>
                <th className="w-[80px] p-2 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={13} className="h-24 text-center">
                    Esperando datos...
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr
                    key={record.folio}
                    className={`
                      ${record.isNew ? "animate-highlight" : ""}
                      ${record.dispensed ? "bg-green-50 text-green-800" : index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                    `}
                  >
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>{record.folio}</td>
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>{record.patient}</td>
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>{record.medication}</td>
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>{record.dose}</td>
                    <td className={`p-2 text-center ${record.dispensed ? "line-through" : ""}`}>{record.vials}</td>
                    <td className={`p-2 text-center ${record.dispensed ? "line-through" : ""}`}>{record.opt}</td>
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>{record.lot}</td>
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>{record.comments}</td>
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>
                      <Badge
                        variant="outline"
                        className={`font-normal w-full justify-center ${
                          record.solution === "Sin Solución" ? "bg-gray-50 text-gray-600" : "bg-blue-50 text-blue-600"
                        } ${record.dispensed ? "opacity-50" : ""}`}
                      >
                        {record.solution}
                      </Badge>
                    </td>
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>{record.volume}</td>
                    <td className={`p-2 text-center ${record.dispensed ? "line-through" : ""}`}>{record.quantity}</td>
                    <td className={`p-2 ${record.dispensed ? "line-through" : ""}`}>{record.solutionLot}</td>
                    <td className="p-2 text-center">
                      <Button
                        variant={record.dispensed ? "outline" : "default"}
                        size="sm"
                        className={`w-full ${record.dispensed ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-300" : ""}`}
                        onClick={() => markAsDispensed(record.folio)}
                      >
                        {record.dispensed ? <CheckCircle2 className="h-4 w-4 mr-1" /> : "Surtir"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

