import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createFileRoute, Link } from '@tanstack/react-router'

import { getReportById, getCustomerReportsByAccountId } from '@/modules/reports/api'
import { getChatSession } from '../../../api/mock/chats'

import { CustomAttributes } from './_components/CustomAttributes'
import { formatDate } from '@/lib/utils'
import { CheckIcon, SpinnerIcon, CrossIcon, BackArrow, AlertTriangleIcon, ClockIcon, MessageIcon, StarIcon } from '@/components/icons'

export const Route = createFileRoute('/admin/reports/$id')({
  loader: async ({ params }) => {
    const { id } = params
    const report = await getReportById(id)
    if (!report) {
      throw new Error(`Report with id ${id} not found`)
    }
    const customerReports = await getCustomerReportsByAccountId(report.qw_account_id, report.cycle_start_time, report.cycle_end_time)
    return {
      report,
      customerReports
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { report, customerReports } = Route.useLoaderData()

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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{report.qw_account_name} 的工作报告【2025/09/01】</h2>
            {/* <p className="text-gray-600">账号ID: {report.qw_account_id}</p> */}
          </div>
          <div className="flex items-center gap-3">
            {/* 生成状态 */}
            <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusDisplay.color}`}>
              {statusDisplay.icon}
              {statusDisplay.text}
            </span>
            {/* 只有已完成的报告才显示绩效评级 */}
            {isReportCompleted && (
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPerformanceColor(report.report_rating)}`}>
                {report.report_rating}
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
            <span className="text-gray-600">生成时间:</span>
            <span className="ml-2 font-medium">{formatDate(report.create_time)}</span>
          </div>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <CustomAttributes report={report} />

      {/* 评分指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

      {/* 报告摘要 */}
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

      {/* 改进建议 */}
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
      )}

      <div className='mb-4'></div>

      {/* 操作按钮 */}
             {/* 客户服务清单 */}
       <div className="bg-white rounded-lg border border-gray-200 p-6">
         <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-semibold text-gray-900">客户服务清单</h3>
           <span className="text-sm text-gray-500">共 {customerReports.length} 个客户</span>
         </div>

         {/* 客户报告表格 */}
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   客户信息
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   消息数量
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   响应时间
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   满意度
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   质量评分
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   违规次数
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   操作
                 </th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {customerReports.map((customerReport) => (
                 <tr key={customerReport.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div>
                       <div className="text-sm font-medium text-gray-900">
                         {customerReport.customer_name}
                       </div>
                       <div className="text-sm text-gray-500">
                         ID: {customerReport.customer_id}
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                       <MessageIcon className="w-4 h-4 text-blue-500 mr-2" />
                       <span className="text-sm font-medium text-gray-900">
                         {customerReport.message_count}
                       </span>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                       <ClockIcon className="w-4 h-4 text-yellow-500 mr-2" />
                       <span className="text-sm text-gray-900">
                         {customerReport.response_time_avg}分钟
                       </span>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                       <div className="flex items-center">
                         {[...Array(5)].map((_, i) => (
                           <StarIcon
                             key={i}
                             className={`w-4 h-4 ${
                               i < Math.floor(customerReport.satisfaction_score)
                                 ? 'text-yellow-400'
                                 : 'text-gray-300'
                             }`}
                           />
                         ))}
                       </div>
                       <span className="ml-2 text-sm text-gray-600">
                         {customerReport.satisfaction_score}
                       </span>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`text-sm font-medium ${getScoreColor(customerReport.service_quality_score, 10)}`}>
                       {customerReport.service_quality_score}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                       customerReport.violation_count === 0
                         ? 'bg-green-100 text-green-800'
                         : customerReport.violation_count <= 2
                         ? 'bg-yellow-100 text-yellow-800'
                         : 'bg-red-100 text-red-800'
                     }`}>
                       {customerReport.violation_count === 0 ? '无违规' : `${customerReport.violation_count}次`}
                     </span>
                   </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(() => {
                      const chatSession = getChatSession(customerReport.qw_account_id, customerReport.customer_id, '2024-09-01')
                      return chatSession ? (
                        <Link
                          to="/admin/chat/$sessionId"
                          params={{ sessionId: chatSession.id }}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          查看聊天详情
                        </Link>
                      ) : (
                        <span className="text-gray-400 mr-3">无聊天记录</span>
                      )
                    })()}
                    {/* <button className="text-gray-600 hover:text-gray-800">
                      导出
                    </button> */}
                  </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>

      </div>
  )
}
