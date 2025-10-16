'use client'

import { useState } from 'react'
import { Search, Filter, Heart, Users, Clock, MapPin } from 'lucide-react'
import { mockDemands, mockServices, getUserById, MockDemand, MockService } from '../../lib/mock-data'

type TabType = 'all' | 'demands' | 'services'

export default function MutualAidPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // 过滤数据
  const filteredData = (activeTab === 'all'
    ? [...mockDemands, ...mockServices]
    : activeTab === 'demands'
      ? mockDemands
      : mockServices
  ).filter(item => {
    if (!searchQuery) return true
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  const getUrgencyColor = (urgency: number) => {
    switch (urgency) {
      case 5: return 'bg-red-100 text-red-800'
      case 4: return 'bg-orange-100 text-orange-800'
      case 3: return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800'
      case 'repair': return 'bg-blue-100 text-blue-800'
      case 'care': return 'bg-green-100 text-green-800'
      case 'shopping': return 'bg-purple-100 text-purple-800'
      case 'moving': return 'bg-orange-100 text-orange-800'
      case 'learning': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
      {/* 顶部搜索栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索需求或服务..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* 标签栏 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['all', 'demands', 'services'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'all' && '全部'}
                {tab === 'demands' && '求助需求'}
                {tab === 'services' && '提供服务'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无相关内容</h3>
            <p className="text-gray-500">尝试调整搜索条件或查看其他分类</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((item) => {
              const user = item.userId ? getUserById(item.userId) : null
              const isDemand = 'urgency' in item

              return (
                <div key={item.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start gap-4">
                    {/* 用户头像 */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.title}
                        </h3>
                        {isDemand && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor((item as MockDemand).urgency)}`}>
                            紧急{(item as MockDemand).urgency}级
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                          {item.type === 'emergency' && '紧急求助'}
                          {item.type === 'repair' && '维修服务'}
                          {item.type === 'care' && '照看服务'}
                          {item.type === 'shopping' && '代购服务'}
                          {item.type === 'moving' && '搬运服务'}
                          {item.type === 'learning' && '学习辅导'}
                          {item.type === 'general' && '一般服务'}
                          {item.type === 'teaching' && '教学服务'}
                        </span>
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(item.createdAt)}
                          </span>
                        </div>
                        <span className="text-primary-600 font-medium">
                          {user?.name || '匿名用户'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                    <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors">
                      联系TA
                    </button>
                    {isDemand && (
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors">
                        我能帮忙
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* 使用提示 */}
      <div className="fixed bottom-20 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <h4 className="font-semibold mb-1">使用提示</h4>
        <ul className="space-y-1">
          <li>• 点击"联系TA"开始与邻居沟通</li>
          <li>• 紧急需求会显示红色标签</li>
          <li>• 可以根据类型筛选查看</li>
        </ul>
      </div>
    </div>
  )
}