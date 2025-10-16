'use client'

import { useState } from 'react'
import { Crown, Shield, Zap, Star, Gift, Users } from 'lucide-react'

interface TrustLevel {
  level: string
  minScore: number
  maxScore: number
  color: string
  bgColor: string
  benefits: Benefit[]
}

interface Benefit {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  active: boolean
}

const trustLevels: TrustLevel[] = [
  {
    level: '初始',
    minScore: 0,
    maxScore: 19,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    benefits: [
      {
        id: 'basic-access',
        title: '基础功能访问',
        description: '可以发布需求和提供服务',
        icon: <Users className="w-5 h-5" />,
        active: true
      }
    ]
  },
  {
    level: '基础',
    minScore: 20,
    maxScore: 39,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    benefits: [
      {
        id: 'priority-show',
        title: '优先展示',
        description: '在搜索结果中获得优先展示',
        icon: <Zap className="w-5 h-5" />,
        active: true
      },
      {
        id: 'basic-badge',
        title: '基础徽章',
        description: '获得基础信任徽章',
        icon: <Shield className="w-5 h-5" />,
        active: true
      }
    ]
  },
  {
    level: '良好',
    minScore: 40,
    maxScore: 59,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    benefits: [
      {
        id: 'smart-matching',
        title: '智能匹配',
        description: '获得智能匹配算法的优先推荐',
        icon: <Star className="w-5 h-5" />,
        active: true
      },
      {
        id: 'response-boost',
        title: '响应加速',
        description: '需求响应速度提升50%',
        icon: <Zap className="w-5 h-5" />,
        active: true
      },
      {
        id: 'profile-featured',
        title: '个人资料推荐',
        description: '在推荐用户列表中展示',
        icon: <Users className="w-5 h-5" />,
        active: true
      }
    ]
  },
  {
    level: '优秀',
    minScore: 60,
    maxScore: 79,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    benefits: [
      {
        id: 'premium-badge',
        title: '优秀徽章',
        description: '获得优秀信任徽章',
        icon: <Shield className="w-5 h-5" />,
        active: true
      },
      {
        id: 'priority-support',
        title: '优先客服',
        description: '获得优先客服支持',
        icon: <Users className="w-5 h-5" />,
        active: true
      },
      {
        id: 'trust-boost',
        title: '信任加速',
        description: '信任评分增长速度提升30%',
        icon: <Zap className="w-5 h-5" />,
        active: true
      },
      {
        id: 'exclusive-offers',
        title: '专属优惠',
        description: '获得平台专属优惠和活动',
        icon: <Gift className="w-5 h-5" />,
        active: true
      }
    ]
  },
  {
    level: '卓越',
    minScore: 80,
    maxScore: 100,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    benefits: [
      {
        id: 'elite-badge',
        title: '卓越徽章',
        description: '获得最高级别的卓越信任徽章',
        icon: <Crown className="w-5 h-5" />,
        active: true
      },
      {
        id: 'top-priority',
        title: '最高优先级',
        description: '在所有匹配中获得最高优先级',
        icon: <Zap className="w-5 h-5" />,
        active: true
      },
      {
        id: 'mentor-status',
        title: '导师身份',
        description: '成为社区导师，帮助其他用户',
        icon: <Users className="w-5 h-5" />,
        active: true
      },
      {
        id: 'revenue-share',
        title: '收益分成',
        description: '参与平台收益分成计划',
        icon: <Gift className="w-5 h-5" />,
        active: true
      },
      {
        id: 'featured-spotlight',
        title: '首页推荐',
        description: '在平台首页获得特别推荐',
        icon: <Star className="w-5 h-5" />,
        active: true
      }
    ]
  }
]

interface TrustBenefitsSystemProps {
  currentScore: number
}

export default function TrustBenefitsSystem({ currentScore }: TrustBenefitsSystemProps) {
  const [activeLevel, setActiveLevel] = useState<number>(
    trustLevels.findIndex(level => currentScore >= level.minScore && currentScore <= level.maxScore)
  )

  const currentLevel = trustLevels[activeLevel]
  const nextLevel = activeLevel < trustLevels.length - 1 ? trustLevels[activeLevel + 1] : null

  const getProgressToNextLevel = () => {
    if (!nextLevel) return 100
    const progress = ((currentScore - currentLevel.minScore) / (nextLevel.minScore - currentLevel.minScore)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 标题 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary-600" />
          信任等级与权益
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          基于纳瓦尔信任评分系统的等级权益体系
        </p>
      </div>

      {/* 当前等级和进度 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentLevel.color} ${currentLevel.bgColor}`}>
                {currentLevel.level}等级
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {currentScore}分
              </span>
            </div>
            <p className="text-sm text-gray-600">
              当前信任评分：{currentScore}/100
            </p>
          </div>

          {nextLevel && (
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">
                距离{nextLevel.level}等级
              </div>
              <div className="text-lg font-semibold text-primary-600">
                {nextLevel.minScore - currentScore}分
              </div>
            </div>
          )}
        </div>

        {nextLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{currentLevel.level}</span>
              <span>{nextLevel.level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressToNextLevel()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* 等级选择器 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {trustLevels.map((level, index) => (
            <button
              key={level.level}
              onClick={() => setActiveLevel(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeLevel === index
                  ? `${level.bgColor} ${level.color} border-2 border-current`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {level.level}
            </button>
          ))}
        </div>
      </div>

      {/* 权益列表 */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentLevel.level}等级权益
        </h3>

        <div className="grid gap-4">
          {currentLevel.benefits.map(benefit => (
            <div
              key={benefit.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                benefit.active
                  ? 'border-primary-200 bg-primary-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className={`flex-shrink-0 p-2 rounded-lg ${
                benefit.active ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-500'
              }`}>
                {benefit.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">
                    {benefit.title}
                  </h4>
                  {benefit.active && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      已激活
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 下一等级预览 */}
        {nextLevel && (
          <div className="mt-8 p-4 border border-primary-200 bg-primary-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary-600" />
              <h4 className="font-semibold text-primary-900">
                下一等级：{nextLevel.level}
              </h4>
            </div>
            <p className="text-sm text-primary-700 mb-3">
              达到{nextLevel.minScore}分即可解锁以下额外权益：
            </p>
            <div className="grid gap-2">
              {nextLevel.benefits.slice(0, 3).map(benefit => (
                <div key={benefit.id} className="flex items-center gap-2 text-sm text-primary-700">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>{benefit.title}</span>
                </div>
              ))}
              {nextLevel.benefits.length > 3 && (
                <div className="text-sm text-primary-600">
                  还有{nextLevel.benefits.length - 3}项权益等待解锁
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}