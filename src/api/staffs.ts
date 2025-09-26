import type { Staff } from './types'
import axios from 'axios'
// import { getStaffs, createStaff, updateStaff, deleteStaff } from './mock/staffs'

// 导出API函数
// export { getStaffs, createStaff, updateStaff, deleteStaff }

interface PageResponse<T> {
  items: T[]
  total_elements: number
}

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
