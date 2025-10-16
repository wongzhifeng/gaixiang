'use client'

import { useState, useEffect } from 'react'
import { Target, CheckCircle, Clock, Award, TrendingUp } from 'lucide-react'

interface TrustScoreData {
  overallScore: number
  responsibility: number
  consistency: number
  safetyNet: number
  transactionCount: number
  completedCount: number
  disputeCount: number
}

interface TrustImprovementSuggestionsProps {
  userId: string
  className?: string
}

interface Suggestion {
  id: string
  title: string
  description: string
  actions: string[]
  priority: 'high' | 'medium' | 'low'
  targetScore: number
  currentScore: number
  category: 'responsibility' | 'consistency' | 'safetyNet'
}

export default function TrustImprovementSuggestions({
  userId,
  className = ''
}: TrustImprovementSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateSuggestions = async () => {
      try {
        setLoading(true)
        // 获取信任评分数据
        const response = await fetch(`/api/trust-scores?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch trust score')
        }
        const data = await response.json()
        const trustScore = data.trustScore

        // 基于信任评分生成建议
        const generatedSuggestions: Suggestion[] = []

        // 责任评分建议
        if (trustScore.responsibility < 60) {
          generatedSuggestions.push({
            id: 'responsibility-1',
            title: '提升交易完成率',
            description: '提高交易完成率可以显著提升责任评分',
            actions: [
              '及时确认交易完成',
              '避免无故取消交易',
              '确保服务质量'
            ],
            priority: trustScore.responsibility < 40 ? 'high' : 'medium',
            targetScore: 60,
            currentScore: trustScore.responsibility,
            category: 'responsibility'
          })
        }

        if (trustScore.responsibility < 70 && trustScore.avgResponseTime && trustScore.avgResponseTime > 24) {
          generatedSuggestions.push({
            id: 'responsibility-2',
            title: '提高响应速度',
            description: '更快的响应时间可以提升责任评分',
            actions: [
              '及时查看新消息',
              '设置响应提醒',
              '保持在线状态'
            ],
            priority: 'medium',
            targetScore: 70,
            currentScore: trustScore.responsibility,
            category: 'responsibility'
          })
        }

        // 一致性评分建议
        if (trustScore.consistency < 60) {
          generatedSuggestions.push({
            id: 'consistency-1',
            title: '保持准时服务',
            description: '按时完成服务可以提升一致性评分',
            actions: [
              '合理安排服务时间',
              '提前沟通时间变更',
              '设置时间提醒'
            ],
            priority: trustScore.consistency < 40 ? 'high' : 'medium',
            targetScore: 60,
            currentScore: trustScore.consistency,
            category: 'consistency'
          })
        }

        if (trustScore.consistency < 70) {
          generatedSuggestions.push({
            id: 'consistency-2',
            title: '平衡帮助行为',
            description: '平衡帮助他人和接受帮助可以提升一致性',
            actions: [
              '主动提供帮助',
              '适当接受他人帮助',
              '保持稳定的参与频率'
            ],
            priority: 'medium',
            targetScore: 70,
            currentScore: trustScore.consistency,
            category: 'consistency'
          })
        }

        // 兜底能力建议
        if (trustScore.safetyNet < 40) {
          generatedSuggestions.push({
            id: 'safetyNet-1',
            title: '认证更多专长',
            description: '增加专长认证可以显著提升兜底能力',
            actions: [
              '选择稀缺专长认证',
              '提供相关证明材料',
              '展示独特优势'
            ],
            priority: 'high',
            targetScore: 40,
            currentScore: trustScore.safetyNet,
            category: 'safetyNet'
          })
        }

        if (trustScore.safetyNet < 50) {
          generatedSuggestions.push({
            id: 'safetyNet-2',
            title: '积累成功案例',
            description: '成功案例是兜底能力的重要证明',
            actions: [
              '记录每次成功服务',
              '收集用户好评',
              '展示服务成果'
            ],
            priority: 'medium',
            targetScore: 50,
            currentScore: trustScore.safetyNet,
            category: 'safetyNet'
          })
        }

        // 按优先级排序
        generatedSuggestions.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        })

        setSuggestions(generatedSuggestions)
      } catch (error) {
        console.error('Error generating suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    generateSuggestions()
  }, [userId])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'responsibility': return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'consistency': return <Clock className="w-5 h-5 text-green-600" />
      case 'safetyNet': return <Award className="w-5 h-5 text-purple-600" />
      default: return <Target className="w-5 h-5 text-gray-600" />
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">信任评分优秀</h3>
          <p className="text-gray-500">您的信任评分表现良好，继续保持！</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">信任提升建议</h3>
          <p className="text-sm text-gray-500">基于您的信任评分分析</p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const progress = getProgressPercentage(suggestion.currentScore, suggestion.targetScore)

          return (
            <div
              key={suggestion.id}
              className={`border-l-4 pl-4 py-3 ${
                suggestion.category === 'responsibility' ? 'border-blue-500' :
                suggestion.category === 'consistency' ? 'border-green-500' :
                'border-purple-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(suggestion.category)}
                  <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                  {suggestion.priority === 'high' ? '高优先级' :
                   suggestion.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

              {/* 进度条 */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>当前: {suggestion.currentScore.toFixed(1)}</span>
                  <span>目标: {suggestion.targetScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      suggestion.category === 'responsibility' ? 'bg-blue-500' :
                      suggestion.category === 'consistency' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* 行动建议 */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">行动建议：</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {suggestion.actions.map((action, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {/* 总体建议 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">总体提升策略</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 优先解决高优先级建议，快速提升信任评分</li>
          <li>• 保持稳定的服务质量和响应速度</li>
          <li>• 持续积累专长认证和成功案例</li>
          <li>• 积极参与社区互助，平衡帮助与接受帮助</li>
        </ul>
      </div>
    </div>
  )
}