import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { getReports, type WeeklyReportSummary } from '@/modules/reports/api'
import type { PageResponse } from '@/modules/common/types'
import ReportsTable from './_components/ReportsTable'
import ReportsSummary from './_components/ReportsSummary'
import { BackArrow } from '@/components/icons'
import { useStaffs } from '@/modules/staffs/useStaffs'
import { getRecentWeekPeriodOptions } from '@/lib/reportPeriods'
import { EVAL_TYPE, type EvalType } from '@/constants'
import { EVAL_TYPE_NAMES } from './_components/util'

const searchSchema = z.object({
  staff: z.coerce.string().optional(),
  employeeId: z.coerce.string().optional(),
  evalPeriod: z.coerce.string().optional(),
  evalType: z.coerce.string().optional(),
})

export const Route = createFileRoute('/admin/reports/')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { staff, employeeId, evalPeriod, evalType } = Route.useSearch()
  const navigate = Route.useNavigate()

  // 兼容旧链接：/admin/reports?staff=<员工ID>
  const effectiveEmployeeId = employeeId ?? staff

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)

  const { staffs, isLoading: isStaffsLoading } = useStaffs()
  const staffName = useMemo(() => {
    if (!effectiveEmployeeId) return undefined
    return staffs?.content?.find(s => s.id === effectiveEmployeeId)?.name ?? effectiveEmployeeId
  }, [effectiveEmployeeId, staffs?.content])

  const periodOptions = useMemo(() => getRecentWeekPeriodOptions(8), [])

  // 使用React Query获取报告数据
  const { data, isLoading, error } = useQuery<PageResponse<WeeklyReportSummary>>({
    queryKey: ['reports', effectiveEmployeeId, evalPeriod, evalType, currentPage, pageSize],
    queryFn: () => getReports(undefined, effectiveEmployeeId, evalPeriod, evalType),
  })

  // 列表过滤：隐藏「加微后48小时检测」类型
  const filteredReports = useMemo(() => {
    return (data?.content ?? []).filter((r) => r.eval_type !== EVAL_TYPE.WITHIN_48_HOURS)
  }, [data?.content])

  const shouldShowSummary = Boolean(evalPeriod) && filteredReports.length > 0

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          {effectiveEmployeeId && (
            <div className="mb-2">
              <Link
                to="/admin/staffs"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <BackArrow />
                返回员工管理
              </Link>
            </div>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">
            {effectiveEmployeeId ? `${staffName} 的报告` : '所有报告'}
          </h1>
          {effectiveEmployeeId && (
            <p className="text-sm text-gray-600 mt-1">
              共找到 {filteredReports.length} 条报告记录
            </p>
          )}
        </div>
      </div>

      {/* 过滤项（block 排列） */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">报告周期</div>
          <select
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
            value={evalPeriod ?? ''}
            onChange={(e) => {
              const v = e.target.value
              navigate({
                search: {
                  staff,
                  employeeId,
                  evalPeriod: v ? v : undefined,
                  evalType,
                },
              })
            }}
          >
            <option value="">全部（近 8 周）</option>
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">员工</div>
          <select
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
            disabled={isStaffsLoading}
            value={effectiveEmployeeId ?? ''}
            onChange={(e) => {
              const v = e.target.value
              navigate({
                search: {
                  evalPeriod,
                  evalType,
                  employeeId: v ? v : undefined,
                },
              })
            }}
          >
            <option value="">全部员工</option>
            {staffs?.content?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">评估类型</div>
          <select
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
            value={evalType ?? ''}
            onChange={(e) => {
              const v = e.target.value
              navigate({
                search: {
                  staff,
                  employeeId,
                  evalPeriod,
                  evalType: v ? v : undefined,
                },
              })
            }}
          >
            <option value="">全部</option>
            {([EVAL_TYPE.FIRST_WEEK, EVAL_TYPE.SECOND_WEEK, EVAL_TYPE.THIRD_WEEK, EVAL_TYPE.FOURTH_WEEK] as EvalType[]).map((t) => (
              <option key={t as string} value={t}>
                {EVAL_TYPE_NAMES[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {shouldShowSummary && (
        <ReportsSummary data={filteredReports} evalPeriod={evalPeriod as string} />
      )}

      {data?.content && <ReportsTable
        data={filteredReports}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />}
    </div>
  )
}
