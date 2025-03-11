import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { inventoryData } from "@/lib/data"

export async function POST() {
  try {
    // Verificar si ya existen datos
    const { count } = await supabase.from("inventory").select("*", { count: "exact", head: true })

    if (count && count > 0) {
      return NextResponse.json({
        success: false,
        message: `Ya existen ${count} registros en la tabla inventory.`,
      })
    }

    // Obtener el ID del usuario administrador
    const { data: adminUser } = await supabase.from("users").select("id").eq("role", "Administrador").single()

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: "No se encontró un usuario administrador",
      })
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

    // Insertar datos
    const { error } = await supabase.from("inventory").insert(inventoryItems)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al migrar datos",
          error,
        },
        { status: 500 },
      )
    }

    // Registrar actividad
    await supabase.from("activities").insert({
      user_id: adminUser.id,
      type: "system",
      action: "migrate",
      details: `Migración inicial de ${inventoryItems.length} items de inventario`,
    })

    return NextResponse.json({
      success: true,
      message: "Migración completada con éxito",
      count: inventoryItems.length,
    })
  } catch (error) {
    console.error("Error en la migración:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error en la migración",
        error,
      },
      { status: 500 },
    )
  }
}

