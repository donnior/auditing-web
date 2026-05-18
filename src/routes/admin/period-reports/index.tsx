import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { z } from 'zod'

import { EVAL_TYPE, type EvalType } from '@/constants'
import { getRecentWeekPeriodOptions } from '@/lib/reportPeriods'
import { daysBefore } from '@/lib/utils'
import { type WeeklyReportSummary, getReports } from '@/modules/reports/api'
import { useStaffsForReports } from '@/modules/staffs/useStaffs'
import { EVAL_TYPE_NAMES } from '../reports/_components/util'

const searchSchema = z.object({
  employeeId: z.coerce.string().optional(),
  evalPeriod: z.coerce.string().optional(),
})

export const Route = createFileRoute('/admin/period-reports/')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

type PeriodReportRow = {
  key: string
  employeeId: string
  employeeName: string
  evalPeriod: string
  summaries: WeeklyReportSummary[]
  totalCustomers: number
  completedCustomers: number
  riskCustomers: number
}

const STAGE_ORDER: EvalType[] = [
  EVAL_TYPE.FIRST_WEEK,
  EVAL_TYPE.SECOND_WEEK,
  EVAL_TYPE.THIRD_WEEK,
  EVAL_TYPE.FOURTH_WEEK,
]

function getPageItems<T>(data?: { content?: T[]; items?: T[] }): T[] {
  return data?.content ?? data?.items ?? []
}

function formatPeriod(evalPeriod: string) {
  return `${daysBefore(evalPeriod, 6)} - ${evalPeriod}`
}

function buildPeriodRows(reports: WeeklyReportSummary[]): PeriodReportRow[] {
  const groups = new Map<string, PeriodReportRow>()

  reports
    .filter((report) => report.eval_type !== EVAL_TYPE.WITHIN_48_HOURS)
    .forEach((report) => {
      const key = `${report.employee_id}__${report.eval_period}`
      const existing = groups.get(key)

      if (existing) {
        existing.summaries.push(report)
        existing.totalCustomers += report.total_customers || 0
        existing.completedCustomers += report.total_introduce_completed || 0
        existing.riskCustomers += report.total_risk_word_trigger || 0
        return
      }

      groups.set(key, {
        key,
        employeeId: report.employee_id,
        employeeName: report.employee_name,
        evalPeriod: report.eval_period,
        summaries: [report],
        totalCustomers: report.total_customers || 0,
        completedCustomers: report.total_introduce_completed || 0,
        riskCustomers: report.total_risk_word_trigger || 0,
      })
    })

  return Array.from(groups.values()).sort((a, b) => {
    const periodCompare = b.evalPeriod.localeCompare(a.evalPeriod)
    if (periodCompare !== 0) return periodCompare
    return a.employeeName.localeCompare(b.employeeName)
  })
}

function RouteComponent() {
  const { employeeId, evalPeriod } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { staffs, isLoading: isStaffsLoading } = useStaffsForReports()
  const periodOptions = useMemo(() => getRecentWeekPeriodOptions(8), [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['periodReports', employeeId, evalPeriod],
    queryFn: () => getReports(undefined, employeeId, evalPeriod, undefined, 500),
  })

  const rows = useMemo(() => buildPeriodRows(getPageItems<WeeklyReportSummary>(data)), [data])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">员工周期报告</h1>
          <p className="mt-1 text-sm text-gray-600">
            一个员工一个统计周期一条记录，进入后查看该周期内 4 期学员的承接和流失。
          </p>
        </div>
        <Link
          to="/admin/reports"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          阶段明细
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm font-medium text-gray-700">报告周期</div>
          <select
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            value={evalPeriod ?? ''}
            onChange={(e) => {
              const value = e.target.value
              navigate({
                search: {
                  employeeId,
                  evalPeriod: value || undefined,
                },
              })
            }}
          >
            <option value="">全部（近 8 周）</option>
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-sm font-medium text-gray-700">员工</div>
          <select
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            disabled={isStaffsLoading}
            value={employeeId ?? ''}
            onChange={(e) => {
              const value = e.target.value
              navigate({
                search: {
                  evalPeriod,
                  employeeId: value || undefined,
                },
              })
            }}
          >
            <option value="">全部员工</option>
            {staffs?.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500">
          加载中...
        </div>
      )}

      {error && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600">
          加载失败，请重试
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {rows.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-500">暂无数据</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">员工</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">统计周期</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">覆盖阶段</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">总客户数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">全部完成人数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">风险触发</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rows.map((row) => {
                    const stageSet = new Set(row.summaries.map((summary) => summary.eval_type))
                    const orderedStages = STAGE_ORDER.filter((stage) => stageSet.has(stage))

                    return (
                      <tr key={row.key} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{row.employeeName}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          <span className="rounded-full bg-gray-400 px-2 py-1 text-xs font-semibold text-white">
                            {formatPeriod(row.evalPeriod)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-2">
                            {orderedStages.map((stage) => (
                              <span key={stage} className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                                {EVAL_TYPE_NAMES[stage]}
                              </span>
                            ))}
                            {orderedStages.length < 4 && (
                              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
                                {orderedStages.length}/4
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{row.totalCustomers}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{row.completedCustomers}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-red-700">{row.riskCustomers}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <Link
                            to="/admin/period-reports/$employeeId/$evalPeriod"
                            params={{ employeeId: row.employeeId, evalPeriod: row.evalPeriod }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            查看详情
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
