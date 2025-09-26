import type { Report, CustomerReport } from '../types'

export const mockReports: Report[] = [
  {
    id: '1',
    qw_account_id: 'QW001',
    qw_account_name: '张三',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '本月客服工作表现良好，客户满意度维持在较高水平。处理了大量客户咨询，平均响应时间控制在合理范围内。需要在处理复杂问题时提高效率，并加强对新产品知识的学习。',
    total_customers: 156,
    total_messages: 2340,
    avg_response_time: 2.5,
    overall_satisfaction: 4.3,
    total_violations: 3,
    service_quality_score: 8.7,
    performance_rating: '优秀',
    improvement_suggestions: '建议加强产品知识培训，提高复杂问题处理速度；优化标准化回复模板，提升工作效率；加强情绪管理培训，更好地处理投诉客户。',
    generation_status: 'completed',
    create_time: '2024-02-01T10:00:00Z',
    update_time: '2024-02-01T10:00:00Z'
  },
  {
    id: '2',
    qw_account_id: 'QW002',
    qw_account_name: '李四',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '本日工作稳定，客户沟通积极主动。在处理订单相关问题上表现突出，获得多次客户好评。但在技术问题解答方面还需加强，建议多学习相关知识。',
    total_customers: 134,
    total_messages: 1980,
    avg_response_time: 3.2,
    overall_satisfaction: 4.1,
    total_violations: 5,
    service_quality_score: 8.2,
    performance_rating: '良好',
    improvement_suggestions: '建议加强技术类问题的学习和培训；优化沟通技巧，减少客户等待时间；建立个人知识库，提高问题解决效率。',
    generation_status: 'generating',
    create_time: '2024-02-01T11:00:00Z',
    update_time: '2024-02-01T11:00:00Z'
  },
  {
    id: '3',
    qw_account_id: 'QW003',
    qw_account_name: '王五',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '新员工表现积极，学习能力强。虽然经验不足，但态度认真负责。在简单问题处理上已经能够独立完成，复杂问题还需要指导。',
    total_customers: 89,
    total_messages: 1250,
    avg_response_time: 4.1,
    overall_satisfaction: 3.8,
    total_violations: 8,
    service_quality_score: 7.5,
    performance_rating: '合格',
    improvement_suggestions: '继续加强业务培训，提高专业技能；建立导师制，加强一对一指导；多参与团队分享，学习优秀经验；提高工作效率和准确性。',
    generation_status: 'completed',
    create_time: '2024-02-01T12:00:00Z',
    update_time: '2024-02-01T12:00:00Z'
  },
  {
    id: '4',
    qw_account_id: 'QW004',
    qw_account_name: '赵六',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '报告生成过程中遇到了技术问题，数据分析失败。',
    total_customers: 0,
    total_messages: 0,
    avg_response_time: 0,
    overall_satisfaction: 0,
    total_violations: 0,
    service_quality_score: 0,
    performance_rating: '无法评定',
    improvement_suggestions: '请联系技术支持重新生成报告。',
    generation_status: 'failed',
    create_time: '2024-02-01T13:00:00Z',
    update_time: '2024-02-01T13:00:00Z'
  }
]

export const getReportById = async (id: string): Promise<Report | undefined> => {
  // 模拟网络延时
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockReports.find(report => report.id === id)
}

// 获取所有报告，支持按员工姓名过滤
export const getReports = async (staffName?: string): Promise<Report[]> => {
  // 模拟网络延时
  await new Promise(resolve => setTimeout(resolve, 300))

  if (staffName) {
    return mockReports.filter(report => report.qw_account_name === staffName)
  }

  return mockReports
}

// 客户报告Mock数据
export const mockCustomerReports: CustomerReport[] = [
  {
    id: 'cr-1',
    qw_account_id: 'QW001',
    qw_account_name: '张三',
    customer_id: 'CUST001',
    customer_name: '小明的家长',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '本月为该家长提供了优质的学习指导服务，及时解决了孩子学习中的问题。家长对响应速度和解决方案都表示满意。',
    message_count: 45,
    response_time_avg: 2.1,
    satisfaction_score: 4.5,
    violation_count: 0,
    service_quality_score: 9.2,
    create_time: '2024-02-01T10:00:00Z'
  },
  {
    id: 'cr-2',
    qw_account_id: 'QW001',
    qw_account_name: '张三',
    customer_id: 'CUST002',
    customer_name: '小红的家长',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '为家长处理了课程咨询、学习进度跟踪等日常问题。沟通顺畅，但在复杂教学方法解释上还有提升空间。',
    message_count: 78,
    response_time_avg: 2.8,
    satisfaction_score: 4.2,
    violation_count: 1,
    service_quality_score: 8.5,
    create_time: '2024-02-01T10:05:00Z'
  },
  {
    id: 'cr-3',
    qw_account_id: 'QW001',
    qw_account_name: '张三',
    customer_id: 'CUST003',
    customer_name: '小强的家长',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '主要协助家长进行孩子学习习惯培养和问题解答。家长对专业程度认可度高，但希望能进一步缩短响应时间。',
    message_count: 32,
    response_time_avg: 3.2,
    satisfaction_score: 4.0,
    violation_count: 0,
    service_quality_score: 8.8,
    create_time: '2024-02-01T10:10:00Z'
  },
  {
    id: 'cr-4',
    qw_account_id: 'QW001',
    qw_account_name: '张三',
    customer_id: 'CUST004',
    customer_name: '小花的家长',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '处理了该家长的投诉问题，通过耐心沟通最终达成满意解决方案。体现了良好的家校关系维护能力。',
    message_count: 23,
    response_time_avg: 1.9,
    satisfaction_score: 4.8,
    violation_count: 0,
    service_quality_score: 9.5,
    create_time: '2024-02-01T10:15:00Z'
  },
  {
    id: 'cr-5',
    qw_account_id: 'QW001',
    qw_account_name: '张三',
    customer_id: 'CUST005',
    customer_name: '小李的家长',
    cycle_start_time: '2024-01-01T00:00:00Z',
    cycle_end_time: '2024-01-31T23:59:59Z',
    report_summary: '为新家长提供课程介绍和学习指导服务。家长对服务态度满意，但对教学细节的掌握还需加强。',
    message_count: 56,
    response_time_avg: 2.4,
    satisfaction_score: 4.1,
    violation_count: 2,
    service_quality_score: 8.0,
    create_time: '2024-02-01T10:20:00Z'
  }
]

export const getCustomerReportsByAccountId = (qwAccountId: string): CustomerReport[] => {
  return mockCustomerReports.filter(report => report.qw_account_id === qwAccountId)
}
