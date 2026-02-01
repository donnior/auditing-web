import axios from 'axios'

// 员工简要信息类型
export interface EmployeeBrief {
  id: string
  name: string
  qw_id: string
  is_leader: boolean
}

// 员工分组类型定义
export interface EmployeeGroup {
  id: string
  name: string
  description: string | null
  leader_id: string | null
  leader_name: string | null
  member_count: number
  created_at: string
  updated_at: string
  members?: EmployeeBrief[]
}

// 创建分组数据类型
export interface CreateEmployeeGroupData {
  name: string
  description?: string
  leaderId?: string
}

// 更新分组数据类型
export interface UpdateEmployeeGroupData {
  name?: string
  description?: string
  leaderId?: string
}

// 添加成员请求类型
export interface AddMembersRequest {
  employeeIds: string[]
}

/**
 * 获取所有分组列表
 */
export const getEmployeeGroups = async (): Promise<EmployeeGroup[]> => {
  const response = await axios.get('/auditing-api/employee-groups')
  return response.data
}

/**
 * 获取分组详情（包含成员列表）
 */
export const getEmployeeGroup = async (id: string): Promise<EmployeeGroup> => {
  const response = await axios.get(`/auditing-api/employee-groups/${id}`)
  return response.data
}

/**
 * 创建分组
 */
export const createEmployeeGroup = async (data: CreateEmployeeGroupData): Promise<EmployeeGroup> => {
  const response = await axios.post('/auditing-api/employee-groups', data)
  return response.data
}

/**
 * 更新分组
 */
export const updateEmployeeGroup = async (id: string, data: UpdateEmployeeGroupData): Promise<EmployeeGroup> => {
  const response = await axios.put(`/auditing-api/employee-groups/${id}`, data)
  return response.data
}

/**
 * 删除分组
 */
export const deleteEmployeeGroup = async (id: string): Promise<void> => {
  await axios.delete(`/auditing-api/employee-groups/${id}`)
}

/**
 * 添加成员到分组
 */
export const addMembersToGroup = async (groupId: string, employeeIds: string[]): Promise<EmployeeGroup> => {
  const response = await axios.post(`/auditing-api/employee-groups/${groupId}/members`, { employee_ids: employeeIds })
  return response.data
}

/**
 * 从分组移除成员
 */
export const removeMemberFromGroup = async (groupId: string, employeeId: string): Promise<void> => {
  await axios.delete(`/auditing-api/employee-groups/${groupId}/members/${employeeId}`)
}

/**
 * 设置组长
 */
export const setGroupLeader = async (groupId: string, employeeId: string): Promise<EmployeeGroup> => {
  const response = await axios.put(`/auditing-api/employee-groups/${groupId}/leader/${employeeId}`)
  return response.data
}

/**
 * 获取未分组的员工列表
 */
export const getUnassignedEmployees = async (): Promise<EmployeeBrief[]> => {
  const response = await axios.get('/auditing-api/employee-groups/unassigned-employees')
  return response.data
}
