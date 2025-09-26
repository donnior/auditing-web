import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { getReports } from '@/api/reports'
import { formatDate } from '@/lib/utils'
import ReportsTable from './_components/ReportsTable'
import { BackArrow } from '@/components/icons'

const searchSchema = z.object({
  staff: z.string().optional(),
})

export const Route = createFileRoute('/admin/reports/')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { staff } = Route.useSearch()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 使用React Query获取报告数据
  const { data, isLoading, error } = useQuery({
    queryKey: ['reports', staff, currentPage, pageSize],
    queryFn: () => getReports(staff),
  })

  console.log('data', data)

  // 转换数据格式以适配表格组件
  const reports = data?.items?.map(report => ({
    id: report.id,
    title: `【${formatDate(report.cycleStartTime)}】${report.qwAccountName}`,
    staff: report.qwAccountName,
    period: formatDate(report.cycleStartTime),
    status: report.totalViolations > 3 ? '违规' : '正常',
    generationStatus: report.generationStatus,
    createdAt: formatDate(report.createdAt),
    views: Math.floor(Math.random() * 2000) + 500 // 随机生成浏览量
  }))

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          {staff && (
            <div className="mb-2">
              <Link
                to="/admin/staffs"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <BackArrow />
                返回员工管理
              </Link>
            </div>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">
            {staff ? `${staff} 的报告` : '所有报告'}
          </h1>
          {staff && (
            <p className="text-sm text-gray-600 mt-1">
              共找到 {data?.items?.length} 条报告记录
            </p>
          )}
        </div>
      </div>

      {data?.items && <ReportsTable
        data={data?.items}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />}
    </div>
  )
}
