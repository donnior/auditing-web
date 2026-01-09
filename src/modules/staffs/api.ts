import axios from 'axios'
import type { PageResponse } from '../common/types'

// import { getStaffs, createStaff, updateStaff, deleteStaff } from './mock/staffs'

// 导出API函数
// export { getStaffs, createStaff, updateStaff, deleteStaff }


export const getStaffs = async (): Promise<PageResponse<Staff>> => {
  const response = await axios.get('/auditing-api/employees')
  return response.data
}

export const createStaff = async (staffData: CreateStaffData): Promise<Staff> => {
  const response = await axios.post('/auditing-api/employees', staffData)
  return response.data
}

export const updateStaff = async (id: string, staffData: UpdateStaffData): Promise<Staff> => {
  const response = await axios.put(`/auditing-api/employees/${id}`, staffData)
  return response.data
}

export const deleteStaff = async (id: string): Promise<void> => {
  await axios.delete(`/auditing-api/employees/${id}`)
}

// 员工API类型
export type CreateStaffData = Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateStaffData = Partial<Omit<Staff, 'id' | 'createdAt'>>
// 员工类型定义
export interface Staff {
  id: string
  name: string
  qw_id: string
  auto_analyze: boolean
  create_time: string
  update_time: string
}
