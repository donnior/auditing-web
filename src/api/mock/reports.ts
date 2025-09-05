import type { Report, CustomerReport } from '../types'

export const mockReports: Report[] = [
  {
    id: '1',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    cycleStartTime: '2024-01-01T00:00:00Z',
    cycleEndTime: '2024-01-31T23:59:59Z',
    reportSummary: '本月客服工作表现良好，客户满意度维持在较高水平。处理了大量客户咨询，平均响应时间控制在合理范围内。需要在处理复杂问题时提高效率，并加强对新产品知识的学习。',
    totalCustomers: 156,
    totalMessages: 2340,
    avgResponseTime: 2.5,
    overallSatisfaction: 4.3,
    totalViolations: 3,
    serviceQualityScore: 8.7,
    performanceRating: '优秀',
    improvementSuggestions: '建议加强产品知识培训，提高复杂问题处理速度；优化标准化回复模板，提升工作效率；加强情绪管理培训，更好地处理投诉客户。',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '2',
    qwAccountId: 'QW002',
    qwAccountName: '李四',
    cycleStartTime: '2024-01-01T00:00:00Z',
    cycleEndTime: '2024-01-31T23:59:59Z',
    reportSummary: '本日工作稳定，客户沟通积极主动。在处理订单相关问题上表现突出，获得多次客户好评。但在技术问题解答方面还需加强，建议多学习相关知识。',
    totalCustomers: 134,
    totalMessages: 1980,
    avgResponseTime: 3.2,
    overallSatisfaction: 4.1,
    totalViolations: 5,
    serviceQualityScore: 8.2,
    performanceRating: '良好',
    improvementSuggestions: '建议加强技术类问题的学习和培训；优化沟通技巧，减少客户等待时间；建立个人知识库，提高问题解决效率。',
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z'
  },
  {
    id: '3',
    qwAccountId: 'QW003',
    qwAccountName: '王五',
    cycleStartTime: '2024-01-01T00:00:00Z',
    cycleEndTime: '2024-01-31T23:59:59Z',
    reportSummary: '新员工表现积极，学习能力强。虽然经验不足，但态度认真负责。在简单问题处理上已经能够独立完成，复杂问题还需要指导。',
    totalCustomers: 89,
    totalMessages: 1250,
    avgResponseTime: 4.1,
    overallSatisfaction: 3.8,
    totalViolations: 8,
    serviceQualityScore: 7.5,
    performanceRating: '合格',
    improvementSuggestions: '继续加强业务培训，提高专业技能；建立导师制，加强一对一指导；多参与团队分享，学习优秀经验；提高工作效率和准确性。',
    createdAt: '2024-02-01T12:00:00Z',
    updatedAt: '2024-02-01T12:00:00Z'
  }
]

export const getReportById = async (id: string): Promise<Report | undefined> => {
  // 模拟网络延时
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockReports.find(report => report.id === id)
}

// 客户报告Mock数据
export const mockCustomerReports: CustomerReport[] = [
  {
    id: 'cr-1',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST001',
    customerName: '小明的家长',
    cycleStartTime: '2024-01-01T00:00:00Z',
    cycleEndTime: '2024-01-31T23:59:59Z',
    reportSummary: '本月为该家长提供了优质的学习指导服务，及时解决了孩子学习中的问题。家长对响应速度和解决方案都表示满意。',
    messageCount: 45,
    responseTimeAvg: 2.1,
    satisfactionScore: 4.5,
    violationCount: 0,
    serviceQualityScore: 9.2,
    createTime: '2024-02-01T10:00:00Z'
  },
  {
    id: 'cr-2',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST002',
    customerName: '小红的家长',
    cycleStartTime: '2024-01-01T00:00:00Z',
    cycleEndTime: '2024-01-31T23:59:59Z',
    reportSummary: '为家长处理了课程咨询、学习进度跟踪等日常问题。沟通顺畅，但在复杂教学方法解释上还有提升空间。',
    messageCount: 78,
    responseTimeAvg: 2.8,
    satisfactionScore: 4.2,
    violationCount: 1,
    serviceQualityScore: 8.5,
    createTime: '2024-02-01T10:05:00Z'
  },
  {
    id: 'cr-3',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST003',
    customerName: '小强的家长',
    cycleStartTime: '2024-01-01T00:00:00Z',
    cycleEndTime: '2024-01-31T23:59:59Z',
    reportSummary: '主要协助家长进行孩子学习习惯培养和问题解答。家长对专业程度认可度高，但希望能进一步缩短响应时间。',
    messageCount: 32,
    responseTimeAvg: 3.2,
    satisfactionScore: 4.0,
    violationCount: 0,
    serviceQualityScore: 8.8,
    createTime: '2024-02-01T10:10:00Z'
  },
  {
    id: 'cr-4',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST004',
    customerName: '小花的家长',
    cycleStartTime: '2024-01-01T00:00:00Z',
    cycleEndTime: '2024-01-31T23:59:59Z',
    reportSummary: '处理了该家长的投诉问题，通过耐心沟通最终达成满意解决方案。体现了良好的家校关系维护能力。',
    messageCount: 23,
    responseTimeAvg: 1.9,
    satisfactionScore: 4.8,
    violationCount: 0,
    serviceQualityScore: 9.5,
    createTime: '2024-02-01T10:15:00Z'
  },
  {
    id: 'cr-5',
    qwAccountId: 'QW001',
    qwAccountName: '张三',
    customerId: 'CUST005',
    customerName: '小李的家长',
    cycleStartTime: '2024-01-01T00:00:00Z',
    cycleEndTime: '2024-01-31T23:59:59Z',
    reportSummary: '为新家长提供课程介绍和学习指导服务。家长对服务态度满意，但对教学细节的掌握还需加强。',
    messageCount: 56,
    responseTimeAvg: 2.4,
    satisfactionScore: 4.1,
    violationCount: 2,
    serviceQualityScore: 8.0,
    createTime: '2024-02-01T10:20:00Z'
  }
]

export const getCustomerReportsByAccountId = (qwAccountId: string): CustomerReport[] => {
  return mockCustomerReports.filter(report => report.qwAccountId === qwAccountId)
}
