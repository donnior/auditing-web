import React, { useState, useEffect } from 'react'
import type { EmployeeBrief } from '@/modules/employee-groups/api'

interface AddMembersModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (employeeIds: string[]) => Promise<void>
  isLoading?: boolean
  unassignedEmployees: EmployeeBrief[]
}

export const AddMembersModal: React.FC<AddMembersModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  unassignedEmployees,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // 重置选择状态
  useEffect(() => {
    if (isOpen) {
      setSelectedIds([])
      setSearchTerm('')
    }
  }, [isOpen])

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredEmployees.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredEmployees.map(e => e.id))
    }
  }

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      return
    }

    try {
      await onSubmit(selectedIds)
      setSelectedIds([])
      onClose()
    } catch (error) {
      console.error('添加成员失败:', error)
    }
  }

  const handleClose = () => {
    setSelectedIds([])
    setSearchTerm('')
    onClose()
  }

  // 过滤员工
  const filteredEmployees = unassignedEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.qw_id && employee.qw_id.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal 内容 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto z-10 max-h-[80vh] flex flex-col">
        {/* Modal 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">添加成员</h3>
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
              placeholder="搜索员工姓名或企微ID..."
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
          
          {/* 全选按钮 */}
          {filteredEmployees.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedIds.length === filteredEmployees.length ? '取消全选' : '全选'}
              </button>
              <span className="text-sm text-gray-500">
                已选择 {selectedIds.length} 人
              </span>
            </div>
          )}
        </div>

        {/* 员工列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {unassignedEmployees.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无未分组的员工
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              未找到匹配的员工
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEmployees.map((employee) => (
                <label
                  key={employee.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedIds.includes(employee.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(employee.id)}
                    onChange={() => handleToggleSelect(employee.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.qw_id}
                      </div>
                    </div>
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
            disabled={isLoading || selectedIds.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '添加中...' : `添加 ${selectedIds.length > 0 ? `(${selectedIds.length}人)` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}
