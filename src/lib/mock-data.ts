// 街巷项目模拟数据
// 用于快速测试完整功能，后期可删除

export interface MockUser {
  id: string
  name: string
  avatar: string
  location: string
  skills: string[]
  helpCount: number
  receiveCount: number
  trustLevel: number
  online: boolean
}

export interface MockDemand {
  id: string
  title: string
  description: string
  type: 'emergency' | 'repair' | 'care' | 'shopping' | 'moving' | 'learning' | 'general'
  urgency: 1 | 2 | 3 | 4 | 5
  location: string
  tags: string[]
  userId: string
  createdAt: string
  status: 'active' | 'pending' | 'completed' | 'cancelled'
}

export interface MockService {
  id: string
  title: string
  description: string
  type: 'repair' | 'care' | 'shopping' | 'moving' | 'teaching' | 'general'
  location: string
  tags: string[]
  userId: string
  availableFrom?: string
  availableTo?: string
  status: 'active' | 'paused' | 'completed'
}

export interface MockMatch {
  id: string
  demandId?: string
  serviceId?: string
  userId: string
  matchedUserId: string
  score: number
  reason: string
  createdAt: string
}

// 模拟用户数据
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    name: '张大爷',
    avatar: '/avatars/elderly-man.png',
    location: '幸福小区3栋',
    skills: [],
    helpCount: 2,
    receiveCount: 8,
    trustLevel: 85,
    online: true
  },
  {
    id: 'user-2',
    name: '李阿姨',
    avatar: '/avatars/elderly-woman.png',
    location: '幸福小区5栋',
    skills: ['做饭', '照顾老人'],
    helpCount: 12,
    receiveCount: 3,
    trustLevel: 92,
    online: false
  },
  {
    id: 'user-3',
    name: '小王',
    avatar: '/avatars/young-man.png',
    location: '幸福小区8栋',
    skills: ['电器维修', '电脑维修', '搬运'],
    helpCount: 25,
    receiveCount: 5,
    trustLevel: 95,
    online: true
  },
  {
    id: 'user-4',
    name: '小张',
    avatar: '/avatars/young-woman.png',
    location: '幸福小区12栋',
    skills: ['代购', '辅导作业', '照顾孩子'],
    helpCount: 18,
    receiveCount: 2,
    trustLevel: 88,
    online: true
  },
  {
    id: 'user-5',
    name: '刘师傅',
    avatar: '/avatars/middle-aged-man.png',
    location: '幸福小区15栋',
    skills: ['水管维修', '电路维修', '门窗修理'],
    helpCount: 35,
    receiveCount: 1,
    trustLevel: 98,
    online: false
  }
]

// 模拟需求数据
export const mockDemands: MockDemand[] = [
  {
    id: 'demand-1',
    title: '水管漏水急需维修',
    description: '厨房水管突然漏水，地上都是水，急需帮忙维修',
    type: 'emergency',
    urgency: 5,
    location: '幸福小区3栋302',
    tags: ['水管', '维修', '紧急'],
    userId: 'user-1',
    createdAt: '2025-01-16T10:30:00Z',
    status: 'active'
  },
  {
    id: 'demand-2',
    title: '帮忙代购生活用品',
    description: '腿脚不便，需要帮忙去超市买些米、油、蔬菜',
    type: 'shopping',
    urgency: 3,
    location: '幸福小区5栋501',
    tags: ['代购', '超市', '生活用品'],
    userId: 'user-2',
    createdAt: '2025-01-16T09:15:00Z',
    status: 'active'
  },
  {
    id: 'demand-3',
    title: '帮忙照看孩子2小时',
    description: '临时有事外出，需要帮忙照看5岁孩子2小时',
    type: 'care',
    urgency: 4,
    location: '幸福小区12栋203',
    tags: ['照顾', '孩子', '临时'],
    userId: 'user-4',
    createdAt: '2025-01-16T14:20:00Z',
    status: 'active'
  },
  {
    id: 'demand-4',
    title: '帮忙搬运家具',
    description: '新买了书桌和椅子，需要帮忙从楼下搬到3楼',
    type: 'moving',
    urgency: 2,
    location: '幸福小区8栋305',
    tags: ['搬运', '家具', '重物'],
    userId: 'user-3',
    createdAt: '2025-01-16T11:45:00Z',
    status: 'active'
  }
]

