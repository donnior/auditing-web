import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'

import { CheckIcon, SpinnerIcon, CrossIcon, BackArrow } from '@/components/icons'

import { type WeeklyReportSummary, type EvaluationDetail, getWeeklyReportSummaryById, getWeeklyReportSummaryDetails } from '@/modules/reports/api'
import { EVAL_TYPE, type EvalType } from '@/constants'

import ReportItem from './_components/ReportItem'
import { daysBefore, formatDateTime } from '@/lib/utils'

function WeeklyReportDetailModal({
  open,
  title,
  total,
  items,
  isLoading,
  isError,
  onClose,
}: {
  open: boolean
  title: string
  total: number
  items: EvaluationDetail[]
  isLoading: boolean
  isError: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto z-10">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}详情</h3>
            <p className="text-xs text-gray-500 mt-1">共 {total} 条</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {isLoading && (
            <div className="text-sm text-gray-500">加载中...</div>
          )}
          {isError && (
            <div className="text-sm text-red-500">加载失败，请稍后重试</div>
          )}
          {!isLoading && !isError && (
            <div className="max-h-[60vh] overflow-auto border border-gray-100 rounded-lg">
              {items.length === 0 ? (
                <div className="text-sm text-gray-500 p-4">暂无详情数据</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        客户ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        客户名称
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        评估时间
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        风险触发
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.customer_id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.card_user?.external_name || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateTime(item.eval_time) || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.has_risk_word_trigger === 1 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.has_risk_word_trigger === 1 ? '是' : '否'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/admin/reports/$id')({
  loader: async ({ params }) => {
    const { id } = params
    const report = await getWeeklyReportSummaryById(id)
    if (!report) {
      throw new Error(`Report with id ${id} not found`)
    }
    return {
      report,
    }
  },
  component: RouteComponent,
})

import { EVAL_TYPE_NAMES } from './_components/util'

function RouteComponent() {
  const { report } = Route.useLoaderData()

  const { data: v48hReport } = useQuery({
    queryKey: ['customerReports', report.id],
    queryFn: () => getWeeklyReportSummaryById(report.id.replace(EVAL_TYPE.FIRST_WEEK, EVAL_TYPE.WITHIN_48_HOURS)),
    enabled: report.eval_type === EVAL_TYPE.FIRST_WEEK,
  })
  type DetailModalState = {
    title: string
    reportId: string
    metric: string
    mode?: 'api' | 'notWithin48Hours' | 'missingOrderCheck'
    compareReportId?: string
  }

  const [detailModal, setDetailModal] = useState<DetailModalState | null>(null)

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case '优秀':
        return 'bg-green-100 text-green-800'
      case '良好':
        return 'bg-blue-100 text-blue-800'
      case '合格':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getGenerationStatusDisplay = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          text: '已完成',
          color: 'bg-green-100 text-green-800',
          icon: <CheckIcon className="w-4 h-4 mr-2" />
        }
      case 'PROCESSING':
        return {
          text: '生成中',
          color: 'bg-blue-100 text-blue-800',
          icon: (
            <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />
          )
        }
      case 'FAILED':
        return {
          text: '生成失败',
          color: 'bg-red-100 text-red-800',
          icon: <CrossIcon className="w-4 h-4 mr-2" />
        }
      default:
        return {
          text: '未知',
          color: 'bg-gray-100 text-gray-800',
          icon: null
        }
    }
  }

  const isReportCompleted = report.generating_status === 'COMPLETED' || true
  const isReportGenerating = report.generating_status === 'PROCESSING'
  const isReportFailed = report.generating_status === 'FAILED'

  const getScoreColor = (score: number, maxScore: number = 10) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const statusDisplay = getGenerationStatusDisplay(report.generating_status ?? 'COMPLETED')

  const isFirstWeekReport = (report: WeeklyReportSummary) => report.eval_type === EVAL_TYPE.FIRST_WEEK

  const getDetailItems = (data?: { content?: EvaluationDetail[], items?: EvaluationDetail[] }) => {
    return data?.content ?? data?.items ?? []
  }

  const detailQuery = useQuery({
    queryKey: ['weeklyReportDetails', detailModal?.reportId, detailModal?.metric, detailModal?.mode, detailModal?.compareReportId],
    queryFn: async () => {
      if (!detailModal) {
        return { content: [], total_elements: 0 }
      }
      if (detailModal.mode === 'notWithin48Hours') {
        const [allResponse, withinResponse] = await Promise.all([
          getWeeklyReportSummaryDetails(detailModal.reportId, 'totalCustomers'),
          getWeeklyReportSummaryDetails(detailModal.compareReportId ?? '', 'totalCustomers')
        ])
        const allItems = getDetailItems(allResponse)
        const withinItems = getDetailItems(withinResponse)
        const withinIds = new Set(withinItems.map((item) => item.customer_id))
        const filtered = allItems.filter((item) => !withinIds.has(item.customer_id))
        return { content: filtered, total_elements: filtered.length }
      }
      if (detailModal.mode === 'missingOrderCheck') {
        const allResponse = await getWeeklyReportSummaryDetails(detailModal.reportId, 'totalCustomers')
        const allItems = getDetailItems(allResponse)
        const filtered = allItems.filter((item) => item.has_order_check !== 1)
        return { content: filtered, total_elements: filtered.length }
      }
      return getWeeklyReportSummaryDetails(detailModal.reportId, detailModal.metric)
    },
    enabled: !!detailModal
  })

  const detailItems = getDetailItems(detailQuery.data)

  const openDetailModal = (payload: DetailModalState) => {
    setDetailModal(payload)
  }

  const closeDetailModal = () => setDetailModal(null)

  const DetailReportItem = ({
    title,
    value,
    total,
    reportId,
    metric,
    mode,
    compareReportId
  }: {
    title: string
    value: string | number
    total?: number
    reportId: string
    metric: string
    mode?: DetailModalState['mode']
    compareReportId?: string
  }) => (
    <button
      type="button"
      className="w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
      onClick={() => openDetailModal({ title, reportId, metric, mode, compareReportId })}
    >
      <ReportItem
        title={title}
        value={value}
        total={total}
        valueClassName="text-blue-700 bg-blue-50 px-2 py-0.5 rounded group-hover:bg-blue-100 group-hover:text-blue-800"
      />
    </button>
  )

  return (
    <div className="max-w-6xl mx-auto">
      {/* 头部导航 */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/reports"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <BackArrow />
          返回列表
        </Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">报告详情</h1>
      </div>

      {/* 报告基本信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{report.employee_name} 的质检报告</h2>
            {/* <p className="text-gray-600">账号ID: {report.qw_account_id}</p> */}
          </div>
          <div className="flex items-center gap-3">
            {/* 生成状态 */}
            <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusDisplay.color}`}>
              {/* {statusDisplay.icon}
              {statusDisplay.text} */}
            </span>
            {/* 只有已完成的报告才显示绩效评级 */}
            {isReportCompleted && (
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-400 text-white`}>
                {EVAL_TYPE_NAMES[report.eval_type as EvalType]}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* <div>
            <span className="text-gray-600">报告周期:</span>
            <span className="ml-2 font-medium">
              {formatDate(report.cycleStartTime)} - {formatDate(report.cycleEndTime)}
            </span>
          </div> */}
          <div>
            <span className="text-gray-600">统计周期:</span>
            <span className="ml-2 font-medium border-gray-300 border rounded-full px-2 py-0.5">
               {daysBefore(report.eval_period, 6).replace(/-/g, '')} - {report.eval_period.replace(/-/g, '')}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mt-2">
          <div>
            <span className="text-gray-600">用户数:</span>
            <button
              type="button"
              className="ml-2 font-medium text-left hover:text-blue-600"
              onClick={() => openDetailModal({ title: '用户数', reportId: report.id, metric: 'totalCustomers' })}
            >
              {report.total_customers}
            </button>
          </div>
          {
            isFirstWeekReport(report) && (
              <>
                <div>
                  <span className="text-gray-600">48H应检:</span>
                  <button
                    type="button"
                    className="ml-2 font-medium text-left hover:text-blue-600 disabled:text-gray-400"
                    onClick={() => v48hReport && openDetailModal({ title: '48H应检', reportId: v48hReport.id, metric: 'totalCustomers' })}
                    disabled={!v48hReport}
                  >
                    {v48hReport?.total_customers}
                  </button>
                </div>
                <div>
                  <span className="text-gray-600">48H未到期:</span>
                  <button
                    type="button"
                    className="ml-2 font-medium text-left hover:text-blue-600 disabled:text-gray-400"
                    onClick={() => v48hReport && openDetailModal({
                      title: '48H未到期',
                      reportId: report.id,
                      metric: 'totalCustomers',
                      mode: 'notWithin48Hours',
                      compareReportId: v48hReport.id
                    })}
                    disabled={!v48hReport}
                  >
                    {report.total_customers - (v48hReport?.total_customers ?? 0)}
                  </button>
                </div>
              </>
            )
          }
          <div>
            <span className="text-gray-600">风险触发:</span>
            <button
              type="button"
              className="ml-2 font-medium text-red-500 hover:text-red-600"
              onClick={() => openDetailModal({ title: '风险触发', reportId: report.id, metric: 'totalRiskWordTrigger' })}
            >
              {report.total_risk_word_trigger}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 mb-6 gap-6">
        <DetailReportItem title="总客户数" value={report.total_customers} reportId={report.id} metric="totalCustomers" />
        <DetailReportItem title="介绍全部完成人数" value={report.total_introduce_completed} total={report.total_customers} reportId={report.id} metric="totalIntroduceCompleted" />
      </div>
      {
        isFirstWeekReport(report) && v48hReport && (
          <>
            <div className="text-base text-gray-500 mb-2">加微后48小时检测</div>
            <div className="grid grid-cols-3 mb-0 gap-6 bg-slate-200 p-4 rounded-t-lg">
              <DetailReportItem title="应检" value={v48hReport?.total_customers} reportId={v48hReport.id} metric="totalCustomers" />
              <DetailReportItem title="全部完成人数" value={v48hReport?.total_introduce_completed} total={v48hReport?.total_customers ?? 0} reportId={v48hReport.id} metric="totalIntroduceCompleted" />
              <DetailReportItem
                title="最大掉步:索要订单号(未完成)"
                value={v48hReport?.total_customers - v48hReport?.total_order_check}
                reportId={v48hReport.id}
                metric="totalCustomers"
                mode="missingOrderCheck"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 bg-slate-200 p-4 rounded-b-lg">
              <DetailReportItem title="介绍课程总数" value={v48hReport?.total_introduce_course} total={v48hReport?.total_customers} reportId={v48hReport.id} metric="totalIntroduceCourse" />
              <DetailReportItem title="完成老师介绍人数" value={v48hReport?.total_introduce_teacher} total={v48hReport?.total_customers} reportId={v48hReport.id} metric="totalIntroduceTeacher" />
              <DetailReportItem title="完成课表介绍人数" value={v48hReport?.total_introduce_schedule} total={v48hReport?.total_customers} reportId={v48hReport.id} metric="totalIntroduceSchedule" />
              <DetailReportItem title="完成上课时间介绍人数" value={v48hReport?.total_introduce_course_time} total={v48hReport?.total_customers} reportId={v48hReport.id} metric="totalIntroduceCourseTime" />
              <DetailReportItem title="完成索要订单并核对人数" value={v48hReport?.total_order_check} total={v48hReport?.total_customers} reportId={v48hReport.id} metric="totalOrderCheck" />
            </div>
          </>
        )
      }
      {
        report.eval_type === 'WITHIN_48_HOURS' && (
          <>
            <div className="text-base text-gray-500 mb-2">介绍内容</div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 bg-slate-200 p-4 rounded-lg">
              <DetailReportItem title="介绍课程总数" value={report.total_introduce_course} total={report.total_customers} reportId={report.id} metric="totalIntroduceCourse" />
              <DetailReportItem title="完成老师介绍人数" value={report.total_introduce_teacher} total={report.total_customers} reportId={report.id} metric="totalIntroduceTeacher" />
              <DetailReportItem title="完成课表介绍人数" value={report.total_introduce_schedule} total={report.total_customers} reportId={report.id} metric="totalIntroduceSchedule" />
              <DetailReportItem title="完成上课时间介绍人数" value={report.total_introduce_course_time} total={report.total_customers} reportId={report.id} metric="totalIntroduceCourseTime" />
              <DetailReportItem title="完成索要订单并核对人数" value={report.total_order_check} total={report.total_customers} reportId={report.id} metric="totalOrderCheck" />
            </div>
          </>
        )
      }
      {report.eval_type !== 'WITHIN_48_HOURS' && (
        <>
          <div className="text-base text-gray-500 mb-2">常规检查</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 bg-slate-200 p-4 rounded-lg">
            <DetailReportItem title="完成资料发送人数" value={report.total_material_send} total={report.total_customers} reportId={report.id} metric="totalMaterialSend" />
            <DetailReportItem title="完成到课提醒人数" value={report.total_course_remind} total={report.total_customers} reportId={report.id} metric="totalCourseRemind" />
            <DetailReportItem title="完成课后作业发布人数" value={report.total_homework_publish} total={report.total_customers} reportId={report.id} metric="totalHomeworkPublish" />
            <DetailReportItem title="完成课后学习感受追踪人数" value={report.total_feedback_track} total={report.total_customers} reportId={report.id} metric="totalFeedbackTrack" />
            <DetailReportItem title="完成下周资料发送人数" value={report.total_week_material_send} total={report.total_customers} reportId={report.id} metric="totalWeekMaterialSend" />
            <DetailReportItem title="发送周日螳螂销转链接人数" value={report.total_sunday_link_send} total={report.total_customers} reportId={report.id} metric="totalSundayLinkSend" />
            <DetailReportItem title="风险词触发人数" value={report.total_risk_word_trigger} total={report.total_customers} reportId={report.id} metric="totalRiskWordTrigger" />
          </div>
        </>
      )}

      <WeeklyReportDetailModal
        open={!!detailModal}
        title={detailModal?.title ?? ''}
        total={(detailQuery.data?.total_elements ?? detailItems.length) as number}
        items={detailItems}
        isLoading={detailQuery.isLoading}
        isError={detailQuery.isError}
        onClose={closeDetailModal}
      />

      <div className='mb-4'></div>
    </div>
  )
}
