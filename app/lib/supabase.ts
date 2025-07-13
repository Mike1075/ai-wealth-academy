import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://fravbpockztpjnpofxcq.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYXZicG9ja3p0cGpucG9meGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjg1ODYsImV4cCI6MjA2NzkwNDU4Nn0.PO8A0I-8HxpSiB0qSwbXuYwjjzlMGxas41PKqr6ZJr8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 认证相关的工具函数
export const auth = {
  // 用户注册
  async signUp(email: string, password: string, userData?: { name?: string, phone?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // 用户登录
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // 用户登出
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 获取当前用户
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // 获取当前会话
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // 重置密码
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  },

  // 更新密码
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  // 监听认证状态变化
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// 用户相关的数据库操作
export const userService = {
  // 获取用户资料
  async getUserProfile(authUserId: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_profiles (*),
        admins (*)
      `)
      .eq('auth_user_id', authUserId)
      .single()
    return { data, error }
  },

  // 更新用户资料
  async updateUserProfile(userId: number, updates: Partial<UserUpdate>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // 获取用户权限
  async getUserPermissions(authUserId: string) {
    const { data, error } = await supabase
      .rpc('get_user_permissions', { user_auth_id: authUserId })
    return { data, error }
  },

  // 检查用户权限
  async hasPermission(permission: string) {
    const { data, error } = await supabase
      .rpc('has_permission', { permission_name: permission })
    return { data, error }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          id: number
          permissions: string[] | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          permissions?: string[] | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          permissions?: string[] | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: number
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: number | null
          table_name: string | null
          user_agent: string | null
          user_id: number | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: number
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: number | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: number
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: number | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string
          created_at: string | null
          email: string
          id: number
          message: string
          name: string
          phone: string
        }
        Insert: {
          company: string
          created_at?: string | null
          email: string
          id?: number
          message: string
          name: string
          phone: string
        }
        Update: {
          company?: string
          created_at?: string | null
          email?: string
          id?: number
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string
          duration: string
          id: number
          image_url: string | null
          level: string
          price: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: string
          id?: number
          image_url?: string | null
          level: string
          price: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: string
          id?: number
          image_url?: string | null
          level?: string
          price?: number
          title?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: number
          created_at: string | null
          id: number
          status: string | null
          user_id: number
        }
        Insert: {
          course_id: number
          created_at?: string | null
          id?: number
          status?: string | null
          user_id: number
        }
        Update: {
          course_id?: number
          created_at?: string | null
          id?: number
          status?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      password_resets: {
        Row: {
          created_at: string | null
          expires_at: string
          id: number
          token: string
          used: boolean | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: number
          token: string
          used?: boolean | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: number
          token?: string
          used?: boolean | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "password_resets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: number
          preferences: Json | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: number
          preferences?: Json | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: number
          preferences?: Json | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: number
          last_activity: string | null
          session_token: string
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: number
          last_activity?: string | null
          session_token: string
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: number
          last_activity?: string | null
          session_token?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          id: number
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          id?: number
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_permissions: {
        Args: { user_auth_id: string }
        Returns: string[]
      }
      has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "student" | "instructor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific types for each table
export type Client = Tables<'clients'>
export type User = Tables<'users'>
export type Course = Tables<'courses'>
export type Enrollment = Tables<'enrollments'>

// Insert types
export type ClientInsert = TablesInsert<'clients'>
export type UserInsert = TablesInsert<'users'>
export type CourseInsert = TablesInsert<'courses'>
export type EnrollmentInsert = TablesInsert<'enrollments'>

// Update types
export type ClientUpdate = TablesUpdate<'clients'>
export type UserUpdate = TablesUpdate<'users'>
export type CourseUpdate = TablesUpdate<'courses'>
export type EnrollmentUpdate = TablesUpdate<'enrollments'> 