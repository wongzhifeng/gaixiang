'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Users, Settings, AlertCircle, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthGuard from '../components/auth/AuthGuard'

function HomeContent() {
  const [showHelp, setShowHelp] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pb-20">
      {/* 顶部导航 - 响应式 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="responsive-container py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-600">街巷</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              {user && (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* 移动端只显示用户名，桌面端显示完整信息 */}
                  <span className="hidden sm:inline text-sm text-gray-600">欢迎，{user.name}</span>
                  <span className="sm:hidden text-sm text-gray-600">{user.name}</span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">登出</span>
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="emergency-btn flex items-center gap-1 sm:gap-2"
                aria-label="一键求救"
              >
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">一键求救</span>
                <span className="sm:hidden">求救</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 - 响应式 */}
      <main className="responsive-container py-6 sm:py-8">
        {/* 欢迎区域 - 响应式字体大小 */}
        <section className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            好汉三个帮
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
            邻里互助，温暖社区
          </p>
        </section>

        {/* 快速操作区域 - 响应式网格 */}
        <section className="mobile-grid mb-8 sm:mb-12">
          <a href="/demand/new" className="card hover:shadow-lg transition-shadow duration-200 text-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary-200 transition-colors">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">我需要</h3>
            <p className="text-gray-600 text-xs sm:text-sm">发布求助需求</p>
          </a>

          <a href="/service/new" className="card hover:shadow-lg transition-shadow duration-200 text-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-200 transition-colors">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">我能提供</h3>
            <p className="text-gray-600 text-xs sm:text-sm">分享技能服务</p>
          </a>
        </section>

        {/* 功能入口 - 响应式 */}
        <section className="space-y-3 sm:space-y-4">
          <a href="/mutual-aid" className="block w-full card hover:shadow-lg transition-shadow duration-200 text-left flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">街巷互助广场</h3>
              <p className="text-gray-600 text-xs sm:text-sm">浏览社区内的所有互助信息</p>
            </div>
          </a>

          <a href="/profile" className="block w-full card hover:shadow-lg transition-shadow duration-200 text-left flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">我的街巷互助</h3>
              <p className="text-gray-600 text-xs sm:text-sm">管理自己发布的需求和服务</p>
            </div>
          </a>
        </section>

        {/* 使用提示 - 响应式 */}
        {showHelp && (
          <div className="mt-6 sm:mt-8 card bg-blue-50 border-blue-200">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">使用帮助</h4>
            <ul className="text-blue-800 space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>• 点击"我需要"发布求助需求</li>
              <li>• 点击"我能提供"分享您的技能</li>
              <li>• 在互助广场浏览邻居们的需求</li>
              <li>• 一键求救按钮用于紧急情况</li>
            </ul>
          </div>
        )}
      </main>

      {/* 底部导航栏 */}
      <nav className="bottom-nav">
        <a href="/" className="nav-item active">
          <Heart className="w-6 h-6 mb-1" />
          <span>首页</span>
        </a>
        <a href="/mutual-aid" className="nav-item inactive">
          <MessageCircle className="w-6 h-6 mb-1" />
          <span>互助</span>
        </a>
        <a href="/conversations" className="nav-item inactive">
          <Users className="w-6 h-6 mb-1" />
          <span>对话</span>
        </a>
        <a href="/profile" className="nav-item inactive">
          <Users className="w-6 h-6 mb-1" />
          <span>我的</span>
        </a>
      </nav>
    </div>
  )
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  )
}