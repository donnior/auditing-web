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

/**
 * 为员工分配登录账户
 */
export const assignAccount = async (employeeId: string, accountUserId: string): Promise<Staff> => {
  const response = await axios.put(`/auditing-api/employees/${employeeId}/account/${accountUserId}`)
  return response.data
}

/**
 * 解除员工的登录账户关联
 */
export const removeAccount = async (employeeId: string): Promise<Staff> => {
  const response = await axios.delete(`/auditing-api/employees/${employeeId}/account`)
  return response.data
}

/**
 * 获取可分配的账户列表
 */
export const getAvailableAccounts = async (): Promise<AccountBrief[]> => {
  const response = await axios.get('/auditing-api/employees/available-accounts')
  return response.data
}

// 账户简要信息
export interface AccountBrief {
  id: string
  username: string
  account_type: number
}

// 员工API类型
export type CreateStaffData = Omit<Staff, 'id' | 'createdAt' | 'updatedAt' | 'group_id' | 'group_name' | 'account_user_id' | 'account_username'>
export type UpdateStaffData = Partial<Omit<Staff, 'id' | 'createdAt' | 'group_name' | 'account_username'>>
// 员工类型定义
export interface Staff {
  id: string
  name: string
  qw_id: string
  auto_analyze: boolean
  status: number
  create_time: string
  update_time: string
  group_id: string | null
  group_name: string | null
  account_user_id: string | null
  account_username: string | null
}
