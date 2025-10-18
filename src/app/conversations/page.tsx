'use client'

import { useState } from 'react'
import { Search, MessageCircle, MapPin, Heart, Users, ChevronDown, ChevronUp } from 'lucide-react'
import BottomNavigation from '../../components/layout/BottomNavigation'
import { useAuth } from '../../contexts/AuthContext'
import LoginPrompt from '../../components/auth/LoginPrompt'

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索栏 - 响应式 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="responsive-container py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="搜索对话..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base sm:text-lg"
              />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">我的对话</h1>
        </div>
      </div>

      {/* 主内容区 - 响应式 */}
      <main className="responsive-container py-4 sm:py-6">
        <div className="text-center py-8 sm:py-12">
          <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">对话功能开发中</h3>
          <p className="text-gray-500 text-sm">我们正在开发对话功能，请稍后查看</p>
        </div>
      </main>

      {/* 使用提示 - 响应式 */}
      <div className="fixed bottom-20 left-2 right-2 sm:left-4 sm:right-4 bg-blue-50 border border-blue-200 rounded-lg text-xs sm:text-sm text-blue-800">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-blue-100 transition-colors rounded-lg"
        >
          <h4 className="font-semibold">对话功能使用提示</h4>
          {showHelp ? (
            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </button>

        {showHelp && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <ul className="space-y-1">
              <li>• 对话功能正在开发中</li>
              <li>• 您可以在互助广场联系邻居</li>
              <li>• 发送3条消息后建立基本信任</li>
              {!isAuthenticated && (
                <li>• 请先登录以查看和参与对话</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <BottomNavigation />

      {/* 未登录提示 */}
      {!isAuthenticated && (
        <LoginPrompt message="请先登录以查看和参与对话" />
      )}
    </div>
  )
}