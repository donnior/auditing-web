import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getReports } from '@/api/mock/reports'
import { formatDate } from '@/lib/utils'

const searchSchema = z.object({
  staff: z.string().optional(),
})

export const Route = createFileRoute('/admin/reports/')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { staff } = Route.useSearch()

  // 使用React Query获取报告数据
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['reports', staff],
    queryFn: () => getReports(staff),
  })

  // 转换数据格式以适配现有的UI
  const reports = data.map(report => ({
    id: report.id,
    title: `【${formatDate(report.cycleStartTime)}】${report.qwAccountName}`,
    staff: report.qwAccountName,
    period: formatDate(report.cycleStartTime),
    status: report.totalViolations > 3 ? '违规' : '正常',
    generationStatus: report.generationStatus,
    createdAt: formatDate(report.createdAt),
    views: Math.floor(Math.random() * 2000) + 500 // 随机生成浏览量
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">加载失败，请重试</div>
      </div>
    )
  }

  return (
    <div>
      {/* 页面头部 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {staff && (
            <div className="mb-2">
              <Link
                to="/admin/staffs"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回员工管理
              </Link>
            </div>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">
            {staff ? `${staff} 的报告` : '所有报告'}
          </h1>
          {staff && (
            <p className="text-sm text-gray-600 mt-1">
              共找到 {reports.length} 条报告记录
            </p>
          )}
        </div>
        {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建报告
        </button> */}
      </div>

      {/* 筛选和搜索栏 */}
      {/* <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索帖子标题..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-md ">
            <option>全部状态</option>
            <option>已发布</option>
            <option>草稿</option>
          </select>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
            搜索
          </button>
        </div>
      </div> */}

      {/* 数据表格 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                报告名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                员工
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                报告周期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                生成状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                行为评级
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                生成时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to="/admin/reports/$id"
                    params={{ id: post.id }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.staff}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    post.generationStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : post.generationStatus === 'generating'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {post.generationStatus === 'generating' && (
                      <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {post.generationStatus === 'completed' && (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {post.generationStatus === 'failed' && (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {post.generationStatus === 'completed' ? '已完成' : post.generationStatus === 'generating' ? '生成中' : '生成失败'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.generationStatus === 'completed' ? (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === '正常'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      查看
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          显示 <span className="font-medium">1</span> 到 <span className="font-medium">3</span> 条，共 <span className="font-medium">3</span> 条记录
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
            上一页
          </button>
          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md">
            1
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
            下一页
          </button>
        </div>
      </div>
    </div>
  )
}
