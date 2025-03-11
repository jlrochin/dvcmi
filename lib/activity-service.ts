import { supabase } from "./supabase"

export type Activity = {
  id?: string
  user_id: string
  type: string
  action: string
  medication?: string
  quantity?: string
  warehouse?: string
  details?: string
}

// Obtener todas las actividades
export async function getActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select("*, users(name, role)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Registrar una nueva actividad
export async function createActivity(activity: Activity) {
  const { data, error } = await supabase.from("activities").insert([activity]).select()

  if (error) throw error
  return data[0]
}

// Función de ayuda para registrar actividades de inventario
export async function logInventoryActivity({
  userId,
  action,
  medication,
  quantity,
  warehouse,
  details,
}: {
  userId: string
  action: "add" | "update" | "remove"
  medication: string
  quantity?: string
  warehouse?: string
  details?: string
}) {
  return createActivity({
    user_id: userId,
    type: "inventory",
    action,
    medication,
    quantity,
    warehouse,
    details,
  })
}

