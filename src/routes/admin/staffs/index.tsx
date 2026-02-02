import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useStaffs, useCreateStaff, useUpdateStaff, useDeleteStaff, useAssignAccount, useRemoveAccount, useAvailableAccounts } from '@/modules/staffs/useStaffs'
import { StaffModal } from '@/components/StaffModal'
import { AssignAccountModal } from '@/components/AssignAccountModal'
import type { Staff, CreateStaffData } from '@/modules/staffs/api'

export const Route = createFileRoute('/admin/staffs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { staffs, isLoading, refetch } = useStaffs()
  const { createStaffMutation, isCreating } = useCreateStaff()
  const { updateStaffMutation, isUpdating } = useUpdateStaff()
  const { deleteStaffMutation, isDeleting } = useDeleteStaff()
  const { assignAccountMutation, isAssigning } = useAssignAccount()
  const { removeAccountMutation, isRemoving } = useRemoveAccount()
  const { accounts: availableAccounts, refetch: refetchAccounts } = useAvailableAccounts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [isAssignAccountModalOpen, setIsAssignAccountModalOpen] = useState(false)
  const [assigningStaff, setAssigningStaff] = useState<Staff | null>(null)

  const handleSubmitStaff = async (data: CreateStaffData) => {
    if (modalMode === 'edit' && editingStaff) {
      await updateStaffMutation({ id: editingStaff.id, data })
    } else {
      await createStaffMutation(data)
    }
  }

  const handleEditStaff = (staff: Staff) => {
    setEditingStaff(staff)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCreateStaff = () => {
    setEditingStaff(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingStaff(null)
    setModalMode('create')
  }

  const handleDeleteStaff = async (id: string, name: string) => {
    if (window.confirm(`确定要删除员工"${name}"吗？`)) {
      await deleteStaffMutation(id)
    }
  }

  const handleOpenAssignAccount = (staff: Staff) => {
    setAssigningStaff(staff)
    refetchAccounts()
    setIsAssignAccountModalOpen(true)
  }

  const handleAssignAccount = async (accountUserId: string) => {
    if (assigningStaff) {
      await assignAccountMutation({ employeeId: assigningStaff.id, accountUserId })
    }
  }

  const handleRemoveAccount = async (staff: Staff) => {
    if (window.confirm(`确定要解除员工"${staff.name}"的登录账户"${staff.account_username}"吗？`)) {
      await removeAccountMutation(staff.id)
    }
  }

  const handleCloseAssignAccountModal = () => {
    setIsAssignAccountModalOpen(false)
    setAssigningStaff(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div>
      {/* 页面头部 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">员工管理</h1>
                <button
          onClick={handleCreateStaff}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新增员工
        </button>
      </div>

      {/* 员工列表 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                员工姓名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                企微ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属分组
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                登录账户
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                自动生成报告
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffs?.content?.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  暂无员工数据
                </td>
              </tr>
            ) : (
                staffs?.content?.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {staff.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {staff.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.qw_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.group_name ? (
                      <Link
                        to="/admin/groups/$id"
                        params={{ id: staff.group_id! }}
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {staff.group_name}
                      </Link>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
                        未分组
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.account_username ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {staff.account_username}
                        </span>
                        <button
                          onClick={() => handleRemoveAccount(staff)}
                          disabled={isRemoving}
                          className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                          title="解除绑定"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenAssignAccount(staff)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-full hover:bg-blue-50"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        分配账户
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status === 1 ? '是' : '否'}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(staff.create_time).toLocaleDateString('zh-CN')}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/admin/reports"
                        search={{ employeeId: staff.id }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        查看报告
                      </Link>
                      <button
                        onClick={() => handleEditStaff(staff)}
                        className="text-green-600 hover:text-green-800"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 统计信息 */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          共 <span className="font-medium">{staffs?.items?.length}</span> 名员工
        </div>
      </div>

      {/* 员工 Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitStaff}
        isLoading={modalMode === 'edit' ? isUpdating : isCreating}
        editingStaff={editingStaff}
        mode={modalMode}
      />

      {/* 分配账户 Modal */}
      <AssignAccountModal
        isOpen={isAssignAccountModalOpen}
        onClose={handleCloseAssignAccountModal}
        onSubmit={handleAssignAccount}
        isLoading={isAssigning}
        availableAccounts={availableAccounts || []}
        employeeName={assigningStaff?.name || ''}
      />
    </div>
  )
}
