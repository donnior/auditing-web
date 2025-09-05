import { getProjectMembers } from "@/api/project_members"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

function RouteComponent({projects}: {projects: any}) {
    const navigate = useNavigate()
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

    const { data: projectMembers, isLoading: projectMembersLoading, error: projectMembersError } = useQuery({
        queryKey: ['project_members', selectedProjectId],
        queryFn: () => getProjectMembers(selectedProjectId ?? ''),
        enabled: selectedProjectId !== null,
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 项目网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects && projects.map((item: any) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl duration-300 border border-gray-100 overflow-hidden"
                        >
                            {/* 项目卡片头部 */}
                            <div className="bg-blue-500 p-6">
                                <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                            </div>

                            {/* 项目卡片内容 */}
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <span className="text-sm">ID: {item.id}</span>
                                    </div>

                                    <button
                                        onClick={() => setSelectedProjectId(item.id)}
                                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg"
                                    >
                                        查看成员
                                    </button>

                                    <button
                                        onClick={() => navigate({ to: `/projects/${item.id}/members` })}
                                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg"
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 加载状态和成员信息 */}
                {selectedProjectId && (
                    <div className="mt-10 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            项目成员 (项目 ID: {selectedProjectId})
                        </h2>

                        {projectMembersLoading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <span className="ml-3 text-gray-600">加载中...</span>
                            </div>
                        )}

                        {projectMembersError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <span className="text-red-700">加载成员信息时出错</span>
                                </div>
                            </div>
                        )}

                        {projectMembers && !projectMembersLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projectMembers.items && projectMembers.items.map((member, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                                        <div className="flex items-center">
                                            <div>
                                                <p className="font-medium text-gray-800">{member.name || `成员 ${index + 1}`}</p>
                                                <p className="text-sm text-gray-600">{member.role || '团队成员'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default RouteComponent
