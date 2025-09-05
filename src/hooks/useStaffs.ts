import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getStaffs, createStaff, updateStaff, deleteStaff } from '@/api/staffs'
import type { CreateStaffData, UpdateStaffData } from '@/api/staffs'
import type { Staff } from '@/api/types'

// 获取员工列表
export const useStaffs = () => {
  const { data: staffs = [], isLoading, error, refetch } = useQuery({
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
