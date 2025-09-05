import { createFileRoute, Link } from '@tanstack/react-router'
import { getReportById, getCustomerReportsByAccountId } from '../../../api/mock/reports'
import { getChatSession } from '../../../api/mock/chats'
import type { Report, CustomerReport } from '../../../api/types'

export const Route = createFileRoute('/admin/reports/$id')({
  loader: async ({ params }) => {
    const { id } = params
    const report = await getReportById(id)
    if (!report) {
      throw new Error(`Report with id ${id} not found`)
    }
    const customerReports = getCustomerReportsByAccountId(report.qwAccountId)
    return {
      report,
      customerReports
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { report, customerReports } = Route.useLoaderData()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
      case 'completed':
        return {
          text: '已完成',
          color: 'bg-green-100 text-green-800',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        }
      case 'generating':
        return {
          text: '生成中',
          color: 'bg-blue-100 text-blue-800',
          icon: (
            <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )
        }
      case 'failed':
        return {
          text: '生成失败',
          color: 'bg-red-100 text-red-800',
          icon: (
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        }
      default:
        return {
          text: '未知',
          color: 'bg-gray-100 text-gray-800',
          icon: null
        }
    }
  }

  const isReportCompleted = report.generationStatus === 'completed'
  const isReportGenerating = report.generationStatus === 'generating'
  const isReportFailed = report.generationStatus === 'failed'

  const getScoreColor = (score: number, maxScore: number = 10) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 头部导航 */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/reports"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">报告详情</h1>
      </div>

      {/* 报告基本信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{report.qwAccountName} 的工作报告【2025/09/01】</h2>
            <p className="text-gray-600">账号ID: {report.qwAccountId}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* 生成状态 */}
            <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getGenerationStatusDisplay(report.generationStatus).color}`}>
              {getGenerationStatusDisplay(report.generationStatus).icon}
              {getGenerationStatusDisplay(report.generationStatus).text}
            </span>
            {/* 只有已完成的报告才显示绩效评级 */}
            {isReportCompleted && (
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPerformanceColor(report.performanceRating)}`}>
                {report.performanceRating}
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
            <span className="ml-2 font-medium">{formatDate(report.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">服务客户数</p>
              {isReportCompleted ? (
                <p className="text-2xl font-bold text-gray-900">{report.totalCustomers}</p>
              ) : isReportFailed ? (
                <div className="flex items-center">
                  <span className="text-xl font-bold text-red-500">--</span>
                  <span className="ml-2 text-sm text-red-500">生成失败</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  <span className="ml-2 text-sm text-gray-500">分析中...</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm.5 3.5h2.5a2.5 2.5 0 010 5h-2.5v-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">消息总数</p>
              {isReportCompleted ? (
                <p className="text-2xl font-bold text-gray-900">{report.totalMessages}</p>
              ) : isReportFailed ? (
                <div className="flex items-center">
                  <span className="text-xl font-bold text-red-500">--</span>
                  <span className="ml-2 text-sm text-red-500">生成失败</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  <span className="ml-2 text-sm text-gray-500">分析中...</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均响应时间</p>
              {isReportCompleted ? (
                <p className="text-2xl font-bold text-gray-900">{report.avgResponseTime}分钟</p>
              ) : isReportFailed ? (
                <div className="flex items-center">
                  <span className="text-xl font-bold text-red-500">--</span>
                  <span className="ml-2 text-sm text-red-500">生成失败</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  <span className="ml-2 text-sm text-gray-500">分析中...</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">违规次数</p>
              {isReportCompleted ? (
                <p className="text-2xl font-bold text-red-600">{report.totalViolations}</p>
              ) : isReportFailed ? (
                <div className="flex items-center">
                  <span className="text-xl font-bold text-red-500">--</span>
                  <span className="ml-2 text-sm text-red-500">生成失败</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  <span className="ml-2 text-sm text-gray-500">分析中...</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 评分指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">客户满意度</h3>
          {isReportCompleted ? (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>1.0</span>
                  <span>5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(report.overallSatisfaction / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(report.overallSatisfaction, 5)}`}>
                {report.overallSatisfaction}
              </span>
            </div>
          ) : isReportFailed ? (
            <div className="flex items-center justify-center h-16">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">服务质量评分</h3>
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
                    style={{ width: `${(report.serviceQualityScore / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(report.serviceQualityScore, 10)}`}>
                {report.serviceQualityScore}
              </span>
            </div>
          ) : isReportFailed ? (
            <div className="flex items-center justify-center h-16">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
          <p className="text-gray-700 leading-relaxed">{report.reportSummary}</p>
        </div>
      ) : isReportFailed ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">报告摘要</h3>
          <div className="flex items-center justify-center h-24 bg-red-50 rounded-lg border-2 border-red-100">
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
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
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
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
            <p className="text-gray-700 leading-relaxed">{report.improvementSuggestions}</p>
          </div>
        </div>
      ) : isReportFailed ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">改进建议</h3>
          <div className="flex items-center justify-center h-24 bg-red-50 rounded-lg border-2 border-red-100">
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
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
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
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
                         {customerReport.customerName}
                       </div>
                       <div className="text-sm text-gray-500">
                         ID: {customerReport.customerId}
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                       <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                       </svg>
                       <span className="text-sm font-medium text-gray-900">
                         {customerReport.messageCount}
                       </span>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                       <svg className="w-4 h-4 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       <span className="text-sm text-gray-900">
                         {customerReport.responseTimeAvg}分钟
                       </span>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center">
                       <div className="flex items-center">
                         {[...Array(5)].map((_, i) => (
                           <svg
                             key={i}
                             className={`w-4 h-4 ${
                               i < Math.floor(customerReport.satisfactionScore)
                                 ? 'text-yellow-400'
                                 : 'text-gray-300'
                             }`}
                             fill="currentColor"
                             viewBox="0 0 20 20"
                           >
                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                           </svg>
                         ))}
                       </div>
                       <span className="ml-2 text-sm text-gray-600">
                         {customerReport.satisfactionScore}
                       </span>
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`text-sm font-medium ${getScoreColor(customerReport.serviceQualityScore, 10)}`}>
                       {customerReport.serviceQualityScore}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                       customerReport.violationCount === 0
                         ? 'bg-green-100 text-green-800'
                         : customerReport.violationCount <= 2
                         ? 'bg-yellow-100 text-yellow-800'
                         : 'bg-red-100 text-red-800'
                     }`}>
                       {customerReport.violationCount === 0 ? '无违规' : `${customerReport.violationCount}次`}
                     </span>
                   </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(() => {
                      const chatSession = getChatSession(customerReport.qwAccountId, customerReport.customerId, '2024-09-01')
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

         {/* 汇总信息 */}
         {/* <div className="mt-6 border-t border-gray-200 pt-4">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="text-center">
               <div className="text-2xl font-bold text-blue-600">
                 {customerReports.reduce((sum, report) => sum + report.messageCount, 0)}
               </div>
               <div className="text-sm text-gray-600">总消息数</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-green-600">
                 {(customerReports.reduce((sum, report) => sum + report.responseTimeAvg, 0) / customerReports.length).toFixed(1)}分钟
               </div>
               <div className="text-sm text-gray-600">平均响应时间</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-yellow-600">
                 {(customerReports.reduce((sum, report) => sum + report.satisfactionScore, 0) / customerReports.length).toFixed(1)}
               </div>
               <div className="text-sm text-gray-600">平均满意度</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-red-600">
                 {customerReports.reduce((sum, report) => sum + report.violationCount, 0)}
               </div>
               <div className="text-sm text-gray-600">总违规次数</div>
             </div>
           </div>
         </div> */}
       </div>

      </div>
  )
}
