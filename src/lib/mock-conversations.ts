// 对话相关模拟数据

export interface MockMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'location'
  read: boolean
}

export interface MockConversation {
  id: string
  participants: string[] // 用户ID数组
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  relatedDemandId?: string
  relatedServiceId?: string
  status: 'active' | 'completed' | 'archived'
}

// 模拟对话数据
export const mockConversations: MockConversation[] = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-5'],
    lastMessage: '好的，我马上过去看看水管问题',
    lastMessageTime: '2025-01-16T10:40:00Z',
    unreadCount: 0,
    relatedDemandId: 'demand-1',
    status: 'active'
  },
  {
    id: 'conv-2',
    participants: ['user-2', 'user-4'],
    lastMessage: '需要买什么具体的东西？',
    lastMessageTime: '2025-01-16T09:25:00Z',
    unreadCount: 1,
    relatedDemandId: 'demand-2',
    status: 'active'
  },
  {
    id: 'conv-3',
    participants: ['user-4', 'user-3'],
    lastMessage: '孩子作业辅导需要什么科目？',
    lastMessageTime: '2025-01-16T14:30:00Z',
    unreadCount: 2,
    relatedServiceId: 'service-3',
    status: 'active'
  }
]

// 模拟消息数据
export const mockMessages: MockMessage[] = [
  // 对话1：水管维修
  {
    id: 'msg-1-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: '您好，我家厨房水管漏水了，很着急',
    timestamp: '2025-01-16T10:32:00Z',
    type: 'text',
    read: true
  },
  {
    id: 'msg-1-2',
    conversationId: 'conv-1',
    senderId: 'user-5',
    content: '别着急，我马上过去看看',
    timestamp: '2025-01-16T10:35:00Z',
    type: 'text',
    read: true
  },
  {
    id: 'msg-1-3',
    conversationId: 'conv-1',
    senderId: 'user-5',
    content: '好的，我马上过去看看水管问题',
    timestamp: '2025-01-16T10:40:00Z',
    type: 'text',
    read: true
  },

  // 对话2：代购服务
  {
    id: 'msg-2-1',
    conversationId: 'conv-2',
    senderId: 'user-2',
    content: '您好，我需要帮忙买些生活用品',
    timestamp: '2025-01-16T09:16:00Z',
    type: 'text',
    read: true
  },
  {
    id: 'msg-2-2',
    conversationId: 'conv-2',
    senderId: 'user-4',
    content: '没问题，需要买什么具体的东西？',
    timestamp: '2025-01-16T09:25:00Z',
    type: 'text',
    read: false
  },

  // 对话3：作业辅导
  {
    id: 'msg-3-1',
    conversationId: 'conv-3',
    senderId: 'user-4',
    content: '听说您可以辅导作业？',
    timestamp: '2025-01-16T14:26:00Z',
    type: 'text',
    read: true
  },
  {
    id: 'msg-3-2',
    conversationId: 'conv-3',
    senderId: 'user-3',
    content: '是的，我可以辅导小学生作业',
    timestamp: '2025-01-16T14:28:00Z',
    type: 'text',
    read: true
  },
  {
    id: 'msg-3-3',
    conversationId: 'conv-3',
    senderId: 'user-3',
    content: '孩子作业辅导需要什么科目？',
    timestamp: '2025-01-16T14:30:00Z',
    type: 'text',
    read: false
  }
]

// 工具函数：获取用户的所有对话
export function getUserConversations(userId: string): MockConversation[] {
  return mockConversations.filter(conv =>
    conv.participants.includes(userId)
  )
}

// 工具函数：获取对话的详细信息
export function getConversationById(conversationId: string): MockConversation | undefined {
  return mockConversations.find(conv => conv.id === conversationId)
}

// 工具函数：获取对话的所有消息
export function getMessagesByConversation(conversationId: string): MockMessage[] {
  return mockMessages
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

// 工具函数：获取对话的另一方用户
export function getOtherParticipant(conversationId: string, currentUserId: string): string | undefined {
  const conversation = getConversationById(conversationId)
  if (!conversation) return undefined

  return conversation.participants.find(id => id !== currentUserId)
}