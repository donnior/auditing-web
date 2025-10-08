import type { Report, CustomerReport } from './types'
import type { PageResponse } from './types'
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
