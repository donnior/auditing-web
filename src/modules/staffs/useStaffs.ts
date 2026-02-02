import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getStaffs, createStaff, updateStaff, deleteStaff, assignAccount, removeAccount, getAvailableAccounts } from './api'
import type { Staff, CreateStaffData, UpdateStaffData } from '@/modules/staffs/api'

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
