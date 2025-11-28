import axios from 'axios'
import type { PageResponse } from '../common/types'

// import { getStaffs, createStaff, updateStaff, deleteStaff } from './mock/staffs'

// 导出API函数
// export { getStaffs, createStaff, updateStaff, deleteStaff }


export const getStaffs = async (): Promise<PageResponse<Staff>> => {
  const response = await axios.get('/xcauditing/api/qwaccounts')
  return response.data
}

export const createStaff = async (staffData: CreateStaffData): Promise<Staff> => {
  const response = await axios.post('/api/staffs', staffData)
  return response.data
}

export const updateStaff = async (id: string, staffData: UpdateStaffData): Promise<Staff> => {
  const response = await axios.put(`/api/staffs/${id}`, staffData)
  return response.data
}

export const deleteStaff = async (id: string): Promise<void> => {
  await axios.delete(`/api/staffs/${id}`)
}

// 员工API类型
export type CreateStaffData = Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateStaffData = Partial<Omit<Staff, 'id' | 'createdAt'>>
// 员工类型定义
export interface Staff {
  id: string
  name: string
  qwid: string
  auto_analyze: boolean
  create_time: string
  update_time: string
}
