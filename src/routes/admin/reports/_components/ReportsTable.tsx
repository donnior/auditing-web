import { Link, useNavigate } from '@tanstack/react-router'
import { daysBefore } from '@/lib/utils'
import type { WeeklyReportSummary } from '@/modules/reports/api'
import { Table, type TableColumn, type TableAction } from '@/components/Table'
import { EVAL_TYPE_NAMES } from './util'
import type { EvalType } from '@/constants';

export interface ReportItem {
  id: string
  title: string
  staff: string
  period: string,
  total_customers: number,
  has_introduce_course_ratio: number
}

interface ReportsTableProps {
  data: WeeklyReportSummary[]
  isLoading: boolean
  error: any
  currentPage: number
  pageSize: number
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
}

function ReportsTable({
  data,
  isLoading,
  error,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize
}: ReportsTableProps) {
  const navigate = useNavigate()

  const reports: ReportItem[] = data.map(report => ({
    id: report.id,
    title: `${EVAL_TYPE_NAMES[report.eval_type as EvalType] || '未知'}`,
    staff: report.employee_name,
    period: `${report.eval_period}`,
    total_customers: report.total_customers,
    has_introduce_course_ratio: report.total_introduce_completed,
  }))

  // const renderGenerationStatus = (value: any, record: ReportItem) => (
  //   <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
  //     record.generationStatus === 'COMPLETED'
  //       ? 'bg-green-100 text-green-800'
  //     : record.generationStatus === 'PROCESSING'
  //       ? 'bg-blue-100 text-blue-800'
  //       : 'bg-red-100 text-red-800'
  //   }`}>
  //     {record.generationStatus === 'PROCESSING' && <SpinnerIcon />}
  //     {record.generationStatus === 'COMPLETED' && <CheckIcon />}
  //     {record.generationStatus === 'FAILED' && <CrossIcon />}
  //     {record.generationStatus === 'COMPLETED' ? '已完成' : record.generationStatus === 'PROCESSING' ? '生成中' : '生成失败'}
  //     {/* {record.generationStatus} */}
  //   </span>
  // )

  // 报告标题渲染函数
  const renderTitle = (value: any, record: ReportItem) => (
    <Link
      to="/admin/reports/$id"
      params={{ id: record.id }}
      className="text-blue-600 hover:text-blue-800 font-medium"
    >
      {record.title}
    </Link>
  )

  // 定义表格列配置
  const columns: TableColumn<ReportItem>[] = [
    {
      key: 'staff',
      label: '员工'
    },
    {
      key: 'period',
      label: '统计周期',
      render: (value: any, record: ReportItem) => {
        return <span>
          <span className='rounded-full px-2 py-1 text-xs  bg-gray-400 text-white'>
            {daysBefore(record.period, 6)}
          </span>
          <span className='text-gray-500 px-1'>-</span>
          <span className='rounded-full px-2 py-1 text-xs bg-gray-400 text-white'>
            {record.period}
          </span>
        </span>
      }
    },
    {
      key: 'title',
      label: '报告类型',
      render: (value: any, record: ReportItem) => (
        <span className='rounded-full px-2 py-1 text-xs font-semibold bg-gray-400 text-white'>
          {value}
        </span>
      )
    },
    {
      key: 'total_customers',
      label: '总客户数',
    },
    {
      key: 'has_introduce_course_ratio',
      label: '完全完成人数',
      render: (value: any, record: ReportItem) => {
        return `${record.has_introduce_course_ratio}`
      }
    }
  ]

  // 定义操作按钮
  const actions: TableAction<ReportItem>[] = [
    {
      label: '查看详情',
      onClick: (record) => {
        navigate({ to: '/admin/reports/$id', params: { id: record.id } })
      },
      className: 'text-blue-600 hover:text-blue-800'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">加载失败，请重试</div>
      </div>
    )
  }

  return (
    <Table<ReportItem>
        data={reports}
        columns={columns}
        actions={actions}
        loading={isLoading}
        showCheckbox={true}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: reports.length, // 实际应用中这里应该是从后端获取的总数
          onChange: (page, size) => {
            setCurrentPage(page)
            if (size !== pageSize) {
              setPageSize(size)
            }
          },
          showTotal: (total, range) =>
            `显示 ${range[0]} 到 ${range[1]} 条，共 ${total} 条记录`
        }}
      />
  )
}

export default ReportsTable
