import type { ProjectMember } from '@/api/types'

// 生成随机id的函数
const generateRandomId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// 基础数据模板（不包含id）
const baseProjectMembers = [
  {
    name: '张三',
    email: 'zhangsan@example.com',
    role: '项目经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    joinDate: '2023-01-15'
  },
  {
    name: '李四',
    email: 'lisi@example.com',
    role: '前端开发',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    joinDate: '2023-02-10'
  },
  {
    name: '王五',
    email: 'wangwu@example.com',
    role: '后端开发',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    joinDate: '2023-03-05'
  },
  {
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'UI设计师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    joinDate: '2023-03-20'
  },
  {
    name: '孙七',
    email: 'sunqi@example.com',
    role: '测试工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi',
    joinDate: '2023-04-12'
  },
  {
    name: '周八',
    email: 'zhouba@example.com',
    role: '产品经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouba',
    joinDate: '2023-05-08'
  }
]

// 生成带有随机id的项目成员数据
export const getMockProjectMembers = (): ProjectMember[] => {
  return baseProjectMembers.map(member => ({
    ...member,
    id: generateRandomId()
  }))
}

// 保持原有的静态数据导出，用于向后兼容
export const mockProjectMembers: ProjectMember[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '项目经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    joinDate: '2023-01-15'
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: '前端开发',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    joinDate: '2023-02-10'
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: '后端开发',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    joinDate: '2023-03-05'
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'UI设计师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    joinDate: '2023-03-20'
  },
  {
    id: '5',
    name: '孙七',
    email: 'sunqi@example.com',
    role: '测试工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi',
    joinDate: '2023-04-12'
  },
  {
    id: '6',
    name: '周八',
    email: 'zhouba@example.com',
    role: '产品经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouba',
    joinDate: '2023-05-08'
  }
]

// 模拟网络延迟的工具函数
export const mockDelay = (min: number = 100, max: number = 500): Promise<void> => {
  const delay = min + Math.random() * (max - min)
  return new Promise(resolve => setTimeout(resolve, delay))
}
