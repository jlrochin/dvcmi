"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Medication } from "./medication-management-page"
import { cn } from "@/lib/utils"

interface MedicationSearchProps {
  medications: Medication[]
  onSelectMedication: (medication: Medication | null) => void
}

export function MedicationSearch({ medications, onSelectMedication }: MedicationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Medication[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Actualizar sugerencias cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([])
      return
    }

    const query = searchQuery.toLowerCase()
    const filteredMedications = medications
      .filter(
        (med) =>
          (med.code && med.code.toLowerCase().includes(query)) ||
          med.name.toLowerCase().includes(query) ||
          med.lot.toLowerCase().includes(query),
      )
      .slice(0, 10) // Limitar a 10 resultados

    setSuggestions(filteredMedications)
    setSelectedIndex(-1)
  }, [searchQuery, medications])

  // Manejar clic fuera de las sugerencias para cerrarlas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return

    // Flecha abajo
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    }
    // Flecha arriba
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[selectedIndex])
    }
    // Escape
    else if (e.key === "Escape") {
      e.preventDefault()
      setShowSuggestions(false)
    }
  }

  // Añadir una función para limpiar la búsqueda cuando se selecciona un medicamento
  const handleSelectSuggestion = (medication: Medication) => {
    setSearchQuery(medication.name)
    setShowSuggestions(false)
    onSelectMedication(medication)
  }

  // Actualizar la función para limpiar la búsqueda
  const handleClearSearch = () => {
    setSearchQuery("")
    setSuggestions([])
    onSelectMedication(null)
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Buscar por código, nombre o lote..."
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-9 w-9" onClick={handleClearSearch}>
              <X className="h-4 w-4" />
              <span className="sr-only">Limpiar búsqueda</span>
            </Button>
          )}
        </div>
        <Button type="submit" className="shrink-0">
          Buscar
        </Button>
      </div>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
          <ul className="py-1 text-sm">
            {suggestions.map((medication, index) => (
              <li
                key={medication.id}
                className={cn(
                  "flex items-center px-3 py-2 cursor-pointer hover:bg-muted",
                  selectedIndex === index && "bg-muted",
                )}
                onClick={() => handleSelectSuggestion(medication)}
              >
                <div className="flex flex-col">
                  <div className="font-medium">{medication.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {medication.code}
                    </Badge>
                    <span>Lote: {medication.lot}</span>
                    <span>Stock: {medication.quantity}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {showSuggestions && searchQuery && suggestions.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background p-4 shadow-lg">
          <p className="text-sm text-muted-foreground">
            No se encontraron medicamentos. Complete el formulario para dar de alta uno nuevo.
          </p>
        </div>
      )}
    </div>
  )
}

