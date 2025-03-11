import { supabase } from "./supabase"

export type InventoryItem = {
  id?: string
  name: string
  lot: string
  quantity: number
  expiry_date: string
  status: string
  warehouse: string
  code?: string
  origin?: string
  created_by?: string
}

// Obtener todos los items del inventario
export async function getInventoryItems() {
  const { data, error } = await supabase.from("inventory").select("*").order("name")

  if (error) throw error
  return data
}

// Obtener un item específico
export async function getInventoryItem(id: string) {
  const { data, error } = await supabase.from("inventory").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

// Crear un nuevo item
export async function createInventoryItem(item: InventoryItem) {
  const { data, error } = await supabase.from("inventory").insert([item]).select()

  if (error) throw error
  return data[0]
}

// Actualizar un item existente
export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
  const { data, error } = await supabase.from("inventory").update(updates).eq("id", id).select()

  if (error) throw error
  return data[0]
}

// Eliminar un item
export async function deleteInventoryItem(id: string) {
  const { error } = await supabase.from("inventory").delete().eq("id", id)

  if (error) throw error
  return true
}

