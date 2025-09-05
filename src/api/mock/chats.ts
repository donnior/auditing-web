import type { ChatSession, ChatMessage } from '../types'

// 模拟聊天消息数据
export const mockChatMessages: ChatMessage[] = [
  // 小明的家长聊天记录
  {
    id: 'msg-1',
    senderId: 'CUST001',
    senderName: '小明的家长',
    senderType: 'customer',
    content: '老师您好，想咨询一下孩子最近的数学学习情况',
    messageType: 'text',
    timestamp: '2024-09-01T09:00:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '您好！小明最近在数学方面表现很不错，特别是在计算题方面有明显进步。',
    messageType: 'text',
    timestamp: '2024-09-01T09:02:30Z',
    isRead: true
  },
  {
    id: 'msg-3',
    senderId: 'CUST001',
    senderName: '小明的家长',
    senderType: 'customer',
    content: '那就好，不过我发现他在应用题方面还是有些困难',
    messageType: 'text',
    timestamp: '2024-09-01T09:05:15Z',
    isRead: true
  },
  {
    id: 'msg-4',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '确实，应用题需要更多的理解和分析能力。我建议可以多做一些生活化的应用题，让孩子更容易理解题意。',
    messageType: 'text',
    timestamp: '2024-09-01T09:07:45Z',
    isRead: true
  },
  {
    id: 'msg-5',
    senderId: 'CUST001',
    senderName: '小明的家长',
    senderType: 'customer',
    content: '好的，有什么推荐的练习册吗？',
    messageType: 'text',
    timestamp: '2024-09-01T09:10:20Z',
    isRead: true
  },
  {
    id: 'msg-6',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '我推荐《小学数学应用题精练》，里面的题目设计很贴近生活，孩子容易理解。另外，也可以关注我们下周的专题课程。',
    messageType: 'text',
    timestamp: '2024-09-01T09:12:50Z',
    isRead: true
  },
  {
    id: 'msg-7',
    senderId: 'CUST001',
    senderName: '小明的家长',
    senderType: 'customer',
    content: '专题课程的时间是什么时候？',
    messageType: 'text',
    timestamp: '2024-09-01T09:15:30Z',
    isRead: true
  },
  {
    id: 'msg-8',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '下周三晚上7点到8点，主要讲解应用题的解题思路和技巧。',
    messageType: 'text',
    timestamp: '2024-09-01T09:17:10Z',
    isRead: true
  },
  {
    id: 'msg-9',
    senderId: 'CUST001',
    senderName: '小明的家长',
    senderType: 'customer',
    content: '太好了，我们一定参加。谢谢老师！',
    messageType: 'text',
    timestamp: '2024-09-01T09:20:00Z',
    isRead: true
  },
  {
    id: 'msg-10',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '不客气！如果还有其他问题随时联系我。',
    messageType: 'text',
    timestamp: '2024-09-01T09:21:30Z',
    isRead: true
  },

  // 小红的家长聊天记录
  {
    id: 'msg-11',
    senderId: 'CUST002',
    senderName: '小红的家长',
    senderType: 'customer',
    content: '老师好，小红说英语课有点跟不上，怎么办？',
    messageType: 'text',
    timestamp: '2024-09-01T14:30:00Z',
    isRead: true
  },
  {
    id: 'msg-12',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '别担心，小红的基础还是不错的。我觉得主要是词汇量需要加强。',
    messageType: 'text',
    timestamp: '2024-09-01T14:32:15Z',
    isRead: true
  },
  {
    id: 'msg-13',
    senderId: 'CUST002',
    senderName: '小红的家长',
    senderType: 'customer',
    content: '那我们应该怎么帮她提高词汇量呢？',
    messageType: 'text',
    timestamp: '2024-09-01T14:35:20Z',
    isRead: true
  },
  {
    id: 'msg-14',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '建议每天背10个新单词，同时复习前面学过的。可以用一些有趣的记忆方法。',
    messageType: 'text',
    timestamp: '2024-09-01T14:37:45Z',
    isRead: true,
    hasViolation: true,
    violationType: '建议过于简单'
  },
  {
    id: 'msg-15',
    senderId: 'CUST002',
    senderName: '小红的家长',
    senderType: 'customer',
    content: '好的，有推荐的记忆方法吗？',
    messageType: 'text',
    timestamp: '2024-09-01T14:40:10Z',
    isRead: true
  },
  {
    id: 'msg-16',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '可以试试联想记忆法和词根记忆法。比如apple可以联想苹果的形状和颜色，这样记得更牢。另外我会给小红准备一些个性化的练习材料。',
    messageType: 'text',
    timestamp: '2024-09-01T14:43:30Z',
    isRead: true
  },
  {
    id: 'msg-17',
    senderId: 'CUST002',
    senderName: '小红的家长',
    senderType: 'customer',
    content: '太谢谢了！老师真用心',
    messageType: 'text',
    timestamp: '2024-09-01T14:45:50Z',
    isRead: true
  },
  {
    id: 'msg-18',
    senderId: 'QW001',
    senderName: '张三',
    senderType: 'staff',
    content: '这是我应该做的。我们一起努力，相信小红的英语会有很大进步的！',
    messageType: 'text',
    timestamp: '2024-09-01T14:47:20Z',
    isRead: true
  }
]

