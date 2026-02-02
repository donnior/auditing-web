import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  useResetPassword,
} from '@/modules/accounts/useAccounts'
import { AccountModal } from '@/components/AccountModal'
import { ResetPasswordModal } from '@/components/ResetPasswordModal'
import type { AccountUser, CreateAccountData } from '@/modules/accounts/api'
import { ACCOUNT_TYPE, ACCOUNT_TYPE_NAMES, ACCOUNT_STATUS, ACCOUNT_STATUS_NAMES } from '@/modules/accounts/api'

export const Route = createFileRoute('/admin/accounts/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { accounts, isLoading, refetch } = useAccounts()
  const { createAccountMutation, isCreating } = useCreateAccount()
  const { updateAccountMutation, isUpdating } = useUpdateAccount()
  const { deleteAccountMutation, isDeleting } = useDeleteAccount()
  const { resetPasswordMutation, isResetting } = useResetPassword()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountUser | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [resettingAccount, setResettingAccount] = useState<AccountUser | null>(null)

  const handleSubmitAccount = async (data: CreateAccountData) => {
    if (modalMode === 'edit' && editingAccount) {
      await updateAccountMutation({ id: editingAccount.id, data })
    } else {
      await createAccountMutation(data)
    }
  }

  const handleEditAccount = (account: AccountUser) => {
    setEditingAccount(account)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCreateAccount = () => {
    setEditingAccount(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAccount(null)
    setModalMode('create')
  }

  const handleDeleteAccount = async (id: string, username: string) => {
    if (username === 'admin') {
      alert('不能删除管理员账号')
      return
    }
    if (window.confirm(`确定要删除账号"${username}"吗？`)) {
      await deleteAccountMutation(id)
    }
  }

  const handleOpenResetPassword = (account: AccountUser) => {
    setResettingAccount(account)
    setIsResetPasswordModalOpen(true)
  }

  const handleResetPassword = async (newPassword: string) => {
    if (resettingAccount) {
      await resetPasswordMutation({ id: resettingAccount.id, newPassword })
    }
  }

  const handleCloseResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false)
    setResettingAccount(null)
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
        <h1 className="text-2xl font-semibold text-gray-900">账号管理</h1>
        <button
          onClick={handleCreateAccount}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新增账号
        </button>
      </div>

      {/* 账号列表 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                账号类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts?.content?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  暂无账号数据
                </td>
              </tr>
            ) : (
              accounts?.content?.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-8 w-8">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          account.account_type === ACCOUNT_TYPE.ADMIN 
                            ? 'bg-yellow-100' 
                            : 'bg-purple-100'
                        }`}>
                          <svg 
                            className={`w-4 h-4 ${
                              account.account_type === ACCOUNT_TYPE.ADMIN 
                                ? 'text-yellow-600' 
                                : 'text-purple-600'
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {account.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.account_type === ACCOUNT_TYPE.ADMIN
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ACCOUNT_TYPE_NAMES[account.account_type] || '未知'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.status === ACCOUNT_STATUS.ACTIVE
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ACCOUNT_STATUS_NAMES[account.status] || '未知'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.create_time 
                      ? new Date(account.create_time).toLocaleDateString('zh-CN')
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleOpenResetPassword(account)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        重置密码
                      </button>
                      {account.username !== 'admin' && (
                        <button
                          onClick={() => handleDeleteAccount(account.id, account.username)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          删除
                        </button>
                      )}
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
          共 <span className="font-medium">{accounts?.content?.length || 0}</span> 个账号
        </div>
      </div>

      {/* 账号 Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAccount}
        isLoading={modalMode === 'edit' ? isUpdating : isCreating}
        editingAccount={editingAccount}
        mode={modalMode}
      />

      {/* 重置密码 Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={handleCloseResetPasswordModal}
        onSubmit={handleResetPassword}
        isLoading={isResetting}
        username={resettingAccount?.username || ''}
      />
    </div>
  )
}
