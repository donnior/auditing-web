import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useStaffs, useCreateStaff, useDeleteStaff } from '@/hooks/useStaffs'
import { StaffModal } from '@/components/StaffModal'
import type { CreateStaffData } from '@/api/staffs'

export const Route = createFileRoute('/admin/staffs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { staffs, isLoading, refetch } = useStaffs()
  const { createStaffMutation, isCreating } = useCreateStaff()
  const { deleteStaffMutation, isDeleting } = useDeleteStaff()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateStaff = async (data: CreateStaffData) => {
    await createStaffMutation(data)
  }

  const handleDeleteStaff = async (id: string, name: string) => {
    if (window.confirm(`确定要删除员工"${name}"吗？`)) {
      await deleteStaffMutation(id)
    }
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
          onClick={() => setIsModalOpen(true)}
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
                自动生成报告
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
            {staffs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  暂无员工数据
                </td>
              </tr>
            ) : (
              staffs.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
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
                    {staff.qwAccountId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.autoGenerateReport
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.autoGenerateReport ? '是' : '否'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(staff.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        删除
                      </button>
                      <button
                        onClick={}
                        className="text-blue-600 hover:text-blue-800"
                      >
                         查看他的报告
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
          共 <span className="font-medium">{staffs.length}</span> 名员工
        </div>
      </div>

      {/* 新增员工 Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStaff}
        isLoading={isCreating}
      />
    </div>
  )
}
