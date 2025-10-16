'use client'

import { useState } from 'react'
import { Search, MessageCircle, Clock, MapPin, Heart, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { getUserConversations, getOtherParticipant } from '../../lib/mock-conversations'
import { getUserById } from '../../lib/mock-data'
import { mockUsers } from '../../lib/mock-data'
import BottomNavigation from '../../components/layout/BottomNavigation'
import { useAuth } from '../../contexts/AuthContext'
import LoginPrompt from '../../components/auth/LoginPrompt'

// 模拟当前用户（后期替换为真实认证）
const currentUser = mockUsers[0]

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const userConversations = getUserConversations(currentUser.id)
  const { isAuthenticated } = useAuth()

  // 过滤对话
  const filteredConversations = userConversations.filter(conv => {
    if (!searchQuery) return true

    const otherUserId = getOtherParticipant(conv.id, currentUser.id)
    const otherUser = otherUserId ? getUserById(otherUserId) : null

    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}分钟前`
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
    } else {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
    }
  }

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
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">暂无对话</h3>
            <p className="text-gray-500 text-sm">在互助广场联系邻居开始对话吧</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredConversations.map((conversation) => {
              const otherUserId = getOtherParticipant(conversation.id, currentUser.id)
              const otherUser = otherUserId ? getUserById(otherUserId) : null

              return (
                <a
                  key={conversation.id}
                  href={`/conversations/${conversation.id}`}
                  className="block card hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* 用户头像 - 响应式大小 */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary-100 rounded-full flex items-center justify-center relative">
                        <Users className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600" />
                        {otherUser?.online && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                    </div>

                    {/* 对话内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 sm:mb-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {otherUser?.name || '未知用户'}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>

                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-2 line-clamp-2">
                        {conversation.lastMessage}
                      </p>

                      {/* 底部信息 - 响应式布局 */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            {otherUser?.location || '未知位置'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                            信任度 {otherUser?.trustLevel || 0}%
                          </span>
                        </div>

                        {conversation.unreadCount > 0 && (
                          <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
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
              <li>• 点击对话卡片查看详细聊天记录</li>
              <li>• 绿色圆点表示用户在线</li>
              <li>• 数字徽章显示未读消息数量</li>
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