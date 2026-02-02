import React, { useState, useEffect } from 'react'
import type { AccountUser, CreateAccountData } from '@/modules/accounts/api'
import { ACCOUNT_TYPE, ACCOUNT_TYPE_NAMES, ACCOUNT_STATUS, ACCOUNT_STATUS_NAMES } from '@/modules/accounts/api'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateAccountData) => Promise<void>
  isLoading?: boolean
  editingAccount?: AccountUser | null
  mode?: 'create' | 'edit'
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editingAccount = null,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    account_type: ACCOUNT_TYPE.EMPLOYEE,
    status: ACCOUNT_STATUS.ACTIVE,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // 当编辑模式时，填充表单数据
  useEffect(() => {
    if (mode === 'edit' && editingAccount) {
      setFormData({
        username: editingAccount.username,
        password: '', // 编辑时不显示密码
        account_type: editingAccount.account_type,
        status: editingAccount.status,
      })
    } else {
      // 创建模式时重置表单
      setFormData({
        username: '',
        password: '',
        account_type: ACCOUNT_TYPE.EMPLOYEE,
        status: ACCOUNT_STATUS.ACTIVE,
      })
    }
    setErrors({})
  }, [mode, editingAccount, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 表单验证
    const newErrors: Record<string, string> = {}
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名'
    }
    if (mode === 'create' && !formData.password.trim()) {
      newErrors.password = '请输入密码'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      const submitData: CreateAccountData = {
        username: formData.username,
        password: formData.password || undefined,
        account_type: formData.account_type,
      }
      // 编辑模式下也传入状态
      if (mode === 'edit') {
        (submitData as any).status = formData.status
      }
      await onSubmit(submitData)
      // 重置表单
      setFormData({
        username: '',
        password: '',
        account_type: ACCOUNT_TYPE.EMPLOYEE,
        status: ACCOUNT_STATUS.ACTIVE,
      })
      setErrors({})
      onClose()
    } catch (error: any) {
      console.error('操作失败:', error)
      if (error?.response?.data?.message) {
        setErrors({ submit: error.response.data.message })
      }
    }
  }

  const handleClose = () => {
    setFormData({
      username: '',
      password: '',
      account_type: ACCOUNT_TYPE.EMPLOYEE,
      status: ACCOUNT_STATUS.ACTIVE,
    })
    setErrors({})
    onClose()
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
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10">
        {/* Modal 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {mode === 'edit' ? '编辑账号' : '新增账号'}
          </h3>
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

        {/* Modal 内容 */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* 用户名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                disabled={mode === 'edit' && editingAccount?.username === 'admin'}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入用户名"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码 {mode === 'create' && <span className="text-red-500">*</span>}
                {mode === 'edit' && <span className="text-gray-400 text-xs">（留空则不修改）</span>}
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={mode === 'edit' ? '留空则不修改密码' : '请输入密码'}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 账号类型 */}
            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                账号类型
              </label>
              <select
                id="accountType"
                value={formData.account_type}
                onChange={(e) => setFormData(prev => ({ ...prev, account_type: Number(e.target.value) }))}
                disabled={mode === 'edit' && editingAccount?.username === 'admin'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value={ACCOUNT_TYPE.ADMIN}>{ACCOUNT_TYPE_NAMES[ACCOUNT_TYPE.ADMIN]}</option>
                <option value={ACCOUNT_TYPE.EMPLOYEE}>{ACCOUNT_TYPE_NAMES[ACCOUNT_TYPE.EMPLOYEE]}</option>
              </select>
            </div>

            {/* 状态（仅编辑模式显示） */}
            {mode === 'edit' && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: Number(e.target.value) }))}
                  disabled={editingAccount?.username === 'admin'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value={ACCOUNT_STATUS.ACTIVE}>{ACCOUNT_STATUS_NAMES[ACCOUNT_STATUS.ACTIVE]}</option>
                  <option value={ACCOUNT_STATUS.INACTIVE}>{ACCOUNT_STATUS_NAMES[ACCOUNT_STATUS.INACTIVE]}</option>
                </select>
              </div>
            )}

            {/* 错误提示 */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Modal 底部按钮 */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (mode === 'edit' ? '更新中...' : '创建中...') : (mode === 'edit' ? '更新' : '创建')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
