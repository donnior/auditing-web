export interface WeekPeriodOption {
  /** 周期结束日（YYYY-MM-DD），用于请求参数 evalPeriod */
  value: string
  /** UI 展示文本，比如 20260104 - 20260110 */
  label: string
  start: string
  end: string
}

function toYmd(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function toCompactYmd(ymd: string): string {
  return ymd.replace(/-/g, '')
}

/**
 * 生成“当前往前 N 周”的统计周期下拉选项。
 * - 默认按“周日”作为周期结束日（与常见周报口径一致）
 * - 每个周期长度为 7 天：start = end - 6 天
 */
export function getRecentWeekPeriodOptions(weeks = 8, now = new Date()): WeekPeriodOption[] {
  const dayOfWeek = now.getDay() // 0: Sunday
  const latestEnd = new Date(now)
  latestEnd.setHours(0, 0, 0, 0)
  latestEnd.setDate(latestEnd.getDate() - dayOfWeek)

  const out: WeekPeriodOption[] = []
  for (let i = 0; i < weeks; i++) {
    const endDate = new Date(latestEnd)
    endDate.setDate(latestEnd.getDate() - 7 * i)

    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6)

    const start = toYmd(startDate)
    const end = toYmd(endDate)
    out.push({
      value: end,
      start,
      end,
      // label: `${toCompactYmd(start)} - ${toCompactYmd(end)}`,
      label: `${toCompactYmd(end)}`,
    })
  }

  return out
}
