'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  locationText: string
  trustLevel: number
  helpCount: number
  receiveCount: number
  skills: string
  onlineStatus: boolean
  trustScore?: {
    overallScore: number
    responsibility: number
    consistency: number
    safetyNet: number
  }
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'trust'>('trust')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const getTrustLevel = (score: number) => {
    if (score >= 80) return { level: '卓越', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60) return { level: '优秀', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 40) return { level: '良好', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (score >= 20) return { level: '基础', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { level: '初始', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }

  const filteredAndSortedUsers = users
    .filter(user => {
      if (!searchQuery) return true
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.locationText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.parse(user.skills || '[]').some((skill: string) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    })
    .sort((a, b) => {
      if (sortBy === 'trust') {
        const scoreA = a.trustScore?.overallScore || 0
        const scoreB = b.trustScore?.overallScore || 0
        return scoreB - scoreA
      } else {
        return a.name.localeCompare(b.name)
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">社区成员</h1>
              <p className="text-gray-500">基于信任评分的社区用户列表</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600">{users.length} 位成员</span>
            </div>
          </div>

          {/* 搜索和排序 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索成员姓名、位置或技能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'trust')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="trust">按信任评分排序</option>
              <option value="name">按姓名排序</option>
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无相关成员</h3>
            <p className="text-gray-500">尝试调整搜索条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUsers.map((user) => {
              const trustLevel = getTrustLevel(user.trustScore?.overallScore || 0)
              const skills = JSON.parse(user.skills || '[]')

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/trust-profile`)} // 暂时跳转到信任详情页
                >
                  {/* 用户基本信息 */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.locationText}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${trustLevel.bgColor}`}>
                      <span className={`font-medium ${trustLevel.color}`}>
                        {trustLevel.level}
                      </span>
                    </div>
                  </div>

                  {/* 信任评分 */}
                  {user.trustScore && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">信任评分</span>
                        <span className="text-lg font-bold text-gray-900">
                          {user.trustScore.overallScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            user.trustScore.overallScore >= 80 ? 'bg-green-500' :
                            user.trustScore.overallScore >= 60 ? 'bg-blue-500' :
                            user.trustScore.overallScore >= 40 ? 'bg-yellow-500' :
                            user.trustScore.overallScore >= 20 ? 'bg-orange-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${Math.min(user.trustScore.overallScore, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* 技能标签 */}
                  {skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">技能标签</h4>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 3).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                            +{skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 统计信息 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        帮助 {user.helpCount} 次
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        接受 {user.receiveCount} 次
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${user.onlineStatus ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 信任评分说明 */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">信任评分说明</h3>
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
          <div className="mt-4 text-sm text-gray-500">
            <p>信任评分基于纳瓦尔信任公式计算：责任 × 一致性² × 兜底能力</p>
            <p className="mt-1">高信任评分的用户将获得社区优先推荐和特殊权益</p>
          </div>
        </div>
      </main>
    </div>
  )
}