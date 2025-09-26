import React from 'react'

// 通用的表格列定义
export interface TableColumn<T = any> {
  key: string
  label: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (value: any, record: T, index: number) => React.ReactNode
  className?: string
}

// 表格操作按钮定义
export interface TableAction<T = any> {
  label: string
  onClick: (record: T, index: number) => void
  className?: string
  disabled?: (record: T) => boolean
  icon?: React.ReactNode
}

// 表格组件属性
export interface TableProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  empty?: React.ReactNode
  rowKey?: string | ((record: T) => string)
  showCheckbox?: boolean
  selectedKeys?: string[]
  onSelectChange?: (selectedKeys: string[], selectedRows: T[]) => void
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void
  onRowClick?: (record: T, index: number) => void
  actions?: TableAction<T>[]
  actionsTitle?: string
  className?: string
  tableClassName?: string
  headerClassName?: string
  bodyClassName?: string
  rowClassName?: string | ((record: T, index: number) => string)
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: (total: number, range: [number, number]) => React.ReactNode
  }
}

// 获取记录的唯一键值
function getRowKey<T>(record: T, index: number, rowKey?: string | ((record: T) => string)): string {
  if (typeof rowKey === 'function') {
    return rowKey(record)
  }
  if (typeof rowKey === 'string') {
    return (record as any)[rowKey]
  }
  return (record as any).id || index.toString()
}

// 获取嵌套对象的值
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

export function Table<T = any>({
  data,
  columns,
  loading = false,
  empty,
  rowKey,
  showCheckbox = false,
  selectedKeys = [],
  onSelectChange,
  onSelectAll,
  onRowClick,
  actions = [],
  actionsTitle = '操作',
  className = '',
  tableClassName = '',
  headerClassName = '',
  bodyClassName = '',
  rowClassName = '',
  pagination
}: TableProps<T>) {
  // 处理全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectAll || !onSelectChange) return

    const allKeys = data.map((record, index) => getRowKey(record, index, rowKey))
    const newSelectedKeys = checked ? allKeys : []
    const newSelectedRows = checked ? data : []
    const changeRows = checked ? data : data.filter((_, index) => selectedKeys.includes(getRowKey(data[index], index, rowKey)))

    onSelectAll(checked, newSelectedRows, changeRows)
    onSelectChange(newSelectedKeys, newSelectedRows)
  }

  // 处理单行选择
  const handleRowSelect = (record: T, index: number, checked: boolean) => {
    if (!onSelectChange) return

    const key = getRowKey(record, index, rowKey)
    const newSelectedKeys = checked
      ? [...selectedKeys, key]
      : selectedKeys.filter(k => k !== key)

    const newSelectedRows = data.filter((_, idx) => {
      const recordKey = getRowKey(data[idx], idx, rowKey)
      return newSelectedKeys.includes(recordKey)
    })

    onSelectChange(newSelectedKeys, newSelectedRows)
  }

  // 检查是否全选
  const isAllSelected = showCheckbox && data.length > 0 &&
    data.every((record, index) => selectedKeys.includes(getRowKey(record, index, rowKey)))

  // 检查是否部分选择
  const isIndeterminate = showCheckbox && selectedKeys.length > 0 && !isAllSelected

  // 渲染加载状态
  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </div>
        </div>
      </div>
    )
  }

  // 渲染空状态
  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center h-64">
          {empty || (
            <div className="text-center text-gray-500">
              <div className="mb-2">暂无数据</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 渲染单元格内容
  const renderCellContent = (column: TableColumn<T>, record: T, index: number) => {
    const value = getNestedValue(record, column.key)

    if (column.render) {
      return column.render(value, record, index)
    }

    return <span className="text-sm text-gray-900">{value}</span>
  }

  // 渲染行类名
  const getRowClassName = (record: T, index: number) => {
    const baseClass = "hover:bg-gray-50 transition-colors"
    const clickableClass = onRowClick ? "cursor-pointer" : ""
    const customClass = typeof rowClassName === 'function'
      ? rowClassName(record, index)
      : rowClassName

    return `${baseClass} ${clickableClass} ${customClass}`.trim()
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${tableClassName}`}>
          <thead className={`bg-gray-50 ${headerClassName}`}>
            <tr>
              {showCheckbox && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {actionsTitle}
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`bg-white divide-y divide-gray-200 ${bodyClassName}`}>
            {data.map((record, index) => {
              const key = getRowKey(record, index, rowKey)
              const isSelected = selectedKeys.includes(key)

              return (
                <tr
                  key={key}
                  className={getRowClassName(record, index)}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {showCheckbox && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleRowSelect(record, index, e.target.checked)
                        }}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-${column.align || 'left'}`}
                    >
                      {renderCellContent(column, record, index)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {actions.map((action, actionIndex) => {
                          const isDisabled = action.disabled?.(record) || false

                          return (
                            <button
                              key={actionIndex}
                              className={`${action.className || 'text-blue-600 hover:text-blue-800'} ${
                                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={isDisabled}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!isDisabled) {
                                  action.onClick(record, index)
                                }
                              }}
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {action.label}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 分页器 */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            {pagination.showTotal
              ? pagination.showTotal(pagination.total, [
                  (pagination.current - 1) * pagination.pageSize + 1,
                  Math.min(pagination.current * pagination.pageSize, pagination.total)
                ])
              : `显示 ${(pagination.current - 1) * pagination.pageSize + 1} 到 ${Math.min(pagination.current * pagination.pageSize, pagination.total)} 条，共 ${pagination.total} 条记录`
            }
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.current <= 1}
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
            >
              上一页
            </button>
            <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md">
              {pagination.current}
            </span>
            <button
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