// 模拟聊天会话数据
export const mockChatSessions: ChatSession[] = [
  {
    id: 'session-1',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST001',
    customerName: '小明的家长',
    sessionDate: '2024-09-01',
    startTime: '2024-09-01T09:00:00Z',
    endTime: '2024-09-01T09:21:30Z',
    totalMessages: 10,
    staffMessages: 5,
    customerMessages: 5,
    avgResponseTime: 2.1,
    hasViolations: false,
    violationCount: 0,
    satisfactionScore: 4.5,
    messages: mockChatMessages.slice(0, 10)
  },
  {
    id: 'session-2',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST002',
    customerName: '小红的家长',
    sessionDate: '2024-09-01',
    startTime: '2024-09-01T14:30:00Z',
    endTime: '2024-09-01T14:47:20Z',
    totalMessages: 8,
    staffMessages: 4,
    customerMessages: 4,
    avgResponseTime: 2.8,
    hasViolations: true,
    violationCount: 1,
    satisfactionScore: 4.2,
    messages: mockChatMessages.slice(10, 18)
  },
  {
    id: 'session-3',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST003',
    customerName: '小强的家长',
    sessionDate: '2024-09-01',
    startTime: '2024-09-01T16:00:00Z',
    endTime: '2024-09-01T16:25:00Z',
    totalMessages: 12,
    staffMessages: 6,
    customerMessages: 6,
    avgResponseTime: 3.2,
    hasViolations: false,
    violationCount: 0,
    satisfactionScore: 4.0,
    messages: [] // 这里可以添加更多消息
  },
  {
    id: 'session-4',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST004',
    customerName: '小花的家长',
    sessionDate: '2024-09-01',
    startTime: '2024-09-01T10:30:00Z',
    endTime: '2024-09-01T10:45:00Z',
    totalMessages: 6,
    staffMessages: 3,
    customerMessages: 3,
    avgResponseTime: 1.9,
    hasViolations: false,
    violationCount: 0,
    satisfactionScore: 4.8,
    messages: [] // 这里可以添加更多消息
  },
  {
    id: 'session-5',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST005',
    customerName: '小李的家长',
    sessionDate: '2024-09-01',
    startTime: '2024-09-01T15:30:00Z',
    endTime: '2024-09-01T16:00:00Z',
    totalMessages: 14,
    staffMessages: 7,
    customerMessages: 7,
    avgResponseTime: 2.4,
    hasViolations: true,
    violationCount: 2,
    satisfactionScore: 4.1,
    messages: [] // 这里可以添加更多消息
  }
]

// 根据账号ID和客户ID获取聊天会话
export const getChatSession = (qwAccountId: string, customerId: string, sessionDate?: string): ChatSession | undefined => {
  return mockChatSessions.find(session =>
    session.qwAccountId === qwAccountId &&
    session.customerId === customerId &&
    (!sessionDate || session.sessionDate === sessionDate)
  )
}

// 根据账号ID获取所有聊天会话
export const getChatSessionsByAccountId = (qwAccountId: string): ChatSession[] => {
  return mockChatSessions.filter(session => session.qwAccountId === qwAccountId)
}

// 根据会话ID获取聊天会话
export const getChatSessionById = (sessionId: string): ChatSession | undefined => {
  return mockChatSessions.find(session => session.id === sessionId)
}
