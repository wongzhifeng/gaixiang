'use client'

import { useState, useEffect } from 'react'

interface TrustScoreData {
  overallScore: number
  responsibility: number
  consistency: number
  safetyNet: number
}

interface TrustScoreCardProps {
  userId: string
  className?: string
}

export default function TrustScoreCard({ userId, className = '' }: TrustScoreCardProps) {
  const [trustScore, setTrustScore] = useState<TrustScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrustScore = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/trust-scores?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch trust score')
        }
        const data = await response.json()
        setTrustScore(data.trustScore)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTrustScore()
  }, [userId])

  const getTrustLevel = (score: number) => {
    if (score >= 80) return { level: '卓越', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60) return { level: '优秀', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 40) return { level: '良好', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (score >= 20) return { level: '基础', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { level: '初始', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    if (score >= 20) return 'text-orange-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        <div className="text-center text-gray-500">
          <p>信任评分加载失败</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!trustScore) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        <div className="text-center text-gray-500">
          <p>暂无信任评分数据</p>
        </div>
      </div>
    )
  }

  const trustLevel = getTrustLevel(trustScore.overallScore)

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* 信任评分头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">信任评分</h3>
          <p className="text-sm text-gray-500">基于纳瓦尔信任公式计算</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${trustLevel.bgColor}`}>
          <span className={`text-sm font-medium ${trustLevel.color}`}>
            {trustLevel.level}
          </span>
        </div>
      </div>

      {/* 综合评分 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">综合评分</span>
          <span className={`text-2xl font-bold ${getScoreColor(trustScore.overallScore)}`}>
            {trustScore.overallScore.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              trustScore.overallScore >= 80 ? 'bg-green-500' :
              trustScore.overallScore >= 60 ? 'bg-blue-500' :
              trustScore.overallScore >= 40 ? 'bg-yellow-500' :
              trustScore.overallScore >= 20 ? 'bg-orange-500' : 'bg-gray-500'
            }`}
            style={{ width: `${Math.min(trustScore.overallScore, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 三要素评分 */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">责任评分</span>
            <span className="text-sm font-semibold text-blue-600">
              {trustScore.responsibility.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-blue-500"
              style={{ width: `${trustScore.responsibility}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">基于交易完成率和响应时间</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">一致性评分</span>
            <span className="text-sm font-semibold text-green-600">
              {trustScore.consistency.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-green-500"
              style={{ width: `${trustScore.consistency}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">基于准时率和行为稳定性</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">兜底能力</span>
            <span className="text-sm font-semibold text-purple-600">
              {trustScore.safetyNet.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-purple-500"
              style={{ width: `${trustScore.safetyNet}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">基于专长稀缺性和案例数量</p>
        </div>
      </div>

      {/* 信任公式说明 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          信任评分 = 责任 × 一致性² × 兜底能力
        </p>
      </div>
    </div>
  )
}