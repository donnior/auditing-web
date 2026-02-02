import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getStaffs, createStaff, updateStaff, deleteStaff, assignAccount, removeAccount, getAvailableAccounts, getManagedByLeader } from './api'
import type { Staff, CreateStaffData, UpdateStaffData } from '@/modules/staffs/api'
import { isAdmin, getAuthedUsername } from '@/lib/auth'

// 获取员工列表
export const useStaffs = () => {
  const { data: staffs, isLoading, error, refetch } = useQuery({
    queryKey: ['staffs'],
    queryFn: getStaffs,
  })

  return { staffs, isLoading, error, refetch }
}

// 创建员工
export const useCreateStaff = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: createStaffMutation, isPending: isCreating } = useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      // 重新获取员工列表
      queryClient.invalidateQueries({ queryKey: ['staffs'] })
    },
  })

  return { createStaffMutation, isCreating }
}

// 更新员工
export const useUpdateStaff = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateStaffMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffData }) =>
      updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] })
    },
  })

  return { updateStaffMutation, isUpdating }
}

// 删除员工
export const useDeleteStaff = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteStaffMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] })
    },
  })

  return { deleteStaffMutation, isDeleting }
}

// 分配登录账户
export const useAssignAccount = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: assignAccountMutation, isPending: isAssigning } = useMutation({
    mutationFn: ({ employeeId, accountUserId }: { employeeId: string; accountUserId: string }) =>
      assignAccount(employeeId, accountUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] })
      queryClient.invalidateQueries({ queryKey: ['available-accounts'] })
    },
  })

  return { assignAccountMutation, isAssigning }
}

// 解除登录账户
export const useRemoveAccount = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: removeAccountMutation, isPending: isRemoving } = useMutation({
    mutationFn: removeAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] })
      queryClient.invalidateQueries({ queryKey: ['available-accounts'] })
    },
  })

  return { removeAccountMutation, isRemoving }
}

// 获取可分配的账户列表
export const useAvailableAccounts = () => {
  const { data: accounts, isLoading, error, refetch } = useQuery({
    queryKey: ['available-accounts'],
    queryFn: getAvailableAccounts,
  })

  return { accounts, isLoading, error, refetch }
}

// 获取组长管理的员工列表
export const useManagedByLeader = (username: string | undefined) => {
  const { data: staffs, isLoading, error, refetch } = useQuery({
    queryKey: ['managed-by-leader', username],
    queryFn: () => getManagedByLeader(username!),
    enabled: !!username,
  })

  return { staffs, isLoading, error, refetch }
}

/**
 * 根据账户类型获取员工列表
 * - 管理员：获取所有员工
 * - 普通员工（组长）：获取其管理的分组内的员工
 */
export const useStaffsForReports = () => {
  const admin = isAdmin()
  const username = getAuthedUsername()

  // 管理员获取所有员工
  const allStaffsQuery = useQuery({
    queryKey: ['staffs'],
    queryFn: getStaffs,
    enabled: admin,
  })

  // 组长获取管理的员工
  const managedStaffsQuery = useQuery({
    queryKey: ['managed-by-leader', username],
    queryFn: () => getManagedByLeader(username!),
    enabled: !admin && !!username,
  })

  if (admin) {
    return {
      staffs: allStaffsQuery.data?.content || [],
      isLoading: allStaffsQuery.isLoading,
      error: allStaffsQuery.error,
      refetch: allStaffsQuery.refetch,
    }
  } else {
    return {
      staffs: managedStaffsQuery.data || [],
      isLoading: managedStaffsQuery.isLoading,
      error: managedStaffsQuery.error,
      refetch: managedStaffsQuery.refetch,
    }
  }
}
