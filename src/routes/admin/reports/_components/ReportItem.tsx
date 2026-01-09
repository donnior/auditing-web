import { createFileRoute } from '@tanstack/react-router'


const ReportItem = ({ title, value, total, isCompleted=true, isFailed=false }: { title: string, value: string | number, total?: number, isCompleted?: boolean, isFailed?: boolean }) => {
    return <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                {isCompleted ? (
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                ) : isFailed ? (
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
            {total !== undefined && total > 0 && (
                <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-sm text-gray-500">{Math.round(parseFloat(String(value)) * 100 / total)}%</span>
                </div>
            )}
        </div>
    </div>
}

export default ReportItem
