import { createFileRoute } from '@tanstack/react-router'

import ProjectList2 from '@/modules/projects/list2'

export const Route = createFileRoute('/_user/projects/list2')({
    pendingComponent: () => <div>Loading...</div>,
    component: ProjectList2,
})
