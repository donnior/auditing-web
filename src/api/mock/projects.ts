import type { Project } from '@/api/types'

export const mockProjects: Project[] = [
  {
    id: '1',
    name: '电商平台重构',
    description: '对现有电商平台进行全面重构，采用微服务架构，提升系统性能和用户体验',
    status: 'active',
    progress: 65,
    startDate: '2023-01-15',
    endDate: '2024-06-30',
    teamSize: 8,
    budget: 500000,
    priority: 'high',
    manager: '张三',
    tags: ['前端', '后端', '数据库', '微服务']
  },
  {
    id: '2',
    name: '移动端APP开发',
    description: '开发配套的移动端应用，支持iOS和Android双平台',
    status: 'active',
    progress: 45,
    startDate: '2023-03-01',
    endDate: '2024-08-15',
    teamSize: 6,
    budget: 350000,
    priority: 'high',
    manager: '李四',
    tags: ['移动端', 'React Native', 'iOS', 'Android']
  },
  {
    id: '3',
    name: '数据分析平台',
    description: '构建企业级数据分析平台，支持实时数据处理和可视化展示',
    status: 'planning',
    progress: 15,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    teamSize: 5,
    budget: 400000,
    priority: 'medium',
    manager: '王五',
    tags: ['大数据', 'Python', '可视化', 'AI']
  }
]
