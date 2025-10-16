export type MockUser = {
  id: string;
  name: string;
  location: string;
  trustLevel: number;
  online: boolean;
  helpCount: number;
  receiveCount: number;
  skills: string[];
}

export const mockUsers: MockUser[] = [
  {
    id: 'u1',
    name: '张阿姨',
    location: '西湖区',
    trustLevel: 80,
    online: true,
    helpCount: 12,
    receiveCount: 5,
    skills: ['家电维修', '烹饪', '照看老人']
  },
  {
    id: 'u2',
    name: '李叔叔',
    location: '江干区',
    trustLevel: 65,
    online: false,
    helpCount: 8,
    receiveCount: 3,
    skills: ['跑腿代购', '搬运', '修理']
  }
];

export function getUserById(id: string) {
  return mockUsers.find(u => u.id === id) || null;
}

export function getDemandById(id: string) {
  return { id, title: '帮忙买药', status: 'ACTIVE' } as any;
}

export function getServiceById(id: string) {
  return { id, title: '家电维修', status: 'ACTIVE' } as any;
}

// 追加用于页面的模拟数据与导出
export type MockDemand = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: string;
  urgency: number;
  location: string;
  createdAt: string;
  status: string;
  userId?: string
};
export type MockService = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: string;
  location: string;
  createdAt: string;
  status: string;
  availableFrom?: string;
  availableTo?: string;
  userId?: string
};

export const mockDemands: MockDemand[] = [
  {
    id: 'd1',
    title: '帮忙买药',
    description: '需要帮忙去药店买降压药，老人行动不便',
    tags: ['买药', '老人', '紧急'],
    type: 'emergency',
    urgency: 4,
    location: '西湖区',
    createdAt: '2025-01-12T10:00:00Z',
    status: 'active',
    userId: 'u2'
  },
  {
    id: 'd2',
    title: '修理门锁',
    description: '家里的门锁坏了，需要帮忙修理',
    tags: ['修理', '门锁', '家庭'],
    type: 'repair',
    urgency: 3,
    location: '江干区',
    createdAt: '2025-01-12T09:30:00Z',
    status: 'completed',
    userId: 'u1'
  }
];

export const mockServices: MockService[] = [
  {
    id: 's1',
    title: '家电维修',
    description: '提供家电维修服务，经验丰富',
    tags: ['维修', '家电', '专业'],
    type: 'repair',
    location: '西湖区',
    createdAt: '2025-01-12T08:00:00Z',
    status: 'active',
    availableFrom: '2025-01-12T09:00:00Z',
    availableTo: '2025-01-12T18:00:00Z',
    userId: 'u1'
  },
  {
    id: 's2',
    title: '跑腿代购',
    description: '提供跑腿代购服务，快速可靠',
    tags: ['跑腿', '代购', '快速'],
    type: 'shopping',
    location: '江干区',
    createdAt: '2025-01-12T07:30:00Z',
    status: 'paused',
    availableFrom: '2025-01-12T08:00:00Z',
    availableTo: '2025-01-12T20:00:00Z',
    userId: 'u2'
  }
];

export function getUserDemands(userId: string): MockDemand[] {
  return mockDemands.filter(d => d.userId === userId);
}

export function getUserServices(userId: string): MockService[] {
  return mockServices.filter(s => s.userId === userId);
}
