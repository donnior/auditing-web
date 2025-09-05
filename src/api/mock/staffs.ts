import type { Staff } from '../types'

// 模拟员工数据
export const mockStaffs: Staff[] = [
  {
    id: '1',
    name: '张三',
    qwAccountId: 'zhangsan001',
    autoGenerateReport: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: '李四',
    qwAccountId: 'lisi002',
    autoGenerateReport: false,
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z'
  },
  {
    id: '3',
    name: '王五',
    qwAccountId: 'wangwu003',
    autoGenerateReport: true,
    createdAt: '2024-01-17T10:15:00Z',
    updatedAt: '2024-01-17T10:15:00Z'
  },
  {
    id: '4',
    name: '赵六',
    qwAccountId: 'zhaoliu004',
    autoGenerateReport: false,
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '5',
    name: '钱七',
    qwAccountId: 'qianqi005',
    autoGenerateReport: true,
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  }
]

// 获取所有员工
export const getStaffs = async (): Promise<Staff[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockStaffs
}

// 新增员工
export const createStaff = async (staffData: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>): Promise<Staff> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const newStaff: Staff = {
    ...staffData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  mockStaffs.push(newStaff)
  return newStaff
}

// 更新员工
export const updateStaff = async (id: string, staffData: Partial<Omit<Staff, 'id' | 'createdAt'>>): Promise<Staff> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const index = mockStaffs.findIndex(staff => staff.id === id)
  if (index === -1) {
    throw new Error('员工不存在')
  }

  const updatedStaff: Staff = {
    ...mockStaffs[index],
    ...staffData,
    updatedAt: new Date().toISOString()
  }

  mockStaffs[index] = updatedStaff
  return updatedStaff
}

// 删除员工
export const deleteStaff = async (id: string): Promise<void> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const index = mockStaffs.findIndex(staff => staff.id === id)
  if (index === -1) {
    throw new Error('员工不存在')
  }

  mockStaffs.splice(index, 1)
}
