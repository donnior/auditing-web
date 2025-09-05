import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/projects_/$id/members')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <div>这是独立的 Members 页面，项目 ID: {id}</div>
}
