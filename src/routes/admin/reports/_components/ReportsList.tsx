import { Link } from '@tanstack/react-router'
import { daysBefore } from '@/lib/utils'
import type { WeeklyReportSummary } from '@/modules/reports/api'
import { EVAL_TYPE_NAMES } from './util'
import type { EvalType } from '@/constants'
import type { ReportItem } from './ReportsTable'

interface ReportsListProps {
  data: WeeklyReportSummary[]
  isLoading: boolean
  error: any
  currentPage: number
  pageSize: number
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
}

function ReportsList({
  data,
  isLoading,
  error,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
}: ReportsListProps) {
  const reports: ReportItem[] = data.map(report => ({
    id: report.id,
    title: `${EVAL_TYPE_NAMES[report.eval_type as EvalType] || '未知'}`,
    staff: report.employee_name,
    period: `${report.eval_period}`,
    total_customers: report.total_customers,
    has_introduce_course_ratio: report.total_introduce_completed,
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

  if (reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">暂无数据</div>
      </div>
    )
  }

  const total = reports.length
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div
          key={r.id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {r.staff}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center text-xs border rounded-full text-gray-700">
                  <span className="rounded-full px-1 py-1 font-semibold">
                    {daysBefore(r.period, 6)}
                  </span>
                  <span className="px-1 text-gray-500">-</span>
                  <span className="rounded-full px-1 py-1 font-semibold">
                    {r.period}
                  </span>
                </span>
                <span className="rounded-full px-1 py-1 text-xs font-semibold border text-gray-700">
                  {r.title}
                </span>
              </div>
            </div>

            <Link
              to="/admin/reports/$id"
              params={{ id: r.id }}
              className="shrink-0 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              查看
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-xs text-gray-500">总客户数</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {r.total_customers}
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-xs text-gray-500">全部完成人数</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {r.has_introduce_course_ratio}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 分页器（与桌面端保持一致：仅 UI，不做切片） */}
      <div className="flex items-center justify-between px-1 py-2">
        <div className="text-sm text-gray-500">
          显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, total)} 条，共 {total} 条记录
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              上一页
            </button>
            <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md">
              {currentPage}
            </span>
            <button
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsList
