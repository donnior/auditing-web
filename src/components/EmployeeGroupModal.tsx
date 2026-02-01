import React, { useState, useEffect } from 'react'
import type { CreateEmployeeGroupData, EmployeeGroup } from '@/modules/employee-groups/api'

interface EmployeeGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateEmployeeGroupData) => Promise<void>
  isLoading?: boolean
  editingGroup?: EmployeeGroup | null
  mode?: 'create' | 'edit'
}

export const EmployeeGroupModal: React.FC<EmployeeGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editingGroup = null,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<CreateEmployeeGroupData>({
    name: '',
    description: '',
  })

  const [errors, setErrors] = useState<Partial<CreateEmployeeGroupData>>({})

  // 当编辑模式时，填充表单数据
  useEffect(() => {
    if (mode === 'edit' && editingGroup) {
      setFormData({
        name: editingGroup.name,
        description: editingGroup.description || '',
        leaderId: editingGroup.leader_id || undefined,
      })
    } else {
      // 创建模式时重置表单
      setFormData({
        name: '',
        description: '',
      })
    }
    setErrors({})
  }, [mode, editingGroup, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 表单验证
    const newErrors: Partial<CreateEmployeeGroupData> = {}
    if (!formData.name.trim()) {
      newErrors.name = '请输入分组名称'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      await onSubmit(formData)
      // 重置表单
      setFormData({
        name: '',
        description: '',
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
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
            {mode === 'edit' ? '编辑分组' : '新增分组'}
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
            {/* 分组名称 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                分组名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="请输入分组名称"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* 分组描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                分组描述
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入分组描述（可选）"
              />
            </div>
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
