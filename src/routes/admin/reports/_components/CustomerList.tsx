import { createFileRoute, Link } from '@tanstack/react-router'


function RouteComponent() {
    const customerReports = [] as any
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">客户清单</h3>
                <span className="text-sm text-gray-500">共 {customerReports.length} 个客户</span>
            </div>
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
                                                    className={`w-4 h-4 ${i < Math.floor(customerReport.satisfaction_score)
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
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customerReport.violation_count === 0
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
    )
}
