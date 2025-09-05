import { getMockProjectMembers, mockDelay } from './mock'
import type { PaginationResponse, ProjectMember } from './types'

const getProjectMembers = async (projectId: string): Promise<PaginationResponse<ProjectMember>> => {
  // 模拟网络延迟
  console.log('getProjectMembers', projectId)
  await mockDelay()

  // 每次请求都生成带有随机id的新数据
  const projectMembersWithRandomIds = getMockProjectMembers()

  // 根据项目ID过滤成员（模拟不同项目有不同成员）
  const filteredMembers = projectMembersWithRandomIds.filter((_, index) => {
    const projectNum = parseInt(projectId) || 1
    return index < (projectNum % 4 + 2) // 每个项目2-5个成员
  })

  return {
    items: filteredMembers,
    total: filteredMembers.length
  }
}

const deleteProjectMember = async (projectId: string, memberId: string) => {
  console.log('request deleteProjectMember', projectId, memberId)
  await mockDelay()
  return {
    success: true
  }
}

export { getProjectMembers, deleteProjectMember }
