import { createFileRoute, Link } from '@tanstack/react-router'
import { getChatSessionById } from '../../../api/mock/chats'
import type { ChatSession, ChatMessage } from '../../../api/types'

export const Route = createFileRoute('/admin/chat/$sessionId')({
  loader: async ({ params }) => {
    const { sessionId } = params
    const session = getChatSessionById(sessionId)
    if (!session) {
      throw new Error(`Chat session with id ${sessionId} not found`)
    }
    return { session }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = Route.useLoaderData()

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderMessage = (message: ChatMessage) => {
    const isStaff = message.senderType === 'staff'

    return (
      <div key={message.id} className={`flex ${isStaff ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isStaff
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}>
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isStaff ? 'text-blue-100' : 'text-gray-600'}`}>
              {message.senderName}
            </span>
          </div>
          <p className="text-sm mb-1">{message.content}</p>
          <div className={`text-xs ${isStaff ? 'text-blue-100' : 'text-gray-500'} text-right`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* 头部导航 */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/reports"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回报告列表
        </Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">聊天详情</h1>
      </div>

      {/* 聊天会话信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {session.qwAccountName} 与 {session.customerName} 的聊天记录
            </h2>
            <p className="text-gray-600">
              {formatDate(session.sessionDate)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {session.totalMessages} 条消息
            </span>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{session.staffMessages}</div>
            <div className="text-gray-600">员工消息</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{session.customerMessages}</div>
            <div className="text-gray-600">客户消息</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{session.avgResponseTime}分钟</div>
            <div className="text-gray-600">平均响应时间</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">{session.violationCount}</div>
            <div className="text-gray-600">违规次数</div>
          </div>
        </div>

        {session.satisfactionScore && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-800">客户满意度:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(session.satisfactionScore!)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-green-800 font-medium">
                  {session.satisfactionScore}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 聊天消息 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">对话内容</h3>
        </div>
        <div className="p-6  overflow-y-auto">
          {session.messages.length > 0 ? (
            session.messages.map(renderMessage)
          ) : (
            <div className="text-center py-8 text-gray-500">
              暂无聊天记录
            </div>
          )}
        </div>
      </div>

      {/* 违规统计 */}
      {/* {session.hasViolations && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">违规记录</h3>
          <div className="space-y-3">
            {session.messages
              .filter(msg => msg.hasViolation)
              .map(msg => (
                <div key={msg.id} className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-red-800">{msg.senderName}</span>
                    <span className="text-xs text-red-600">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{msg.content}</p>
                  <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                    违规类型: {msg.violationType}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )} */}

      {/* 操作按钮 */}
      <div className="mt-6 flex justify-center gap-4">
        {/* <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
          导出聊天记录
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
          标记为已处理
        </button> */}
      </div>
    </div>
  )
}
