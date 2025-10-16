'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Shield, Clock, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TrustScoreData {
  overallScore: number
  responsibility: number
  consistency: number
  safetyNet: number
  transactionCount: number
  completedCount: number
  disputeCount: number
  avgResponseTime?: number
  onTimeRate?: number
}

interface UserData {
  id: string
  name: string
  helpCount: number
  receiveCount: number
}

interface TrustMetrics {
  completionRate: number
  disputeRate: number
  responseScore: number
}

export default function TrustProfilePage() {
  const router = useRouter()
  const [trustData, setTrustData] = useState<{
    trustScore: TrustScoreData
    user: UserData
    metrics: TrustMetrics
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrustData = async () => {
      try {
        setLoading(true)
        // 这里应该获取当前登录用户的ID
        // 暂时使用测试用户ID
        const testUserId = 'cmgtgrwgc0000sh4as3e1qlmv'
        const response = await fetch(`/api/trust-scores?userId=${testUserId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch trust data')
        }
        const data = await response.json()
        setTrustData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTrustData()
  }, [])

  const getTrustLevel = (score: number) => {
    if (score >= 80) return { level: '卓越', color: 'text-green-600', bgColor: 'bg-green-100', description: '高度可靠的合作伙伴' }
    if (score >= 60) return { level: '优秀', color: 'text-blue-600', bgColor: 'bg-blue-100', description: '值得信赖的社区成员' }
    if (score >= 40) return { level: '良好', color: 'text-yellow-600', bgColor: 'bg-yellow-100', description: '可靠的社区参与者' }
    if (score >= 20) return { level: '基础', color: 'text-orange-600', bgColor: 'bg-orange-100', description: '正在建立信任的新成员' }
    return { level: '初始', color: 'text-gray-600', bgColor: 'bg-gray-100', description: '新加入的社区成员' }
  }

  const getImprovementSuggestions = (trustScore: TrustScoreData) => {
    const suggestions = []

    if (trustScore.responsibility < 60) {
      suggestions.push({
        title: '提升责任评分',
        description: '提高交易完成率和响应速度',
        actions: ['及时响应需求', '确保交易完成', '减少纠纷发生']
      })
    }

    if (trustScore.consistency < 60) {
      suggestions.push({
        title: '提升一致性评分',
        description: '保持稳定的服务质量和准时率',
        actions: ['按时完成服务', '保持行为稳定性', '平衡帮助与接受帮助']
      })
    }

    if (trustScore.safetyNet < 40) {
      suggestions.push({
        title: '提升兜底能力',
        description: '增加专长认证和成功案例',
        actions: ['认证更多专长', '积累成功案例', '展示独特优势']
      })
    }

    return suggestions
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !trustData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">信任详情</h1>
            <p className="text-gray-500">加载失败: {error || '数据为空'}</p>
          </div>
        </div>
      </div>
    )
  }

  const { trustScore, user, metrics } = trustData
  const trustLevel = getTrustLevel(trustScore.overallScore)
  const suggestions = getImprovementSuggestions(trustScore)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">信任详情</h1>
              <p className="text-sm text-gray-500">{user.name} 的信任评分分析</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 信任评分概览 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">信任评分概览</h2>
              <p className="text-gray-500">基于纳瓦尔信任公式计算</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${trustLevel.bgColor}`}>
              <span className={`font-semibold ${trustLevel.color}`}>
                {trustLevel.level}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 综合评分 */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {trustScore.overallScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">综合评分</div>
            </div>

            {/* 责任评分 */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {trustScore.responsibility.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">责任评分</div>
            </div>

            {/* 一致性评分 */}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {trustScore.consistency.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">一致性评分</div>
            </div>

            {/* 兜底能力 */}
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {trustScore.safetyNet.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">兜底能力</div>
            </div>
          </div>

          {/* 信任公式 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              信任评分 = 责任 × 一致性² × 兜底能力
            </p>
          </div>
        </div>

        {/* 详细指标 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 交易统计 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              交易统计
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">总交易次数</span>
                <span className="font-semibold">{trustScore.transactionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">完成交易</span>
                <span className="font-semibold text-green-600">{trustScore.completedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">纠纷次数</span>
                <span className="font-semibold text-red-600">{trustScore.disputeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">完成率</span>
                <span className="font-semibold">{(metrics.completionRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* 响应指标 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              响应指标
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">平均响应时间</span>
                <span className="font-semibold">{trustScore.avgResponseTime || 12}小时</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">准时率</span>
                <span className="font-semibold">{((trustScore.onTimeRate || 0.85) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">响应评分</span>
                <span className="font-semibold">{(metrics.responseScore * 100).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">纠纷率</span>
                <span className="font-semibold">{(metrics.disputeRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 提升建议 */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              信任提升建议
            </h3>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {suggestion.actions.map((action, actionIndex) => (
                      <li key={actionIndex}>• {action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 信任等级说明 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            信任等级说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-700">卓越</div>
              <div className="text-green-600">≥80分</div>
              <div className="text-xs text-green-500 mt-1">高度可靠</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-700">优秀</div>
              <div className="text-blue-600">60-79分</div>
              <div className="text-xs text-blue-500 mt-1">值得信赖</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="font-semibold text-yellow-700">良好</div>
              <div className="text-yellow-600">40-59分</div>
              <div className="text-xs text-yellow-500 mt-1">可靠参与</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-semibold text-orange-700">基础</div>
              <div className="text-orange-600">20-39分</div>
              <div className="text-xs text-orange-500 mt-1">建立信任</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-700">初始</div>
              <div className="text-gray-600">＜20分</div>
              <div className="text-xs text-gray-500 mt-1">新成员</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}