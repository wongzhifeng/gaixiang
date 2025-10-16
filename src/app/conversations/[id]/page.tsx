'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, MapPin, Heart, Users, Clock } from 'lucide-react'
import { getConversationById, getMessagesByConversation, getOtherParticipant } from '@/lib/mock-conversations'
import { getUserById, getDemandById, getServiceById } from '@/lib/mock-data'
import { mockUsers } from '@/lib/mock-data'

// 模拟当前用户（后期替换为真实认证）
const currentUser = mockUsers[0]

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = getConversationById(params.id)
  const messages = conversation ? getMessagesByConversation(conversation.id) : []
  const otherUserId = conversation ? getOtherParticipant(conversation.id, currentUser.id) : null
  const otherUser = otherUserId ? getUserById(otherUserId) : null

  // 获取相关需求或服务信息
  const relatedDemand = conversation?.relatedDemandId ? getDemandById(conversation.relatedDemandId) : null
  const relatedService = conversation?.relatedServiceId ? getServiceById(conversation.relatedServiceId) : null

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // 模拟发送消息（后期替换为真实API调用）
    console.log('发送消息:', newMessage)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!conversation || !otherUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">对话不存在</h2>
          <p className="text-gray-500">请返回对话列表</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/conversations" className="p-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </a>

            {/* 用户信息 */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center relative">
                <Users className="w-6 h-6 text-primary-600" />
                {otherUser.online && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-900">{otherUser.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {otherUser.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    信任度 {otherUser.trustLevel}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 相关需求/服务信息 */}
      {(relatedDemand || relatedService) && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Clock className="w-4 h-4" />
              <span>
                关于：{relatedDemand ? relatedDemand.title : relatedService?.title}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.id
            const sender = getUserById(message.senderId)

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  isOwnMessage
                    ? 'bg-primary-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}>
                  {!isOwnMessage && (
                    <div className="text-xs text-gray-500 mb-1">{sender?.name}</div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-primary-200' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                className="w-full bg-transparent border-none resize-none focus:outline-none text-sm"
                rows={1}
                style={{
                  minHeight: '24px',
                  maxHeight: '120px'
                }}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full ${
                newMessage.trim()
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* 信任进度提示 */}
          {messages.length < 6 && (
            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800">
                <span>建立信任：</span>
                <div className="flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < messages.length ? 'bg-yellow-500' : 'bg-yellow-200'
                      }`}
                    />
                  ))}
                </div>
                <span>{6 - messages.length}条消息后建立完全信任</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 使用提示 */}
      <div className="fixed bottom-20 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <h4 className="font-semibold mb-1">聊天功能使用提示</h4>
        <ul className="space-y-1">
          <li>• 发送6条消息后建立完全信任关系</li>
          <li>• 绿色圆点表示对方在线</li>
          <li>• 按Enter键快速发送消息</li>
          <li>• 顶部显示相关需求/服务信息</li>
        </ul>
      </div>
    </div>
  )
}