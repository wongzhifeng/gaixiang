type Conversation = {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  relatedDemandId?: string;
  relatedServiceId?: string;
};

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
};

const conversations: Conversation[] = [
  {
    id: 'c1',
    participantIds: ['u1', 'u2'],
    lastMessage: '好的，我下午三点到您家看看。',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    unreadCount: 1,
    relatedServiceId: 's1'
  }
];

const messages: Message[] = [
  { id: 'm1', conversationId: 'c1', senderId: 'u2', content: '我家洗衣机坏了', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'm2', conversationId: 'c1', senderId: 'u1', content: '好的，我下午三点到您家看看。', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString() }
];

export function getUserConversations(userId: string): Conversation[] {
  return conversations.filter(c => c.participantIds.includes(userId));
}

export function getOtherParticipant(conversationId: string, currentUserId: string): string | null {
  const conv = conversations.find(c => c.id === conversationId);
  if (!conv) return null;
  return conv.participantIds.find(id => id !== currentUserId) || null;
}

export function getConversationById(id: string): Conversation | null {
  return conversations.find(c => c.id === id) || null;
}

export function getMessagesByConversation(conversationId: string): Message[] {
  return messages.filter(m => m.conversationId === conversationId);
}
