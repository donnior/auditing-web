import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  resetPassword,
} from './api'
import type { CreateAccountData, UpdateAccountData } from './api'

/**
 * 获取账户列表
 */
export const useAccounts = () => {
  const { data: accounts, isLoading, error, refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })

  return { accounts, isLoading, error, refetch }
}

/**
 * 获取账户详情
 */
export const useAccount = (id: string | null) => {
  const { data: account, isLoading, error, refetch } = useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccount(id!),
    enabled: !!id,
  })

  return { account, isLoading, error, refetch }
}

/**
 * 创建账户
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: createAccountMutation, isPending: isCreating } = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['available-accounts'] })
    },
  })

  return { createAccountMutation, isCreating }
}

/**
 * 更新账户
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateAccountMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountData }) =>
      updateAccount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['account', variables.id] })
    },
  })

  return { updateAccountMutation, isUpdating }
}

/**
 * 删除账户
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteAccountMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['available-accounts'] })
    },
  })

  return { deleteAccountMutation, isDeleting }
}

/**
 * 重置密码
 */
export const useResetPassword = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: resetPasswordMutation, isPending: isResetting } = useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      resetPassword(id, newPassword),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['account', variables.id] })
    },
  })

  return { resetPasswordMutation, isResetting }
}
