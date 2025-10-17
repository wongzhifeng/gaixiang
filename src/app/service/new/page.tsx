'use client'

import { useState } from 'react'
import { ArrowLeft, Clock, MapPin, Users, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import BottomNavigation from '../../../components/layout/BottomNavigation'
import { useAuth } from '../../../contexts/AuthContext'
import LoginPrompt from '../../../components/auth/LoginPrompt'

const serviceTypes = [
  { value: 'repair', label: '维修服务', description: '家电、水管、电路等维修' },
  { value: 'care', label: '照看服务', description: '照顾老人、孩子、宠物等' },
  { value: 'shopping', label: '代购服务', description: '帮忙购买生活用品、药品等' },
  { value: 'moving', label: '搬运服务', description: '搬运家具、重物等' },
  { value: 'teaching', label: '教学服务', description: '作业辅导、技能教学等' },
  { value: 'general', label: '一般服务', description: '其他类型的帮助服务' }
]

export default function NewServicePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general' as string,
    location: '',
    availableFrom: '08:00',
    availableTo: '18:00',
    tags: ''
  })
  const [showHelp, setShowHelp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, user, token } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !user || !token) {
      setError('请先登录后再发布服务')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []

      // 创建今天的日期用于时间字段
      const today = new Date().toISOString().split('T')[0]
      const availableFrom = new Date(`${today}T${formData.availableFrom}:00`)
      const availableTo = new Date(`${today}T${formData.availableTo}:00`)

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type.toUpperCase(),
          locationText: formData.location,
          tags: tagsArray,
          category: formData.type,
          availableFrom: availableFrom.toISOString(),
          availableTo: availableTo.toISOString()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '发布服务失败')
      }

      // 成功发布后的跳转
      alert('服务发布成功！')
      window.location.href = '/mutual-aid'
    } catch (error) {
      console.error('发布服务失败:', error)
      setError(error instanceof Error ? error.message : '发布服务失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 - 响应式 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="responsive-container py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="/" className="p-1 sm:p-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">发布提供服务</h1>
          </div>
        </div>
      </div>

      {/* 主内容区 - 响应式 */}
      <main className="responsive-container py-4 sm:py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 服务标题 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              服务标题 *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="例如：电器维修服务"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base sm:text-lg"
              required
            />
          </div>

          {/* 服务描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              详细描述 *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="请详细描述您能提供的服务，包括您的专业技能、经验等..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base sm:text-lg resize-none"
              required
            />
          </div>

          {/* 服务类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              服务类型 *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {serviceTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.type === type.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-gray-900 text-sm sm:text-base">{type.label}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 服务时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              服务时间 *
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="flex-1 w-full">
                <label htmlFor="availableFrom" className="block text-sm text-gray-600 mb-1">
                  开始时间
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="time"
                    id="availableFrom"
                    value={formData.availableFrom}
                    onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base sm:text-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex-1 w-full">
                <label htmlFor="availableTo" className="block text-sm text-gray-600 mb-1">
                  结束时间
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="time"
                    id="availableTo"
                    value={formData.availableTo}
                    onChange={(e) => handleInputChange('availableTo', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base sm:text-lg"
                    required
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              请填写您通常可以提供帮助的时间段
            </p>
          </div>

          {/* 位置信息 */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              位置信息 *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="请输入您的具体位置"
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base sm:text-lg"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              邻居需要知道您的位置来联系您
            </p>
          </div>

          {/* 标签 */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              技能标签（可选）
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="例如：电器维修、专业、家电"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base sm:text-lg"
            />
            <p className="text-sm text-gray-500 mt-1">
              用逗号分隔多个标签，展示您的专业技能
            </p>
          </div>

          {/* 错误显示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* 提交按钮 - 响应式 */}
          <div className="sticky bottom-4 bg-white p-3 sm:p-4 rounded-lg shadow-lg border border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 sm:py-4 px-6 rounded-lg text-base sm:text-lg font-semibold transition-colors"
            >
              {isSubmitting ? '发布中...' : '发布提供服务'}
            </button>
          </div>
        </form>
      </main>

      {/* 使用提示 - 响应式 */}
      <div className="fixed bottom-20 left-2 right-2 sm:left-4 sm:right-4 bg-blue-50 border border-blue-200 rounded-lg text-xs sm:text-sm text-blue-800">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-blue-100 transition-colors rounded-lg"
        >
          <h4 className="font-semibold">发布服务使用提示</h4>
          {showHelp ? (
            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </button>

        {showHelp && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <ul className="space-y-1">
              <li>• 详细描述您的专业技能和服务经验</li>
              <li>• 准确填写服务时间，方便邻居联系</li>
              <li>• 填写具体位置，邻居需要知道您的位置</li>
              <li>• 添加技能标签，展示您的专业领域</li>
              {!isAuthenticated && (
                <li>• 请先登录以发布提供服务</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <BottomNavigation />

      {/* 未登录提示 */}
      {!isAuthenticated && (
        <LoginPrompt message="请先登录以发布提供服务" />
      )}
    </div>
  )
}