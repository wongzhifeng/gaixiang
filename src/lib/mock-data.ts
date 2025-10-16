export const mockUsers = [
  { id: 'u1', name: '张阿姨', location: '西湖区', trustLevel: 80, online: true },
  { id: 'u2', name: '李叔叔', location: '江干区', trustLevel: 65, online: false }
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
export type MockDemand = { id: string; title: string; userId?: string };
export type MockService = { id: string; title: string; userId?: string };

export const mockDemands: MockDemand[] = [
  { id: 'd1', title: '帮忙买药', userId: 'u2' },
  { id: 'd2', title: '修理门锁', userId: 'u1' }
];

export const mockServices: MockService[] = [
  { id: 's1', title: '家电维修', userId: 'u1' },
  { id: 's2', title: '跑腿代购', userId: 'u2' }
];

export function getUserDemands(userId: string): MockDemand[] {
  return mockDemands.filter(d => d.userId === userId);
}

export function getUserServices(userId: string): MockService[] {
  return mockServices.filter(s => s.userId === userId);
}
