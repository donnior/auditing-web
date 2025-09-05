import { mockProjects, mockDelay } from './mock'
import type { PaginationResponse, Project } from './types'

const getProjects = async (): Promise<PaginationResponse<Project>> => {
  await mockDelay()

  return {
    items: mockProjects,
    total: mockProjects.length
  }
}

export { getProjects }
