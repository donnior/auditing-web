import React, { useState, useEffect } from 'react'
import type { AccountBrief } from '@/modules/staffs/api'

interface AssignAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (accountUserId: string) => Promise<void>
  isLoading?: boolean
  availableAccounts: AccountBrief[]
  employeeName: string
}

export const AssignAccountModal: React.FC<AssignAccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  availableAccounts,
  employeeName,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // 重置选择状态
  useEffect(() => {
    if (isOpen) {
      setSelectedAccountId('')
      setSearchTerm('')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!selectedAccountId) {
      return
    }

    try {
      await onSubmit(selectedAccountId)
      setSelectedAccountId('')
      onClose()
    } catch (error) {
      console.error('分配账户失败:', error)
    }
  }

  const handleClose = () => {
    setSelectedAccountId('')
    setSearchTerm('')
    onClose()
  }

  // 过滤账户
  const filteredAccounts = availableAccounts.filter(account =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 获取账户类型文本
  const getAccountTypeText = (type: number) => {
    return type === 1 ? '管理员' : '普通员工'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal 内容 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10 max-h-[80vh] flex flex-col">
        {/* Modal 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">分配登录账户</h3>
            <p className="text-sm text-gray-500 mt-1">为员工 "{employeeName}" 分配登录账户</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="搜索账户名..."
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 账户列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {availableAccounts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无可分配的账户
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              未找到匹配的账户
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAccounts.map((account) => (
                <label
                  key={account.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAccountId === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="account"
                    checked={selectedAccountId === account.id}
                    onChange={() => setSelectedAccountId(account.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {account.username}
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      account.account_type === 1
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getAccountTypeText(account.account_type)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Modal 底部按钮 */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedAccountId}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '分配中...' : '确认分配'}
          </button>
        </div>
      </div>
    </div>
  )
}
