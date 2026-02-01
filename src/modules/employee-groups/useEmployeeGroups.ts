import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getEmployeeGroups,
  getEmployeeGroup,
  createEmployeeGroup,
  updateEmployeeGroup,
  deleteEmployeeGroup,
  addMembersToGroup,
  removeMemberFromGroup,
  setGroupLeader,
  getUnassignedEmployees,
} from './api'
import type { CreateEmployeeGroupData, UpdateEmployeeGroupData } from './api'

/**
 * 获取员工分组列表
 */
export const useEmployeeGroups = () => {
  const { data: groups, isLoading, error, refetch } = useQuery({
    queryKey: ['employee-groups'],
    queryFn: getEmployeeGroups,
  })

  return { groups, isLoading, error, refetch }
}

/**
 * 获取分组详情（包含成员）
 */
export const useEmployeeGroup = (id: string | null) => {
  const { data: group, isLoading, error, refetch } = useQuery({
    queryKey: ['employee-group', id],
    queryFn: () => getEmployeeGroup(id!),
    enabled: !!id,
  })

  return { group, isLoading, error, refetch }
}

/**
 * 创建分组
 */
export const useCreateEmployeeGroup = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: createGroupMutation, isPending: isCreating } = useMutation({
    mutationFn: createEmployeeGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-groups'] })
    },
  })

  return { createGroupMutation, isCreating }
}

/**
 * 更新分组
 */
export const useUpdateEmployeeGroup = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateGroupMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeGroupData }) =>
      updateEmployeeGroup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee-groups'] })
      queryClient.invalidateQueries({ queryKey: ['employee-group', variables.id] })
    },
  })

  return { updateGroupMutation, isUpdating }
}

/**
 * 删除分组
 */
export const useDeleteEmployeeGroup = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteGroupMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteEmployeeGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-groups'] })
    },
  })

  return { deleteGroupMutation, isDeleting }
}

/**
 * 添加成员到分组
 */
export const useAddMembersToGroup = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: addMembersMutation, isPending: isAdding } = useMutation({
    mutationFn: ({ groupId, employeeIds }: { groupId: string; employeeIds: string[] }) =>
      addMembersToGroup(groupId, employeeIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee-groups'] })
      queryClient.invalidateQueries({ queryKey: ['employee-group', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['unassigned-employees'] })
      queryClient.invalidateQueries({ queryKey: ['staffs'] })
    },
  })

  return { addMembersMutation, isAdding }
}

/**
 * 从分组移除成员
 */
export const useRemoveMemberFromGroup = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: removeMemberMutation, isPending: isRemoving } = useMutation({
    mutationFn: ({ groupId, employeeId }: { groupId: string; employeeId: string }) =>
      removeMemberFromGroup(groupId, employeeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee-groups'] })
      queryClient.invalidateQueries({ queryKey: ['employee-group', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['unassigned-employees'] })
      queryClient.invalidateQueries({ queryKey: ['staffs'] })
    },
  })

  return { removeMemberMutation, isRemoving }
}

/**
 * 设置组长
 */
export const useSetGroupLeader = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: setLeaderMutation, isPending: isSetting } = useMutation({
    mutationFn: ({ groupId, employeeId }: { groupId: string; employeeId: string }) =>
      setGroupLeader(groupId, employeeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee-groups'] })
      queryClient.invalidateQueries({ queryKey: ['employee-group', variables.groupId] })
    },
  })

  return { setLeaderMutation, isSetting }
}

/**
 * 获取未分组的员工
 */
export const useUnassignedEmployees = () => {
  const { data: employees, isLoading, error, refetch } = useQuery({
    queryKey: ['unassigned-employees'],
    queryFn: getUnassignedEmployees,
  })

  return { employees, isLoading, error, refetch }
}
