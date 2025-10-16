'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Users, MapPin, Clock, Star, TrendingUp } from 'lucide-react'

interface MatchResult {
  score: number
  reasons: string[]
  details: {
    specialization: number
    location: number
    trust: number
    time: number
    urgency: number
    history: number
  }
}

interface MatchItem {
  service?: any
  demand?: any
  match: MatchResult
}

interface MatchRecommendationsProps {
  demandId?: string
  serviceId?: string
  type: 'demand' | 'service'
  limit?: number
}

export default function MatchRecommendations({
  demandId,
  serviceId,
  type,
  limit = 5
}: MatchRecommendationsProps) {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ((type === 'demand' && demandId) || (type === 'service' && serviceId)) {
      fetchMatches()
    }
  }, [demandId, serviceId, type])

  const fetchMatches = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        type,
        limit: limit.toString()
      })

      if (type === 'demand' && demandId) {
        params.append('demandId', demandId)
      } else if (type === 'service' && serviceId) {
        params.append('serviceId', serviceId)
      }

      const response = await fetch(`/api/matches?${params}`)
      const result = await response.json()

      if (result.success) {
        setMatches(result.data.matches)
      } else {
        setError(result.message || '获取匹配推荐失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('获取匹配推荐失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getMatchLevel = (score: number) => {
    if (score >= 80) return '高度匹配'
    if (score >= 60) return '良好匹配'
    if (score >= 40) return '一般匹配'
    return '低匹配度'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <h3 className="text-lg font-semibold text-gray-900">正在寻找最佳匹配...</h3>
        </div>
        <p className="text-gray-500 text-sm">正在为您智能匹配最合适的互助对象</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={fetchMatches}
            className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            重新尝试
          </button>
        </div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">智能匹配推荐</h3>
          <p className="text-gray-500 text-sm">
            {type === 'demand'
              ? '暂无匹配的服务推荐，请稍后查看或调整需求描述'
              : '暂无匹配的需求推荐，请稍后查看或调整服务描述'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* 标题区域 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">智能匹配推荐</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {matches.length} 个推荐
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          基于专长、位置、信任度等多维度智能匹配
        </p>
      </div>

      {/* 匹配列表 */}
      <div className="divide-y divide-gray-200">
        {matches.map((item, index) => {
          const targetItem = type === 'demand' ? item.service : item.demand
          const match = item.match

          if (!targetItem) return null

          return (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {targetItem.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {targetItem.description}
                  </p>
                </div>

                {/* 匹配分数 */}
                <div className="flex-shrink-0 ml-4 text-center">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(match.score)}`}>
                    {match.score}分
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getMatchLevel(match.score)}
                  </div>
                </div>
              </div>

              {/* 匹配原因 */}
              {match.reasons.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {match.reasons.map((reason, reasonIndex) => (
                    <span
                      key={reasonIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              )}

              {/* 详细信息 */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {targetItem.user?.name || '匿名用户'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {targetItem.locationText || targetItem.user?.locationText || '未知位置'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(targetItem.createdAt).toLocaleDateString()}
                </span>
                {targetItem.user?.trustScore && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    信任分 {targetItem.user.trustScore.overallScore}
                  </span>
                )}
              </div>

              {/* 匹配详情 */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-gray-700">专长</div>
                  <div className="text-gray-500">{match.details.specialization}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700">位置</div>
                  <div className="text-gray-500">{match.details.location}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700">信任</div>
                  <div className="text-gray-500">{match.details.trust}%</div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
                  联系TA
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-3 rounded text-sm font-medium transition-colors">
                  查看详情
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 底部提示 */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp className="w-3 h-3" />
          <span>匹配算法基于专长、位置、信任度等多维度计算</span>
        </div>
      </div>
    </div>
  )
}