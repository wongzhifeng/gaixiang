'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  locationText?: string
  skills?: string
  trustLevel: number
  helpCount: number
  receiveCount: number
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  successMessage: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: User) => void
  clearSuccessMessage: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    successMessage: null
  })

  // 从本地存储恢复认证状态
  useEffect(() => {
    const token = localStorage.getItem('gaixiang_token')
    const userStr = localStorage.getItem('gaixiang_user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          successMessage: authState.successMessage
        })
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('gaixiang_token')
        localStorage.removeItem('gaixiang_user')
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // 用户登录
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))

      const response = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const { user, token } = data.data

        // 保存到本地存储
        localStorage.setItem('gaixiang_token', token)
        localStorage.setItem('gaixiang_user', JSON.stringify(user))

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          successMessage: '登录成功！'
        })

        return true
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return false
      }
    } catch (error) {
      console.error('登录失败:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  // 用户注册
  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))

      const response = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      })

      const data = await response.json()

      if (data.success) {
        const { user, token } = data.data

        // 保存到本地存储
        localStorage.setItem('gaixiang_token', token)
        localStorage.setItem('gaixiang_user', JSON.stringify(user))

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          successMessage: '注册成功！'
        })

        return true
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return false
      }
    } catch (error) {
      console.error('注册失败:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  // 用户登出
  const logout = () => {
    localStorage.removeItem('gaixiang_token')
    localStorage.removeItem('gaixiang_user')
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      successMessage: null
    })
  }

  // 更新用户信息
  const updateUser = (user: User) => {
    setAuthState(prev => ({
      ...prev,
      user
    }))
    localStorage.setItem('gaixiang_user', JSON.stringify(user))
  }

  // 清除成功消息
  const clearSuccessMessage = () => {
    setAuthState(prev => ({
      ...prev,
      successMessage: null
    }))
  }

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    clearSuccessMessage
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
    throw new Error('useAuth必须在AuthProvider内使用')
  }
  return context
}