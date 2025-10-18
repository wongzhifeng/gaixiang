'use client'

import { useState, useEffect } from 'react'
import { Star, Heart, Users, ThumbsUp, MessageSquare, Calendar, MapPin } from 'lucide-react'
import { User } from '../lib/types'
import { userApi } from '../lib/api-client'

interface SuccessCase {
  id: string
  title: string
  description: string
  helper: User
  helped: User
  category: string
  location: string
  date: string
  rating: number
  feedback: string
  tags: string[]
  images?: string[]
  trustImpact: number
}

interface SuccessCaseSystemProps {
  currentUser?: User
  cases?: SuccessCase[]
}

const mockSuccessCases: SuccessCase[] = [
  {
    id: 'case-1',
    title: '深夜紧急买药帮助',
    description: '张阿姨深夜突发高血压，李叔叔及时帮忙买药并送到家中，避免了严重后果。',
    helper: {
      id: 'u2',
      email: 'li@example.com',
      name: '李叔叔',
      locationText: '江干区',
      trustLevel: 65,
      onlineStatus: false,
      isVerified: true,
      helpCount: 8,
      receiveCount: 3,
      skills: ['跑腿代购', '搬运', '修理'],
      interests: ['健身', '社区服务'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    helped: {
      id: 'u1',
      email: 'zhang@example.com',
      name: '张阿姨',
      locationText: '西湖区',
      trustLevel: 80,
      onlineStatus: true,
      isVerified: true,
      helpCount: 12,
      receiveCount: 5,
      skills: ['家电维修', '烹饪', '照看老人'],
      interests: ['社区活动', '烹饪分享'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    category: '紧急求助',
    location: '西湖区',
    date: '2025-01-15',
    rating: 5,
    feedback: '李叔叔非常热心，深夜还愿意帮忙，真的很感动！',
    tags: ['紧急', '买药', '深夜'],
    trustImpact: 8
  },
  {
    id: 'case-2',
    title: '家电维修服务',
    description: '张阿姨帮助邻居修理故障的洗衣机，解决了燃眉之急。',
    helper: {
      id: 'u1',
      email: 'zhang@example.com',
      name: '张阿姨',
      locationText: '西湖区',
      trustLevel: 80,
      onlineStatus: true,
      isVerified: true,
      helpCount: 12,
      receiveCount: 5,
      skills: ['家电维修', '烹饪', '照看老人'],
      interests: ['社区活动', '烹饪分享'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    helped: {
      id: 'u3',
      email: 'wang@example.com',
      name: '王奶奶',
      locationText: '西湖区',
      trustLevel: 45,
      onlineStatus: false,
      isVerified: true,
      helpCount: 3,
      receiveCount: 8,
      skills: ['编织', '烹饪'],
      interests: ['传统文化', '社区教育'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    category: '维修服务',
    location: '西湖区',
    date: '2025-01-10',
    rating: 5,
    feedback: '张阿姨技术很好，很快就修好了洗衣机，还教我怎么保养。',
    tags: ['维修', '家电', '专业'],
    trustImpact: 6
  },
  {
    id: 'case-3',
    title: '代购生活用品',
    description: '李叔叔帮助行动不便的老人代购生活必需品，连续服务一周。',
    helper: {
      id: 'u2',
      email: 'li@example.com',
      name: '李叔叔',
      locationText: '江干区',
      trustLevel: 65,
      onlineStatus: false,
      isVerified: true,
      helpCount: 8,
      receiveCount: 3,
      skills: ['跑腿代购', '搬运', '修理'],
      interests: ['健身', '社区服务'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    helped: {
      id: 'u4',
      email: 'chen@example.com',
      name: '陈医生',
      locationText: '江干区',
      trustLevel: 30,
      onlineStatus: false,
      isVerified: true,
      helpCount: 1,
      receiveCount: 12,
      skills: ['医疗咨询', '急救知识'],
      interests: ['健康科普', '社区义诊'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    category: '代购服务',
    location: '江干区',
    date: '2025-01-08',
    rating: 5,
    feedback: '李叔叔很细心，每次都把东西送到家里，还帮忙检查质量。',
    tags: ['代购', '持续', '细心'],
    trustImpact: 7
  }
]

export default function SuccessCaseSystem({ currentUser, cases }: SuccessCaseSystemProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [selectedCase, setSelectedCase] = useState<SuccessCase | null>(null)
  const [successCases, setSuccessCases] = useState<SuccessCase[]>(cases || [])
  const [loading, setLoading] = useState(!cases)

  // 如果没有传入 cases，则从 API 获取数据
  useEffect(() => {
    if (!cases) {
      const fetchData = async () => {
        try {
          setLoading(true)
          // 这里可以从 API 获取真实的成功案例数据
          // 暂时使用 mock 数据，后续可以替换为真实 API 调用
          setSuccessCases(mockSuccessCases)
        } catch (error) {
          console.error('获取成功案例数据失败:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [cases])

  const categories = ['all', '紧急求助', '维修服务', '代购服务', '照看服务', '学习辅导']

  const filteredCases = activeFilter === 'all'
    ? successCases
    : successCases.filter(caseItem => caseItem.category === activeFilter)

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getTrustImpactColor = (impact: number) => {
    if (impact >= 8) return 'text-green-600 bg-green-100'
    if (impact >= 6) return 'text-blue-600 bg-blue-100'
    if (impact >= 4) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 标题和过滤器 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary-600" />
            成功案例展示
          </h2>
          <div className="text-sm text-gray-600">
            共 {successCases.length} 个案例
          </div>
        </div>

        {/* 分类过滤器 */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>
      </div>

      {/* 案例列表 */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p>暂无相关案例</p>
            <p className="text-sm mt-1">尝试选择其他分类查看</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCases.map(caseItem => (
              <div
                key={caseItem.id}
                className="border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                onClick={() => setSelectedCase(caseItem)}
              >
                <div className="p-6">
                  {/* 案例标题和评分 */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {caseItem.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {caseItem.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {caseItem.location}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrustImpactColor(caseItem.trustImpact)}`}>
                          信任 +{caseItem.trustImpact}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getRatingStars(caseItem.rating)}
                    </div>
                  </div>

                  {/* 案例描述 */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {caseItem.description}
                  </p>

                  {/* 参与用户 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {caseItem.helper.name}
                        </div>
                        <div className="text-xs text-gray-500">帮助者</div>
                      </div>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {caseItem.helped.name}
                        </div>
                        <div className="text-xs text-gray-500">受助者</div>
                      </div>
                    </div>
                  </div>

                  {/* 用户反馈 */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">用户反馈</span>
                    </div>
                    <p className="text-sm text-gray-700 italic">
                      "{caseItem.feedback}"
                    </p>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2">
                    {caseItem.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 底部互动 */}
                <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>点赞</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>评论</span>
                      </button>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 案例详情模态框 */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCase.title}
                </h3>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* 详细内容 */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">案例描述</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedCase.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">用户反馈</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 italic">
                      "{selectedCase.feedback}"
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">信任影响</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTrustImpactColor(selectedCase.trustImpact)}`}>
                      信任评分 +{selectedCase.trustImpact}
                    </span>
                    <span className="text-sm text-gray-600">
                      双方信任评分均有提升
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}