// 模拟服务数据
export const mockServices: MockService[] = [
  {
    id: 'service-1',
    title: '电器维修服务',
    description: '专业维修各种家用电器，冰箱、洗衣机、空调等',
    type: 'repair',
    location: '幸福小区15栋',
    tags: ['电器维修', '专业', '家电'],
    userId: 'user-5',
    availableFrom: '2025-01-16T08:00:00Z',
    availableTo: '2025-01-16T18:00:00Z',
    status: 'active'
  },
  {
    id: 'service-2',
    title: '代购配送服务',
    description: '可以帮忙代购生活用品、药品，并配送到家',
    type: 'shopping',
    location: '幸福小区12栋',
    tags: ['代购', '配送', '生活用品'],
    userId: 'user-4',
    availableFrom: '2025-01-16T09:00:00Z',
    availableTo: '2025-01-16T17:00:00Z',
    status: 'active'
  },
  {
    id: 'service-3',
    title: '作业辅导服务',
    description: '可以辅导小学生作业，特别是数学和语文',
    type: 'teaching',
    location: '幸福小区8栋',
    tags: ['辅导', '作业', '学习'],
    userId: 'user-3',
    availableFrom: '2025-01-16T16:00:00Z',
    availableTo: '2025-01-16T20:00:00Z',
    status: 'active'
  },
  {
    id: 'service-4',
    title: '老人照看服务',
    description: '可以帮忙照看行动不便的老人，陪聊、喂饭等',
    type: 'care',
    location: '幸福小区5栋',
    tags: ['照顾', '老人', '陪伴'],
    userId: 'user-2',
    availableFrom: '2025-01-16T08:00:00Z',
    availableTo: '2025-01-16T12:00:00Z',
    status: 'active'
  }
]

// 模拟匹配数据
export const mockMatches: MockMatch[] = [
  {
    id: 'match-1',
    demandId: 'demand-1',
    userId: 'user-1',
    matchedUserId: 'user-5',
    score: 92,
    reason: '专业维修技能，距离最近',
    createdAt: '2025-01-16T10:35:00Z'
  },
  {
    id: 'match-2',
    demandId: 'demand-2',
    userId: 'user-2',
    matchedUserId: 'user-4',
    score: 88,
    reason: '代购服务专业，信誉良好',
    createdAt: '2025-01-16T09:20:00Z'
  },
  {
    id: 'match-3',
    serviceId: 'service-3',
    userId: 'user-3',
    matchedUserId: 'user-4',
    score: 85,
    reason: '学习需求匹配辅导服务',
    createdAt: '2025-01-16T14:25:00Z'
  }
]

// 工具函数：获取用户信息
export function getUserById(userId: string): MockUser | undefined {
  return mockUsers.find(user => user.id === userId)
}

// 工具函数：获取需求信息
export function getDemandById(demandId: string): MockDemand | undefined {
  return mockDemands.find(demand => demand.id === demandId)
}

// 工具函数：获取服务信息
export function getServiceById(serviceId: string): MockService | undefined {
  return mockServices.find(service => service.id === serviceId)
}

// 工具函数：获取用户的需求
export function getUserDemands(userId: string): MockDemand[] {
  return mockDemands.filter(demand => demand.userId === userId)
}

// 工具函数：获取用户的服务
export function getUserServices(userId: string): MockService[] {
  return mockServices.filter(service => service.userId === userId)
}

// 工具函数：获取活跃的需求
export function getActiveDemands(): MockDemand[] {
  return mockDemands.filter(demand => demand.status === 'active')
}

// 工具函数：获取活跃的服务
export function getActiveServices(): MockService[] {
  return mockServices.filter(service => service.status === 'active')
}