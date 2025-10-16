'use client'

import { useState, useEffect } from 'react'
import { Star, MapPin, Users, TrendingUp } from 'lucide-react'
import { MockUser, mockUsers, mockDemands, mockServices } from '../lib/mock-data'
import {
  getHighTrustRecommendations,
  getPersonalizedRecommendations,
  MatchResult
} from '../lib/intelligent-matching'

interface RecommendationSystemProps {
  currentUser?: MockUser
}

export default function RecommendationSystem({ currentUser }: RecommendationSystemProps) {
  const [activeTab, setActiveTab] = useState<'highTrust' | 'personalized'>('highTrust')
  const [highTrustUsers, setHighTrustUsers] = useState<MockUser[]>([])
  const [personalizedMatches, setPersonalizedMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const highTrust = getHighTrustRecommendations(mockUsers)
      setHighTrustUsers(highTrust)

      if (currentUser) {
        const personalized = getPersonalizedRecommendations(
          currentUser,
          mockUsers,
          mockDemands,
          mockServices
        )
        setPersonalizedMatches(personalized)
      }

      setLoading(false)
    }, 500)
  }, [currentUser])

  const getTrustLevelColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 标题和标签 */}
      <div className="border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              智能推荐
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('highTrust')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'highTrust'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                高信任用户
              </button>
              <button
                onClick={() => setActiveTab('personalized')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'personalized'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                个性化匹配
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {activeTab === 'highTrust' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>基于纳瓦尔信任评分系统推荐的优质用户</span>
            </div>

            {highTrustUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>暂无高信任用户推荐</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {highTrustUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                    {/* 用户头像 */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>

                    {/* 用户信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrustLevelColor(user.trustLevel)}`}>
                          信任 {user.trustLevel}分
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {user.location}
                        </span>
                        <span>帮助 {user.helpCount} 次</span>
                        <span>接受 {user.receiveCount} 次</span>
                      </div>

                      {/* 技能标签 */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {user.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{user.skills.length - 3}更多
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex-shrink-0">
                      <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                        联系
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span>基于您的需求和位置智能匹配的推荐</span>
            </div>

            {!currentUser ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>请先登录以获取个性化推荐</p>
              </div>
            ) : personalizedMatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>暂无个性化推荐</p>
                <p className="text-sm mt-1">尝试发布需求或服务来获取匹配</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {personalizedMatches.map(match => (
                  <div key={match.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {match.user.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {match.type === 'demand' ? '可以帮您解决' : '需要您的帮助'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getMatchScoreColor(match.matchScore)}`}>
                          {match.matchScore}分
                        </div>
                        <div className="text-xs text-gray-500">匹配度</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-700">
                        <strong>需求：</strong>
                        {match.item.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {match.explanation}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>信任 {match.trustScore}分</span>
                        <span>距离 {match.distanceScore}分</span>
                        <span>技能 {match.tagMatchScore}分</span>
                        {match.urgencyScore > 0 && (
                          <span>紧急 {match.urgencyScore}分</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                        联系TA
                      </button>
                      <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                        详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}