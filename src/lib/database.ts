import { supabase } from './supabase'
import type { Database } from './supabase'

type User = Database['public']['Tables']['users']['Row']
type Route = Database['public']['Tables']['routes']['Row']
type Delivery = Database['public']['Tables']['deliveries']['Row']

// User functions
export const createUser = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error) throw error
  return data
}

export const updateUserRole = async (id: string, role: 'slider' | 'shipper') => {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Route functions
export const createRoute = async (route: Omit<Route, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('routes')
    .insert([route])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserRoutes = async (userId: string) => {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const updateRoute = async (id: string, updates: Partial<Route>) => {
  const { data, error } = await supabase
    .from('routes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteRoute = async (id: string) => {
  const { error } = await supabase
    .from('routes')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Delivery functions
export const createDelivery = async (delivery: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('deliveries')
    .insert([delivery])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserDeliveries = async (userId: string) => {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('shipper_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
  const { data, error } = await supabase
    .from('deliveries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteDelivery = async (id: string) => {
  const { error } = await supabase
    .from('deliveries')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Get all active routes for matching
export const getActiveRoutes = async () => {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Get pending deliveries for matching
export const getPendingDeliveries = async () => {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
