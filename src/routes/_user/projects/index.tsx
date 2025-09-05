import { createFileRoute } from '@tanstack/react-router'

import { getProjects } from '@/api/projects'
import ProjectList from '@/modules/projects/list'

export const Route = createFileRoute('/_user/projects/')({
  loader: async () => {
    const projects = await getProjects()
    return { projects: projects.items }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { projects } = Route.useLoaderData()
  return (
    <ProjectList projects={projects} />
  )
}
