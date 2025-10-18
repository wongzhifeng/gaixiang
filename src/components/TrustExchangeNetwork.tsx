'use client'

import { useState, useEffect } from 'react'
import { Network, Users, TrendingUp, Heart, Star, MapPin, Clock } from 'lucide-react'
import { User } from '../lib/types'

interface ExchangeConnection {
  id: string
  fromUser: User
  toUser: User
  type: 'help' | 'service' | 'knowledge'
  value: number
  timestamp: string
  description: string
  trustImpact: number
  status: 'completed' | 'active' | 'pending'
}

interface NetworkNode {
  id: string
  user: User
  x: number
  y: number
  connections: string[]
  trustLevel: number
}

interface TrustExchangeNetworkProps {
  currentUser?: User
}

// 临时虚拟用户数据 - 后续可以从 API 获取
const virtualUsers: User[] = [
  {
    id: 'u3',
    email: 'wang@example.com',
    name: '王奶奶',
    phone: '13800138003',
    avatar: undefined,
    locationText: '西湖区',
    onlineStatus: false,
    isVerified: true,
    trustLevel: 45,
    skills: ['编织', '烹饪'],
    interests: ['传统文化', '社区教育'],
    helpCount: 3,
    receiveCount: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'u4',
    email: 'liu@example.com',
    name: '刘爷爷',
    phone: '13800138004',
    avatar: undefined,
    locationText: '江干区',
    onlineStatus: false,
    isVerified: true,
    trustLevel: 30,
    skills: ['书法', '园艺'],
    interests: ['传统文化', '社区活动'],
    helpCount: 1,
    receiveCount: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'u5',
    email: 'chen@example.com',
    name: '陈阿姨',
    phone: '13800138005',
    avatar: undefined,
    locationText: '上城区',
    onlineStatus: true,
    isVerified: true,
    trustLevel: 55,
    skills: ['照看小孩', '烹饪'],
    interests: ['育儿', '美食'],
    helpCount: 6,
    receiveCount: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// 临时虚拟交换连接数据
const mockExchangeConnections: ExchangeConnection[] = [
  {
    id: 'ex-1',
    fromUser: virtualUsers[0], // 王奶奶
    toUser: virtualUsers[1], // 刘爷爷
    type: 'help',
    value: 5,
    timestamp: '2025-01-15T20:30:00Z',
    description: '深夜买药帮助',
    trustImpact: 8,
    status: 'completed'
  },
  {
    id: 'ex-2',
    fromUser: virtualUsers[1], // 刘爷爷
    toUser: virtualUsers[2], // 陈阿姨
    type: 'service',
    value: 3,
    timestamp: '2025-01-10T14:00:00Z',
    description: '家电维修服务',
    trustImpact: 6,
    status: 'completed'
  },
  {
    id: 'ex-3',
    fromUser: virtualUsers[2], // 陈阿姨
    toUser: virtualUsers[0], // 王奶奶
    type: 'help',
    value: 4,
    timestamp: '2025-01-08T09:00:00Z',
    description: '代购生活用品',
    trustImpact: 7,
    status: 'completed'
  }
]

export default function TrustExchangeNetwork({ currentUser }: TrustExchangeNetworkProps) {
  const [activeView, setActiveView] = useState<'network' | 'connections' | 'stats'>('network')
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([])
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)

  useEffect(() => {
    // 模拟网络节点数据
    const allUsers = [...virtualUsers]
    const nodes: NetworkNode[] = allUsers.map((user, index) => ({
      id: user.id,
      user,
      x: 50 + (index % 3) * 150,
      y: 50 + Math.floor(index / 3) * 120,
      connections: mockExchangeConnections
        .filter(conn => conn.fromUser.id === user.id || conn.toUser.id === user.id)
        .map(conn => conn.id),
      trustLevel: user.trustLevel
    }))
    setNetworkNodes(nodes)
  }, [])

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'help': return 'text-green-600 bg-green-100'
      case 'service': return 'text-blue-600 bg-blue-100'
      case 'knowledge': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'help': return <Heart className="w-4 h-4" />
      case 'service': return <Users className="w-4 h-4" />
      case 'knowledge': return <Star className="w-4 h-4" />
      default: return <Network className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getNodeSize = (trustLevel: number) => {
    if (trustLevel >= 70) return 'w-12 h-12'
    if (trustLevel >= 50) return 'w-10 h-10'
    return 'w-8 h-8'
  }

  const getNodeColor = (trustLevel: number) => {
    if (trustLevel >= 70) return 'bg-green-500'
    if (trustLevel >= 50) return 'bg-blue-500'
    if (trustLevel >= 30) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 标题和视图切换 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-primary-600" />
            信任价值网络
          </h2>
          <div className="text-sm text-gray-600">
            {mockExchangeConnections.length} 次价值交换
          </div>
        </div>

        {/* 视图切换 */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('network')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
              activeView === 'network'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Network className="w-4 h-4" />
            网络视图
          </button>
          <button
            onClick={() => setActiveView('connections')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
              activeView === 'connections'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            连接记录
          </button>
          <button
            onClick={() => setActiveView('stats')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
              activeView === 'stats'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            网络统计
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {activeView === 'network' && (
          <div className="space-y-6">
            {/* 网络图 */}
            <div className="relative bg-gray-50 rounded-lg border border-gray-200 h-80 overflow-hidden">
              {/* 连接线 */}
              <svg className="absolute inset-0 w-full h-full">
                {mockExchangeConnections.map(connection => {
                  const fromNode = networkNodes.find(n => n.id === connection.fromUser.id)
                  const toNode = networkNodes.find(n => n.id === connection.toUser.id)

                  if (!fromNode || !toNode) return null

                  return (
                    <line
                      key={connection.id}
                      x1={fromNode.x + 20}
                      y1={fromNode.y + 20}
                      x2={toNode.x + 20}
                      y2={toNode.y + 20}
                      stroke={connection.status === 'completed' ? '#10b981' : '#6b7280'}
                      strokeWidth="2"
                      strokeDasharray={connection.status === 'completed' ? 'none' : '5,5'}
                    />
                  )
                })}
              </svg>

              {/* 节点 */}
              <div className="relative z-10">
                {networkNodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute ${getNodeSize(node.trustLevel)} rounded-full ${getNodeColor(node.trustLevel)} flex items-center justify-center text-white font-medium cursor-pointer transform hover:scale-110 transition-transform`}
                    style={{ left: node.x, top: node.y }}
                    onClick={() => setSelectedNode(node)}
                    title={`${node.user.name} - 信任 ${node.trustLevel}分`}
                  >
                    {node.user.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>

            {/* 图例 */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>高信任用户 (70+分)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>中信任用户 (50-69分)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>基础信任用户 (30-49分)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span>初始信任用户 (0-29分)</span>
              </div>
            </div>
          </div>
        )}

        {activeView === 'connections' && (
          <div className="space-y-4">
            {mockExchangeConnections.map(connection => (
              <div key={connection.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getConnectionTypeColor(connection.type)}`}>
                      {getConnectionTypeIcon(connection.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {connection.description}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {connection.fromUser.name} → {connection.toUser.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                      {connection.status === 'completed' ? '已完成' : connection.status === 'active' ? '进行中' : '待确认'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTimeAgo(connection.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {connection.fromUser.locationText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-600 font-medium">
                      价值 {connection.value} 分
                    </span>
                    <span className="text-green-600 font-medium">
                      信任 +{connection.trustImpact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {networkNodes.length}
              </div>
              <div className="text-sm text-gray-600">网络成员</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Network className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {mockExchangeConnections.length}
              </div>
              <div className="text-sm text-gray-600">价值交换</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(networkNodes.reduce((sum, node) => sum + node.trustLevel, 0) / networkNodes.length)}
              </div>
              <div className="text-sm text-gray-600">平均信任</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {mockExchangeConnections.reduce((sum, conn) => sum + conn.trustImpact, 0)}
              </div>
              <div className="text-sm text-gray-600">信任增长</div>
            </div>
          </div>
        )}
      </div>

      {/* 节点详情模态框 */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedNode.user.name}
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`${getNodeSize(selectedNode.trustLevel)} rounded-full ${getNodeColor(selectedNode.trustLevel)} flex items-center justify-center text-white font-medium`}>
                    {selectedNode.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedNode.user.locationText}
                    </div>
                    <div className="text-sm text-gray-600">
                      信任评分: {selectedNode.trustLevel}/100
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">技能标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.user.skills?.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                        {skill}
                      </span>
                    )) || <span className="text-gray-500 text-sm">暂无技能标签</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">互助统计</h4>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>帮助: {selectedNode.user.helpCount} 次</span>
                    <span>接受: {selectedNode.user.receiveCount} 次</span>
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