import { Link } from '@tanstack/react-router'
import { formatDate } from '@/lib/utils'
import type { Report } from '@/api/types'
import { Table, type TableColumn, type TableAction } from '@/components/Table'
import { SpinnerIcon, CheckIcon, CrossIcon } from '@/components/icons'

// 报告数据类型定义
export interface ReportItem {
  id: string
  title: string
  staff: string
  period: string
  generationStatus: 'COMPLETED' | 'PROCESSING' | 'FAILED'
  createdAt: string
  views?: number
}

interface ReportsTableProps {
  data: Report[]
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

  // 转换数据格式以适配表格组件
  const reports: ReportItem[] = data.map(report => ({
    id: report.id,
    title: `【${formatDate(report.cycle_start_time)}】${report.qw_account_name}`,
    staff: report.qw_account_name,
    period: formatDate(report.cycle_start_time),
    generationStatus: report.generating_status,
    createdAt: formatDate(report.create_time),
    views: Math.floor(Math.random() * 2000) + 500 // 随机生成浏览量
  }))

  // 生成状态渲染函数
  const renderGenerationStatus = (value: any, record: ReportItem) => (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
      record.generationStatus === 'COMPLETED'
        ? 'bg-green-100 text-green-800'
      : record.generationStatus === 'PROCESSING'
        ? 'bg-blue-100 text-blue-800'
        : 'bg-red-100 text-red-800'
    }`}>
      {record.generationStatus === 'PROCESSING' && <SpinnerIcon />}
      {record.generationStatus === 'COMPLETED' && <CheckIcon />}
      {record.generationStatus === 'FAILED' && <CrossIcon />}
      {record.generationStatus === 'COMPLETED' ? '已完成' : record.generationStatus === 'PROCESSING' ? '生成中' : '生成失败'}
      {/* {record.generationStatus} */}
    </span>
  )

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
      key: 'title',
      label: '报告名称',
      render: renderTitle
    },
    {
      key: 'staff',
      label: '员工'
    },
    {
      key: 'period',
      label: '报告周期'
    },
    {
      key: 'generationStatus',
      label: '生成状态',
      render: renderGenerationStatus
    },
    {
      key: 'createdAt',
      label: '生成时间'
    }
  ]

  // 定义操作按钮
  const actions: TableAction<ReportItem>[] = [
    {
      label: '查看',
      onClick: (record) => {
        console.log('查看报告:', record)
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
