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
