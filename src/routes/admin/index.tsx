import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>Admin Index</div>
      </div>
    </div>
  )
}
