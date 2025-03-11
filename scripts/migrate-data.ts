import { supabase } from "../lib/supabase"
import { inventoryData } from "../lib/data"

async function migrateInventory() {
  console.log("Iniciando migración de inventario...")

  // Obtener el ID del usuario administrador
  const { data: adminUser } = await supabase.from("users").select("id").eq("role", "Administrador").single()

  if (!adminUser) {
    console.error("No se encontró un usuario administrador")
    return
  }

  // Preparar los datos para inserción
  const inventoryItems = inventoryData.map((item) => ({
    name: item.name,
    lot: item.lot,
    quantity: item.quantity,
    expiry_date: item.expiryDate,
    status: item.status,
    warehouse: item.warehouse,
    code: item.code || null,
    origin: item.origin || "Migración",
    created_by: adminUser.id,
  }))

  // Insertar los datos en lotes de 50
  const batchSize = 50
  for (let i = 0; i < inventoryItems.length; i += batchSize) {
    const batch = inventoryItems.slice(i, i + batchSize)

    const { data, error } = await supabase.from("inventory").insert(batch).select()

    if (error) {
      console.error(`Error al migrar lote ${i / batchSize + 1}:`, error)
    } else {
      console.log(`Lote ${i / batchSize + 1} migrado correctamente (${batch.length} items)`)

      // Registrar actividad de migración
      await supabase.from("activities").insert({
        user_id: adminUser.id,
        type: "system",
        action: "migrate",
        details: `Migración de ${batch.length} items de inventario`,
      })
    }
  }

  console.log("Migración de inventario completada")
}

// Ejecutar la migración
migrateInventory()

