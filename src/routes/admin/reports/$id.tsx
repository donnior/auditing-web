import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import { CheckIcon, SpinnerIcon, CrossIcon, BackArrow } from '@/components/icons'

import { type WeeklyReportSummary, getWeeklyReportSummaryById } from '@/modules/reports/api'
import { EVAL_TYPE, type EvalType } from '@/constants'

import ReportItem from './_components/ReportItem'
import { daysBefore } from '@/lib/utils'

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

  console.log(v48hReport)

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

  const statusDisplay = getGenerationStatusDisplay(report.generating_status)

  const isFirstWeekReport = (report: WeeklyReportSummary) => report.eval_type === EVAL_TYPE.FIRST_WEEK

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
            <span className="ml-2 font-medium">{report.total_customers}</span>
          </div>
          {
            isFirstWeekReport(report) && (
              <>
                <div>
                  <span className="text-gray-600">48H应检:</span>
                  <span className="ml-2 font-medium">{v48hReport?.total_customers}</span>
                </div>
                <div>
                  <span className="text-gray-600">48H未到期:</span>
                  <span className="ml-2 font-medium">{report.total_customers - v48hReport?.total_customers}</span>
                </div>
              </>
            )
          }
          <div>
            <span className="text-gray-600">风险触发:</span>
            <span className="ml-2 font-medium text-red-500">{report.total_risk_word_trigger}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 mb-6 gap-6">
        <ReportItem title="总客户数" value={report.total_customers} />
        <ReportItem title="介绍全部完成人数" value={report.total_introduce_completed} total={report.total_customers} />
      </div>
      {
        isFirstWeekReport(report) && v48hReport && (
          <>
            <div className="text-base text-gray-500 mb-2">加微后48小时检测</div>
            <div className="grid grid-cols-3 mb-0 gap-6 bg-slate-200 p-4 rounded-t-lg">
              <ReportItem title="应检" value={v48hReport?.total_customers} />
              <ReportItem title="全部完成人数" value={v48hReport?.total_introduce_completed} total={v48hReport?.total_customers ?? 0} />
              <ReportItem title="最大掉步:索要订单号(未完成)" value={v48hReport?.total_customers - v48hReport?.total_order_check} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 bg-slate-200 p-4 rounded-b-lg">
              <ReportItem title="介绍课程总数" value={v48hReport?.total_introduce_course} total={v48hReport?.total_customers} />
              <ReportItem title="完成老师介绍人数" value={v48hReport?.total_introduce_teacher} total={v48hReport?.total_customers} />
              <ReportItem title="完成课表介绍人数" value={v48hReport?.total_introduce_schedule} total={v48hReport?.total_customers} />
              <ReportItem title="完成上课时间介绍人数" value={v48hReport?.total_introduce_course_time} total={v48hReport?.total_customers} />
              <ReportItem title="完成索要订单并核对人数" value={v48hReport?.total_order_check} total={v48hReport?.total_customers} />
            </div>
          </>
        )
      }
      {
        report.eval_type === 'WITHIN_48_HOURS' && (
          <>
            <div className="text-base text-gray-500 mb-2">介绍内容</div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 bg-slate-200 p-4 rounded-lg">
              <ReportItem title="介绍课程总数" value={report.total_introduce_course} total={report.total_customers} />
              <ReportItem title="完成老师介绍人数" value={report.total_introduce_teacher} total={report.total_customers} />
              <ReportItem title="完成课表介绍人数" value={report.total_introduce_schedule} total={report.total_customers} />
              <ReportItem title="完成上课时间介绍人数" value={report.total_introduce_course_time} total={report.total_customers} />
              <ReportItem title="完成索要订单并核对人数" value={report.total_order_check} total={report.total_customers} />
            </div>
          </>
        )
      }
      {report.eval_type !== 'WITHIN_48_HOURS' && (
        <>
          <div className="text-base text-gray-500 mb-2">常规检查</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 bg-slate-200 p-4 rounded-lg">
            <ReportItem title="完成资料发送人数" value={report.total_material_send} total={report.total_customers} />
            <ReportItem title="完成到课提醒人数" value={report.total_course_remind} total={report.total_customers} />
            <ReportItem title="完成课后作业发布人数" value={report.total_homework_publish} total={report.total_customers} />
            <ReportItem title="完成课后学习感受追踪人数" value={report.total_feedback_track} total={report.total_customers} />
            <ReportItem title="完成下周资料发送人数" value={report.total_week_material_send} total={report.total_customers} />
            <ReportItem title="发送周日螳螂销转链接人数" value={report.total_sunday_link_send} total={report.total_customers} />
            <ReportItem title="风险词触发人数" value={report.total_risk_word_trigger} total={report.total_customers} />
          </div>
        </>
      )}
      {/* 核心指标卡片 */}
      {/* <CustomAttributes report={report} /> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">服务评级</h3>
          {isReportCompleted ? (
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-bold`}>
                {report.report_rating}
              </span>
            </div>
          ) : isReportFailed ? (
            <div className="flex items-center justify-center h-16">
              <div className="text-center">
                <CrossIcon className="w-8 h-8 mx-auto text-red-400 mb-2" />
                <p className="text-red-500 text-sm">生成失败</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-16">
              <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
              <span className="ml-4 text-sm text-gray-500">分析中...</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">服务评分</h3>
          {isReportCompleted ? (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>0</span>
                  <span>10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(report.report_score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(report.report_score, 10)}`}>
                {report.report_score}
              </span>
            </div>
          ) : isReportFailed ? (
            <div className="flex items-center justify-center h-16">
              <div className="text-center">
                <CrossIcon className="w-8 h-8 mx-auto text-red-400 mb-2" />
                <p className="text-red-500 text-sm">生成失败</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-16">
              <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
              <span className="ml-4 text-sm text-gray-500">分析中...</span>
            </div>
          )}
        </div>
      </div>

      {isReportCompleted ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">报告摘要</h3>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report.report_summary}
            </ReactMarkdown>
          </div>
        </div>
      ) : isReportFailed ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">报告摘要</h3>
          <div className="flex items-center justify-center h-24 bg-red-50 rounded-lg border-2 border-red-100">
            <div className="text-center">
              <AlertTriangleIcon className="w-8 h-8 mx-auto text-red-400 mb-2" />
              <p className="text-red-600 text-sm font-medium">报告生成失败</p>
              <p className="text-red-500 text-xs mt-1">请联系技术支持或重新生成</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">报告摘要</h3>
          <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
            <div className="text-center">
              <SpinnerIcon className="w-8 h-8 mx-auto text-gray-400 mb-2 animate-spin" />
              <p className="text-gray-500 text-sm">正在生成报告摘要...</p>
            </div>
          </div>
        </div>
      )}

      {isReportCompleted ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">改进建议</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report.report_suggestions}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ) : isReportFailed ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">改进建议</h3>
          <div className="flex items-center justify-center h-24 bg-red-50 rounded-lg border-2 border-red-100">
            <div className="text-center">
              <AlertTriangleIcon className="w-8 h-8 mx-auto text-red-400 mb-2" />
              <p className="text-red-600 text-sm font-medium">改进建议生成失败</p>
              <p className="text-red-500 text-xs mt-1">请联系技术支持或重新生成</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">改进建议</h3>
          <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
            <div className="text-center">
              <SpinnerIcon className="w-8 h-8 mx-auto text-gray-400 mb-2 animate-spin" />
              <p className="text-gray-500 text-sm">正在生成改进建议...</p>
            </div>
          </div>
        </div>
      )} */}

      <div className='mb-4'></div>

    </div>
  )
}
