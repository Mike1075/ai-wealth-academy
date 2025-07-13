import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, userService, type User } from './supabase'
import type { User as AuthUser, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: AuthUser | null
  userProfile: User | null
  session: Session | null
  loading: boolean
  permissions: string[]
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData?: { name?: string, phone?: string }) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  hasPermission: (permission: string) => boolean
  isAdmin: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState<string[]>([])

  // 刷新用户资料
  const refreshProfile = async () => {
    if (!user?.id) return

    try {
      const { data: profile } = await userService.getUserProfile(user.id)
      if (profile) {
        setUserProfile(profile)
      }

      const { data: userPermissions } = await userService.getUserPermissions(user.id)
      if (userPermissions) {
        setPermissions(userPermissions)
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
    }
  }

  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { session } = await auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await refreshProfile()
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // 监听认证状态变化
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await refreshProfile()
      } else {
        setUserProfile(null)
        setPermissions([])
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 登录
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await auth.signIn(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const signUp = async (email: string, password: string, userData?: { name?: string, phone?: string }) => {
    setLoading(true)
    try {
      const result = await auth.signUp(email, password, userData)
      return result
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const signOut = async () => {
    setLoading(true)
    try {
      const result = await auth.signOut()
      return result
    } finally {
      setLoading(false)
    }
  }

  // 检查权限
  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  // 检查是否为管理员
  const isAdmin = userProfile?.role === 'admin' || hasPermission('system_admin')

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    permissions,
    signIn,
    signUp,
    signOut,
    hasPermission,
    isAdmin,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 权限检查组件
export function ProtectedRoute({ 
  children, 
  permission, 
  adminOnly = false,
  fallback 
}: { 
  children: React.ReactNode
  permission?: string
  adminOnly?: boolean
  fallback?: React.ReactNode
}) {
  const { user, hasPermission, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">需要登录</h2>
          <p className="text-gray-600 mb-6">请先登录以访问此页面</p>
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往登录
          </a>
        </div>
      </div>
    )
  }

  if (adminOnly && !isAdmin) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">权限不足</h2>
          <p className="text-gray-600">您没有访问此页面的权限</p>
        </div>
      </div>
    )
  }

  if (permission && !hasPermission(permission)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">权限不足</h2>
          <p className="text-gray-600">您没有访问此页面的权限</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 