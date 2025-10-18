'use client'

import { useState } from 'react'
import { Crown, Star, Users, Heart, TrendingUp, Award, Share2, Download } from 'lucide-react'
import { User } from '../lib/types'

interface ReputationCardProps {
  user: User
  showActions?: boolean
  compact?: boolean
}

interface ReputationMetric {
  label: string
  value: number | string
  icon: React.ReactNode
  description: string
}

export default function ReputationCard({ user, showActions = true, compact = false }: ReputationCardProps) {
  const [isSharing, setIsSharing] = useState(false)

  const getTrustLevel = (score: number) => {
    if (score >= 80) return { level: '卓越', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60) return { level: '优秀', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 40) return { level: '良好', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (score >= 20) return { level: '基础', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { level: '初始', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }

  const trustLevel = getTrustLevel(user.trustLevel)

  const reputationMetrics: ReputationMetric[] = [
    {
      label: '信任评分',
      value: user.trustLevel,
      icon: <Star className="w-4 h-4" />,
      description: '基于纳瓦尔信任公式的综合评分'
    },
    {
      label: '帮助次数',
      value: user.helpCount,
      icon: <Heart className="w-4 h-4" />,
      description: '成功帮助他人的次数'
    },
    {
      label: '接受帮助',
      value: user.receiveCount,
      icon: <Users className="w-4 h-4" />,
      description: '接受他人帮助的次数'
    },
    {
      label: '在线状态',
      value: user.onlineStatus ? '在线' : '离线',
      icon: <TrendingUp className="w-4 h-4" />,
      description: '当前活跃状态'
    }
  ]

  const handleShare = async () => {
    setIsSharing(true)
    // 模拟分享功能
    setTimeout(() => {
      setIsSharing(false)
      alert('信誉名片已复制到剪贴板')
    }, 1000)
  }

  const handleDownload = () => {
    // 模拟下载功能
    alert('信誉名片已保存为图片')
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {/* 用户头像 */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>

          {/* 基本信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${trustLevel.color} ${trustLevel.bgColor}`}>
                {trustLevel.level}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {user.locationText || '位置未设置'}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>信任 {user.trustLevel}分</span>
              <span>帮助 {user.helpCount}次</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 顶部装饰 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2"></div>

      {/* 内容区域 */}
      <div className="p-6">
        {/* 用户信息和信任等级 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* 用户头像 */}
            <div className="relative">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              {user.trustLevel >= 80 && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* 用户信息 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user.name}
              </h2>
              <p className="text-gray-600 mb-2">
                {user.locationText || '位置未设置'} · 社区互助成员
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${trustLevel.color} ${trustLevel.bgColor}`}>
                  {trustLevel.level}信任等级
                </span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  综合评分 {user.trustLevel}/100
                </span>
              </div>
            </div>
          </div>

          {/* 徽章区域 */}
          <div className="flex gap-2">
            {user.trustLevel >= 60 && (
              <div className="text-center">
                <Award className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <span className="text-xs text-gray-600">优秀</span>
              </div>
            )}
            {user.helpCount >= 10 && (
              <div className="text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <span className="text-xs text-gray-600">热心</span>
              </div>
            )}
          </div>
        </div>

        {/* 信誉指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {reputationMetrics.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-primary-600">
                  {metric.icon}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {metric.value}
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {metric.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* 技能标签 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">擅长领域</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <span key={index} className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">暂无技能标签</span>
            )}
          </div>
        </div>

        {/* 纳瓦尔信任理念 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            纳瓦尔信任理念
          </h4>
          <p className="text-sm text-blue-700">
            信任 = 责任 × 一致性² × 兜底能力。您的信任评分反映了在社区互助中的可靠性和价值创造能力。
          </p>
        </div>

        {/* 行动按钮 */}
        {showActions && (
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {isSharing ? '分享中...' : '分享名片'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              保存图片
            </button>
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>生成时间: {new Date().toLocaleDateString('zh-CN')}</span>
          <span>gaixiang.app · 信任社区</span>
        </div>
      </div>
    </div>
  )
}