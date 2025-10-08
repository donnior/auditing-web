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
  qw_account_id: string
  qw_account_name: string
  cycle_start_time: string
  cycle_end_time: string
  report_rating: string
  report_score: number
  report_suggestions: string
  report_summary: string
  generating_status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  attributes: Record<string, any>
  create_time: string
  update_time: string
}

// 客户报告类型定义
export interface CustomerReport {
  id: string
  qw_account_id: string
  qw_account_name: string
  customer_id: string
  customer_name: string
  cycle_start_time: string
  cycle_end_time: string
  report_summary: string
  message_count: number
  response_time_avg: number
  satisfaction_score: number
  violation_count: number
  service_quality_score: number
  create_time: string
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
  qwid: string
  auto_analyze: boolean
  create_time: string
  update_time: string
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

export interface PageResponse<T> {
  items: T[]
  total_elements: number
}
