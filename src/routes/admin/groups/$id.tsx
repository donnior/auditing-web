import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useEmployeeGroup,
  useAddMembersToGroup,
  useRemoveMemberFromGroup,
  useSetGroupLeader,
  useUnassignedEmployees,
} from '@/modules/employee-groups/useEmployeeGroups'
import { AddMembersModal } from '@/components/AddMembersModal'

export const Route = createFileRoute('/admin/groups/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { group, isLoading, refetch } = useEmployeeGroup(id)
  const { removeMemberMutation, isRemoving } = useRemoveMemberFromGroup()
  const { setLeaderMutation, isSetting } = useSetGroupLeader()
  const { addMembersMutation, isAdding } = useAddMembersToGroup()
  const { employees: unassignedEmployees, refetch: refetchUnassigned } = useUnassignedEmployees()
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false)

  const handleRemoveMember = async (employeeId: string, employeeName: string) => {
    if (window.confirm(`确定要将"${employeeName}"从分组中移除吗？`)) {
      await removeMemberMutation({ groupId: id, employeeId })
      refetch()
      refetchUnassigned()
    }
  }

  const handleSetLeader = async (employeeId: string, employeeName: string) => {
    if (window.confirm(`确定要将"${employeeName}"设置为组长吗？`)) {
      await setLeaderMutation({ groupId: id, employeeId })
      refetch()
    }
  }

  const handleAddMembers = async (employeeIds: string[]) => {
    await addMembersMutation({ groupId: id, employeeIds })
    refetch()
    refetchUnassigned()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">分组不存在</div>
      </div>
    )
  }

  return (
    <div>
      {/* 面包屑导航 */}
      <nav className="mb-4">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link to="/admin/groups" className="text-blue-600 hover:text-blue-800">
              分组管理
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-600">{group.name}</li>
        </ol>
      </nav>

      {/* 页面头部 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{group.name}</h1>
            {group.description && (
              <p className="text-gray-500 mt-1">{group.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{group.member_count}</div>
              <div className="text-sm text-gray-500">成员数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900">
                {group.leader_name || '-'}
              </div>
              <div className="text-sm text-gray-500">组长</div>
            </div>
          </div>
        </div>
      </div>

      {/* 成员管理 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">成员列表</h2>
          <button
            onClick={() => setIsAddMembersModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加成员
          </button>
        </div>

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
                角色
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {group.members?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  暂无成员，点击"添加成员"按钮添加员工到此分组
                </td>
              </tr>
            ) : (
              group.members?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-8 w-8">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          member.is_leader ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <span className={`text-sm font-medium ${
                            member.is_leader ? 'text-yellow-600' : 'text-blue-600'
                          }`}>
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {member.name}
                          {member.is_leader && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              组长
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.qw_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.is_leader
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.is_leader ? '组长' : '成员'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      {!member.is_leader && (
                        <button
                          onClick={() => handleSetLeader(member.id, member.name)}
                          disabled={isSetting}
                          className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
                        >
                          设为组长
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        disabled={isRemoving}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        移除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 添加成员 Modal */}
      <AddMembersModal
        isOpen={isAddMembersModalOpen}
        onClose={() => setIsAddMembersModalOpen(false)}
        onSubmit={handleAddMembers}
        isLoading={isAdding}
        unassignedEmployees={unassignedEmployees || []}
      />
    </div>
  )
}
