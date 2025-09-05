import type { Staff } from './types'
import { getStaffs, createStaff, updateStaff, deleteStaff } from './mock/staffs'

// 导出API函数
export { getStaffs, createStaff, updateStaff, deleteStaff }

// 员工API类型
export type CreateStaffData = Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateStaffData = Partial<Omit<Staff, 'id' | 'createdAt'>>
