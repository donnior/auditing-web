import { deleteProjectMember, getProjectMembers } from "@/api/project_members"
import { getProjects } from "@/api/projects"
import { useMutation, useQuery } from "@tanstack/react-query"

const useProjects = () => {
    const { data: projects, isLoading: projectsLoading, error } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    })
    return { projects, projectsLoading, error }
}

const useProjectMembers = (projectId: string, live: boolean = false) => {
    const { data: projectMembers, refetch: refetchProjectMembers, isFetching: isLoading } = useQuery({
        queryKey: ['project_members', projectId],
        queryFn: () => getProjectMembers(projectId),
        enabled: projectId !== '',
        refetchInterval: live && 2000,
    })
    return { projectMembers, refetchProjectMembers, isLoading }
}

const useDeleteProjectMember = () => {
    const { mutateAsync: deleteMember, isPending: isDeleting } = useMutation({
        mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) => deleteProjectMember(projectId, memberId)
    })
    return { deleteMember, isDeleting }
}

export { useProjects, useProjectMembers, useDeleteProjectMember }
