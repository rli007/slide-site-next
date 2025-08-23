import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'slider' | 'shipper' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'slider' | 'shipper' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'slider' | 'shipper' | null
          created_at?: string
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          user_id: string
          start_location: string
          end_location: string
          schedule: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_location: string
          end_location: string
          schedule: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_location?: string
          end_location?: string
          schedule?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      deliveries: {
        Row: {
          id: string
          shipper_id: string
          pickup_location: string
          dropoff_location: string
          package_size: string
          status: 'pending' | 'assigned' | 'in-transit' | 'delivered'
          route_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shipper_id: string
          pickup_location: string
          dropoff_location: string
          package_size: string
          status?: 'pending' | 'assigned' | 'in-transit' | 'delivered'
          route_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shipper_id?: string
          pickup_location?: string
          dropoff_location?: string
          package_size?: string
          status?: 'pending' | 'assigned' | 'in-transit' | 'delivered'
          route_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
