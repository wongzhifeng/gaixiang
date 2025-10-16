'use client'

import { useState } from 'react'
import { ArrowLeft, AlertCircle, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { mockUsers } from '../../../lib/mock-data'

// 模拟当前用户（后期替换为真实认证）
const currentUser = mockUsers[0]

const demandTypes = [
  { value: 'emergency', label: '紧急求助', description: '需要立即帮助的紧急情况' },
  { value: 'repair', label: '维修服务', description: '家电、水管、电路等维修' },
  { value: 'care', label: '照看服务', description: '照顾老人、孩子、宠物等' },
  { value: 'shopping', label: '代购服务', description: '帮忙购买生活用品、药品等' },
  { value: 'moving', label: '搬运服务', description: '搬运家具、重物等' },
  { value: 'learning', label: '学习辅导', description: '作业辅导、技能学习等' },
  { value: 'general', label: '一般需求', description: '其他类型的帮助需求' }
]

const urgencyLevels = [
  { value: 1, label: '不急', description: '可以等待几天' },
  { value: 2, label: '较急', description: '希望今天内解决' },
  { value: 3, label: '紧急', description: '需要尽快解决' },
  { value: 4, label: '很紧急', description: '需要立即关注' },
  { value: 5, label: '非常紧急', description: '需要立即帮助' }
]

export default function NewDemandPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general' as string,
    urgency: 3 as number,
    location: currentUser.location,
    tags: ''
  })
  const [showHelp, setShowHelp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 模拟发布需求（后期替换为真实API调用）
    console.log('发布需求:', formData)

    // 模拟成功发布后的跳转
    alert('需求发布成功！')
    window.location.href = '/mutual-aid'
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="p-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </a>
            <h1 className="text-2xl font-bold text-gray-900">发布求助需求</h1>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 需求标题 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              需求标题 *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="例如：水管漏水急需维修"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              required
            />
          </div>

          {/* 需求描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              详细描述 *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="请详细描述您的需求，这样邻居们能更好地帮助您..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg resize-none"
              required
            />
          </div>

          {/* 需求类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              需求类型 *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {demandTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.type === type.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 紧急程度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              紧急程度 *
            </label>
            <div className="space-y-2">
              {urgencyLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleInputChange('urgency', level.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors flex items-center gap-3 ${
                    formData.urgency === level.value
                      ? level.value >= 4
                        ? 'border-red-600 bg-red-50'
                        : level.value >= 3
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    level.value >= 4
                      ? 'bg-red-600 text-white'
                      : level.value >= 3
                      ? 'bg-orange-600 text-white'
                      : 'bg-primary-600 text-white'
                  }`}>
                    {level.value}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 位置信息 */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              位置信息 *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="请输入您的具体位置"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              为了邻居能准确找到您，请填写具体位置（如：幸福小区3栋302）
            </p>
          </div>

          {/* 标签 */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              标签（可选）
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="例如：水管维修、紧急、厨房"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
            />
            <p className="text-sm text-gray-500 mt-1">
              用逗号分隔多个标签，帮助系统更好地匹配
            </p>
          </div>

          {/* 提交按钮 */}
          <div className="sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
            >
              发布求助需求
            </button>
          </div>
        </form>
      </main>

      {/* 使用提示 - 可折叠 */}
      <div className="fixed bottom-20 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full p-4 flex items-center justify-between hover:bg-blue-100 transition-colors rounded-lg"
        >
          <h4 className="font-semibold">发布需求使用提示</h4>
          {showHelp ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showHelp && (
          <div className="px-4 pb-4">
            <ul className="space-y-1">
              <li>• 详细描述有助于邻居更好地理解您的需求</li>
              <li>• 准确选择紧急程度，紧急需求会优先显示</li>
              <li>• 填写具体位置，方便邻居找到您</li>
              <li>• 添加相关标签，提高匹配准确度</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}