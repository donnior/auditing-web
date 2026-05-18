import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { BackArrow } from '@/components/icons'
import { EVAL_TYPE, type EvalType } from '@/constants'
import { daysBefore } from '@/lib/utils'
import {
  type EvaluationDetail,
  type WeeklyReportSummary,
  getReports,
  getWeeklyReportSummaryDetails
} from '@/modules/reports/api'
import { EVAL_TYPE_NAMES } from '../../reports/_components/util'

export const Route = createFileRoute('/admin/period-reports/$employeeId/$evalPeriod')({
  component: RouteComponent,
})

type CardUser = {
  external_name?: string
  externalName?: string
  camp_tag?: string
  campTag?: string
}

type EvaluationDetailWithCard = EvaluationDetail & {
  card_user?: CardUser
  cardUser?: CardUser
}

type StageBundle = {
  summary: WeeklyReportSummary
  items: EvaluationDetail[]
}

type CampStageRow = {
  key: string
  campTag: string
  evalType: EvalType
  currentSummaryId: string
  currentCount: number
  previousCount?: number
  carryoverCount?: number
  churnedCount?: number
  newCount?: number
  riskCount: number
  serviceCompleteCount: number
}

type PeriodTotals = {
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

const PREVIOUS_STAGE: Partial<Record<EvalType, EvalType>> = {
  [EVAL_TYPE.SECOND_WEEK]: EVAL_TYPE.FIRST_WEEK,
  [EVAL_TYPE.THIRD_WEEK]: EVAL_TYPE.SECOND_WEEK,
  [EVAL_TYPE.FOURTH_WEEK]: EVAL_TYPE.THIRD_WEEK,
}

const SERVICE_DETAIL_FIELDS = [
  'has_material_send',
  'has_course_remind',
  'has_homework_publish',
  'has_feedback_track',
  'has_week_material_send',
  'has_sunday_link_send',
] as const

function getPageItems<T>(data?: { content?: T[]; items?: T[] }): T[] {
  return data?.content ?? data?.items ?? []
}

function formatPeriod(evalPeriod: string) {
  return `${daysBefore(evalPeriod, 6)} - ${evalPeriod}`
}

function getCardUser(item: EvaluationDetail): CardUser | undefined {
  const detail = item as EvaluationDetailWithCard
  return detail.card_user ?? detail.cardUser
}

function getCampTag(item: EvaluationDetail) {
  const cardUser = getCardUser(item)
  return cardUser?.camp_tag || cardUser?.campTag || '未标记'
}

function getCustomerName(item: EvaluationDetail) {
  const cardUser = getCardUser(item)
  return cardUser?.external_name || cardUser?.externalName || item.customer_name || item.customer_id
}

function getTotals(summaries: WeeklyReportSummary[]): PeriodTotals {
  return summaries.reduce(
    (acc, summary) => {
      acc.totalCustomers += summary.total_customers || 0
      acc.completedCustomers += summary.total_introduce_completed || 0
      acc.riskCustomers += summary.total_risk_word_trigger || 0
      return acc
    },
    { totalCustomers: 0, completedCustomers: 0, riskCustomers: 0 }
  )
}

function getDelta(current: number, previous?: number) {
  if (previous === undefined) return '-'
  const delta = current - previous
  if (delta > 0) return `+${delta}`
  return String(delta)
}

function getDeltaClass(current: number, previous?: number) {
  if (previous === undefined || current === previous) return 'text-gray-500'
  return current > previous ? 'text-blue-700' : 'text-orange-600'
}

function groupByCampTag(items: EvaluationDetail[]) {
  return items.reduce((acc, item) => {
    const campTag = getCampTag(item)
    const group = acc.get(campTag) ?? []
    group.push(item)
    acc.set(campTag, group)
    return acc
  }, new Map<string, EvaluationDetail[]>())
}

function getServiceCompleteCount(items: EvaluationDetail[]) {
  return items.filter((item) => SERVICE_DETAIL_FIELDS.every((field) => item[field] === 1)).length
}

function sortSummaries(summaries: WeeklyReportSummary[]) {
  return summaries
    .filter((summary) => summary.eval_type !== EVAL_TYPE.WITHIN_48_HOURS)
    .sort((a, b) => STAGE_ORDER.indexOf(a.eval_type as EvalType) - STAGE_ORDER.indexOf(b.eval_type as EvalType))
}

async function fetchBundles(summaries: WeeklyReportSummary[]): Promise<StageBundle[]> {
  const sorted = sortSummaries(summaries)
  return Promise.all(
    sorted.map(async (summary) => {
      const response = await getWeeklyReportSummaryDetails(
        summary.id,
        'totalCustomers',
        Math.max(200, summary.total_customers || 0)
      )
      return {
        summary,
        items: getPageItems<EvaluationDetail>(response),
      }
    })
  )
}

function buildCampRows(currentBundles: StageBundle[], previousBundles: StageBundle[]) {
  const previousByStage = new Map(previousBundles.map((bundle) => [bundle.summary.eval_type as EvalType, bundle]))

  return currentBundles.flatMap((bundle): CampStageRow[] => {
    const evalType = bundle.summary.eval_type as EvalType
    const previousEvalType = PREVIOUS_STAGE[evalType]
    const previousItemsForStage = previousEvalType
      ? previousByStage.get(previousEvalType)?.items ?? []
      : []
    const previousGroups = groupByCampTag(previousItemsForStage)
    const currentGroups = groupByCampTag(bundle.items)

    if (currentGroups.size === 0) {
      return [{
        key: `${bundle.summary.id}__empty`,
        campTag: '未标记',
        evalType,
        currentSummaryId: bundle.summary.id,
        currentCount: bundle.summary.total_customers || 0,
        riskCount: bundle.summary.total_risk_word_trigger || 0,
        serviceCompleteCount: 0,
      }]
    }

    return Array.from(currentGroups.entries()).map(([campTag, currentItems]) => {
      const previousItems = previousGroups.get(campTag) ?? []
      const currentIds = new Set(currentItems.map((item) => item.customer_id))
      const previousIds = new Set(previousItems.map((item) => item.customer_id))
      const carryoverCount = currentItems.filter((item) => previousIds.has(item.customer_id)).length
      const churnedCount = previousItems.filter((item) => !currentIds.has(item.customer_id)).length
      const newCount = currentItems.filter((item) => !previousIds.has(item.customer_id)).length

      return {
        key: `${bundle.summary.id}__${campTag}`,
        campTag,
        evalType,
        currentSummaryId: bundle.summary.id,
        currentCount: currentItems.length,
        previousCount: previousEvalType ? previousItems.length : undefined,
        carryoverCount: previousEvalType ? carryoverCount : undefined,
        churnedCount: previousEvalType ? churnedCount : undefined,
        newCount: previousEvalType ? newCount : undefined,
        riskCount: currentItems.filter((item) => item.has_risk_word_trigger === 1).length,
        serviceCompleteCount: getServiceCompleteCount(currentItems),
      }
    })
  })
}

function MetricCard({
  title,
  current,
  previous,
  description,
}: {
  title: string
  current: number
  previous?: number
  description: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-xs font-medium text-gray-500">{title}</div>
      <div className="mt-2 flex items-end gap-3">
        <div className="text-2xl font-semibold text-gray-950">{current}</div>
        <div className={`pb-1 text-sm font-semibold ${getDeltaClass(current, previous)}`}>
          {getDelta(current, previous)}
        </div>
      </div>
      <div className="mt-2 text-xs leading-5 text-gray-500">{description}</div>
    </div>
  )
}

function RouteComponent() {
  const { employeeId, evalPeriod } = Route.useParams()
  const previousEvalPeriod = daysBefore(evalPeriod, 7)

  const currentReportsQuery = useQuery({
    queryKey: ['periodReportSummaries', employeeId, evalPeriod],
    queryFn: () => getReports(undefined, employeeId, evalPeriod, undefined, 100),
  })

  const previousReportsQuery = useQuery({
    queryKey: ['periodReportSummaries', employeeId, previousEvalPeriod],
    queryFn: () => getReports(undefined, employeeId, previousEvalPeriod, undefined, 100),
  })

  const currentReports = useMemo(
    () => sortSummaries(getPageItems<WeeklyReportSummary>(currentReportsQuery.data)),
    [currentReportsQuery.data]
  )
  const previousReports = useMemo(
    () => sortSummaries(getPageItems<WeeklyReportSummary>(previousReportsQuery.data)),
    [previousReportsQuery.data]
  )

  const currentBundlesQuery = useQuery({
    queryKey: ['periodReportBundles', employeeId, evalPeriod, currentReports.map((item) => item.id).join(',')],
    queryFn: () => fetchBundles(currentReports),
    enabled: currentReports.length > 0,
  })

  const previousBundlesQuery = useQuery({
    queryKey: ['periodReportBundles', employeeId, previousEvalPeriod, previousReports.map((item) => item.id).join(',')],
    queryFn: () => fetchBundles(previousReports),
    enabled: previousReports.length > 0,
  })

  const currentTotals = useMemo(() => getTotals(currentReports), [currentReports])
  const previousTotals = useMemo(() => previousReports.length > 0 ? getTotals(previousReports) : undefined, [previousReports])
  const rows = useMemo(
    () => buildCampRows(currentBundlesQuery.data ?? [], previousBundlesQuery.data ?? []),
    [currentBundlesQuery.data, previousBundlesQuery.data]
  )
  const employeeName = currentReports[0]?.employee_name || previousReports[0]?.employee_name || employeeId
  const isLoading = currentReportsQuery.isLoading || previousReportsQuery.isLoading || currentBundlesQuery.isLoading || previousBundlesQuery.isLoading
  const isError = currentReportsQuery.isError || previousReportsQuery.isError || currentBundlesQuery.isError || previousBundlesQuery.isError

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/period-reports"
            className="mb-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <BackArrow />
            返回周期报告
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{employeeName} 的周期统计报告</h1>
          <p className="mt-1 text-sm text-gray-600">
            当前周期 {formatPeriod(evalPeriod)}，对比上一周期 {formatPeriod(previousEvalPeriod)}
          </p>
        </div>
        <Link
          to="/admin/reports"
          search={{ employeeId, evalPeriod }}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          查看阶段明细
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="总在服客户"
          current={currentTotals.totalCustomers}
          previous={previousTotals?.totalCustomers}
          description="当前周期四个阶段客户数合计"
        />
        <MetricCard
          title="全部完成人数"
          current={currentTotals.completedCustomers}
          previous={previousTotals?.completedCustomers}
          description="沿用现有全部完成统计口径"
        />
        <MetricCard
          title="风险触发人数"
          current={currentTotals.riskCustomers}
          previous={previousTotals?.riskCustomers}
          description="当前周期风险词触发客户数"
        />
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500">
          加载中...
        </div>
      )}

      {isError && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600">
          加载失败，请重试
        </div>
      )}

      {!isLoading && !isError && (
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">四期学员服务情况</h2>
              <p className="mt-1 text-sm text-gray-500">按期数 campTag 拆分当前周期四个阶段，并与上一周期同一期上一阶段对比。</p>
            </div>
            <div className="text-sm text-gray-500">共 {rows.length} 个期数阶段</div>
          </div>

          {rows.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-500">暂无数据</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">期数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">当前阶段</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">当前人数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">上周期人数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">承接</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">流失</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">新增/补入</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">服务全完成</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">风险触发</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rows.map((row) => (
                    <tr key={row.key} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">{row.campTag}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                          {EVAL_TYPE_NAMES[row.evalType]}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{row.currentCount}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{row.previousCount ?? '-'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-blue-700">{row.carryoverCount ?? '-'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-red-700">{row.churnedCount ?? '-'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{row.newCount ?? '-'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {row.serviceCompleteCount}/{row.currentCount}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-red-700">{row.riskCount}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <Link
                          to="/admin/reports/$id"
                          params={{ id: row.currentSummaryId }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          阶段详情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">当前周期客户样本</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-4">
            {(currentBundlesQuery.data ?? []).map((bundle) => (
              <div key={bundle.summary.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">{EVAL_TYPE_NAMES[bundle.summary.eval_type as EvalType]}</h3>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-700">
                    {bundle.items.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {bundle.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="truncate rounded-md bg-white px-3 py-2 text-sm text-gray-700">
                      {getCampTag(item)} · {getCustomerName(item)}
                    </div>
                  ))}
                  {bundle.items.length === 0 && (
                    <div className="rounded-md bg-white px-3 py-2 text-sm text-gray-500">暂无样本</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
