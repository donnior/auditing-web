import type { PageResponse } from '../common/types'
import axios from 'axios'

export const getReportById = async (id: string): Promise<Report | undefined> => {
  const response = await axios.get(`/xcauditing/api/employee-analysis-report/${id}`)
  return response.data
}

export const getReports = async (staffName?: string): Promise<PageResponse<Report>> => {
  const response = await axios.get('/xcauditing/api/employee-analysis-report', {
    params: {
      staffName: staffName || ''
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
