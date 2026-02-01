import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useEmployeeGroups,
  useCreateEmployeeGroup,
  useUpdateEmployeeGroup,
  useDeleteEmployeeGroup,
} from '@/modules/employee-groups/useEmployeeGroups'
import { EmployeeGroupModal } from '@/components/EmployeeGroupModal'
import type { EmployeeGroup, CreateEmployeeGroupData } from '@/modules/employee-groups/api'

export const Route = createFileRoute('/admin/groups/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { groups, isLoading, refetch } = useEmployeeGroups()
  const { createGroupMutation, isCreating } = useCreateEmployeeGroup()
  const { updateGroupMutation, isUpdating } = useUpdateEmployeeGroup()
  const { deleteGroupMutation, isDeleting } = useDeleteEmployeeGroup()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<EmployeeGroup | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  const handleSubmitGroup = async (data: CreateEmployeeGroupData) => {
    if (modalMode === 'edit' && editingGroup) {
      await updateGroupMutation({ id: editingGroup.id, data })
    } else {
      await createGroupMutation(data)
    }
  }

  const handleEditGroup = (group: EmployeeGroup) => {
    setEditingGroup(group)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCreateGroup = () => {
    setEditingGroup(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGroup(null)
    setModalMode('create')
  }

  const handleDeleteGroup = async (id: string, name: string) => {
    if (window.confirm(`确定要删除分组"${name}"吗？删除后该分组内的员工将变为未分组状态。`)) {
      await deleteGroupMutation(id)
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
        <h1 className="text-2xl font-semibold text-gray-900">分组管理</h1>
        <button
          onClick={handleCreateGroup}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新增分组
        </button>
      </div>

      {/* 分组卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            暂无分组数据，点击上方"新增分组"按钮创建第一个分组
          </div>
        ) : (
          groups?.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* 分组头部 */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditGroup(group)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="编辑"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id, group.name)}
                    disabled={isDeleting}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                    title="删除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 分组统计 */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">成员数</div>
                    <div className="text-lg font-semibold text-gray-900">{group.member_count}</div>
                  </div>
                </div>
              </div>

              {/* 组长信息 */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">组长：</span>
                  <span className="text-sm font-medium text-gray-900">
                    {group.leader_name || '暂未设置'}
                  </span>
                </div>
              </div>

              {/* 查看详情链接 */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to="/admin/groups/$id"
                  params={{ id: group.id }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  管理成员
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 统计信息 */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          共 <span className="font-medium">{groups?.length || 0}</span> 个分组
        </div>
      </div>

      {/* 分组 Modal */}
      <EmployeeGroupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitGroup}
        isLoading={modalMode === 'edit' ? isUpdating : isCreating}
        editingGroup={editingGroup}
        mode={modalMode}
      />
    </div>
  )
}
