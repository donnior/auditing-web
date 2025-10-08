import type { Report } from '@/api/types'

interface CustomAttributesProps {
  report: Report
}

export function CustomAttributes({ report }: CustomAttributesProps) {

  const isReportCompleted = report?.generating_status === 'COMPLETED'
  const isReportFailed = report?.generating_status === 'FAILED'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* 服务客户数 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">服务客户数</p>
            {isReportCompleted ? (
              <p className="text-2xl font-bold text-gray-900">{report.attributes?.total_customers}</p>
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

      {/* 消息总数 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">消息总数</p>
            {isReportCompleted ? (
              <p className="text-2xl font-bold text-gray-900">{report.attributes?.total_messages}</p>
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

      {/* 平均响应时间 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">平均响应时间</p>
            {isReportCompleted ? (
              <p className="text-2xl font-bold text-gray-900">{report.attributes?.avg_time}分钟</p>
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

      {/* 违规次数 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">违规次数</p>
            {isReportCompleted ? (
              <p className="text-2xl font-bold text-red-600">{report.attributes?.total_violations}</p>
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
  )
}
