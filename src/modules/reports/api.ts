import type { PageResponse } from '../common/types'
import axios from 'axios'

export const getWeeklyReportSummaryById = async (id: string): Promise<WeeklyReportSummary | undefined> => {
  const response = await axios.get(`/auditing-api/weekly-report-summaries/${id}`)
  return response.data
}

export const getReports = async (staffName?: string, employeeId?: string, evalPeriod?: string, evalType?: string): Promise<PageResponse<WeeklyReportSummary>> => {
  const response = await axios.get('/auditing-api/weekly-report-summaries', {
    params: {
      staffName: staffName || '',
      page_size: 100,
      employeeId: employeeId || '',
      evalPeriod: evalPeriod || '',
      evalType: evalType || ''
    }
  })
  return response.data
}

export const getWeeklyReportSummaryDetails = async (id: string, metric: string): Promise<PageResponse<EvaluationDetail>> => {
  const response = await axios.get(`/auditing-api/weekly-report-summaries/${id}/details`, {
    params: {
      metric,
      page_size: 200
    }
  })
  return response.data
}

export const getCustomerReportsByAccountId = async (qwAccountId: string, cycleStartTime: string, cycleEndTime: string): Promise<PageResponse<CustomerReport>> => {
  const response = await axios.get('/xcauditing/api/employee-customer-reports', {
    params: {
      qwid: qwAccountId,
      start_date: cycleStartTime,
      end_date: cycleEndTime
    }
  })
  return response.data
}

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

export interface WeeklyReportSummary {
  id: string
  employee_id: string
  employee_name: string
  employee_qw_id: string
  generating_status?: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  eval_time: string
  eval_period: string
  eval_type: string
  total_customers: number
  has_introduce_course_ratio: number
  full_completed1_ratio: number
  total_introduce_course: number
  total_introduce_teacher: number
  total_introduce_schedule: number
  total_introduce_course_time: number
  total_order_check: number
  total_introduce_completed: number
  total_material_send: number
  total_course_remind: number
  total_homework_publish: number
  total_feedback_track: number
  total_week_material_send: number
  total_sunday_link_send: number
  total_risk_word_trigger: number
}

export interface EvaluationDetail {
  id: string
  employee_id: string
  employee_qw_id: string
  customer_id: string
  customer_name: string
  eval_time: string
  eval_period: string
  eval_type: string
  has_introduce_teacher: number
  has_introduce_course: number
  has_introduce_schedule: number
  has_introduce_course_time: number
  has_order_check: number
  has_material_send: number
  has_course_remind: number
  has_homework_publish: number
  has_feedback_track: number
  has_week_material_send: number
  has_sunday_link_send: number
  has_risk_word_trigger: number
  chat_start_time: string
  chat_end_time: string
  biz_date: string
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
