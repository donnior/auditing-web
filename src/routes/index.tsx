import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,

})

export default function RouteComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: '/admin/reports', replace: true })
  }, [])

  return null;
}
