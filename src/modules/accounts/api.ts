import axios from 'axios'
import type { PageResponse } from '../common/types'

// 账户类型常量
export const ACCOUNT_TYPE = {
  ADMIN: 1,
  EMPLOYEE: 2,
} as const

export const ACCOUNT_TYPE_NAMES: Record<number, string> = {
  [ACCOUNT_TYPE.ADMIN]: '管理员',
  [ACCOUNT_TYPE.EMPLOYEE]: '普通员工',
}

// 账户状态常量
export const ACCOUNT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const

export const ACCOUNT_STATUS_NAMES: Record<number, string> = {
  [ACCOUNT_STATUS.ACTIVE]: '启用',
  [ACCOUNT_STATUS.INACTIVE]: '禁用',
}

// 账户类型定义
export interface AccountUser {
  id: string
  username: string
  account_type: number
  status: number
  create_time: string
  update_time: string
}

// 创建账户请求
export interface CreateAccountData {
  username: string
  password: string
  account_type?: number
}

// 更新账户请求
export interface UpdateAccountData {
  username?: string
  password?: string
  account_type?: number
  status?: number
}

// 重置密码请求
export interface ResetPasswordData {
  new_password: string
}

/**
 * 获取账户列表
 */
export const getAccounts = async (): Promise<PageResponse<AccountUser>> => {
  const response = await axios.get('/auditing-api/account-users')
  return response.data
}

/**
 * 获取账户详情
 */
export const getAccount = async (id: string): Promise<AccountUser> => {
  const response = await axios.get(`/auditing-api/account-users/${id}`)
  return response.data
}

/**
 * 创建账户
 */
export const createAccount = async (data: CreateAccountData): Promise<AccountUser> => {
  const response = await axios.post('/auditing-api/account-users', data)
  return response.data
}

/**
 * 更新账户
 */
export const updateAccount = async (id: string, data: UpdateAccountData): Promise<AccountUser> => {
  const response = await axios.put(`/auditing-api/account-users/${id}`, data)
  return response.data
}

/**
 * 删除账户
 */
export const deleteAccount = async (id: string): Promise<void> => {
  await axios.delete(`/auditing-api/account-users/${id}`)
}

/**
 * 重置密码
 */
export const resetPassword = async (id: string, newPassword: string): Promise<AccountUser> => {
  const response = await axios.put(`/auditing-api/account-users/${id}/reset-password`, {
    new_password: newPassword
  })
  return response.data
}
