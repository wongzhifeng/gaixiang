'use client'

import { useAuth } from '../../contexts/AuthContext'
import AuthPage from './AuthPage'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  // 如果正在加载认证状态，显示加载界面
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果未认证，显示认证页面
  if (!isAuthenticated) {
    return <AuthPage />
  }

  // 如果已认证，显示子组件
  return <>{children}</>
}