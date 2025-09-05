// 项目成员类型
export interface ProjectMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  joinDate: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'planning' | 'paused'
  progress: number
  startDate: string
  endDate?: string
  teamSize: number
  budget: number
  priority: 'high' | 'medium' | 'low'
  manager: string
  tags: string[]
}

export interface PaginationResponse<T> {
  items: T[]
  total: number
}

// 报告类型定义
export interface Report {
  id: string
  qwAccountId: string
  qwAccountName: string
  cycleStartTime: string
  cycleEndTime: string
  reportSummary: string
  totalCustomers: number
  totalMessages: number
  avgResponseTime: number
  overallSatisfaction: number
  totalViolations: number
  serviceQualityScore: number
  performanceRating: string
  improvementSuggestions: string
  generationStatus: 'generating' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

// 客户报告类型定义
export interface CustomerReport {
  id: string
  qwAccountId: string
  qwAccountName: string
  customerId: string
  customerName: string
  cycleStartTime: string
  cycleEndTime: string
  reportSummary: string
  messageCount: number
  responseTimeAvg: number
  satisfactionScore: number
  violationCount: number
  serviceQualityScore: number
  createTime: string
}

// 聊天消息类型定义
export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: 'staff' | 'customer'
  content: string
  messageType: 'text' | 'image' | 'file' | 'system'
  timestamp: string
  isRead: boolean
  hasViolation?: boolean
  violationType?: string
}

// 员工类型定义
export interface Staff {
  id: string
  name: string
  qwAccountId: string
  autoGenerateReport: boolean
  createdAt: string
  updatedAt: string
}

// 聊天会话类型定义
export interface ChatSession {
  id: string
  qwAccountId: string
  qwAccountName: string
  customerId: string
  customerName: string
  sessionDate: string
  startTime: string
  endTime: string
  totalMessages: number
  staffMessages: number
  customerMessages: number
  avgResponseTime: number
  hasViolations: boolean
  violationCount: number
  satisfactionScore?: number
  messages: ChatMessage[]
}
