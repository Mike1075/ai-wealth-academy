import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://fravbpockztpjnpofxcq.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your_anon_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: number
          name: string
          email: string
          phone: string
          company: string
          message: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone: string
          company: string
          message: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string
          company?: string
          message?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: number
          name: string
          email: string
          phone?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: number
          title: string
          description: string
          price: number
          duration: string
          level: string
          image_url?: string
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          price: number
          duration: string
          level: string
          image_url?: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          price?: number
          duration?: string
          level?: string
          image_url?: string
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: number
          user_id: number
          course_id: number
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: number
          course_id: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          course_id?: number
          status?: string
          created_at?: string
        }
      }
    }
  }
} 