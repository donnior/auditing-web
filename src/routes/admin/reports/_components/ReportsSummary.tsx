import { useMemo } from 'react'

import type { WeeklyReportSummary } from '@/modules/reports/api'

interface ReportsSummaryProps {
  data: WeeklyReportSummary[]
  evalPeriod: string
}

function ReportsSummary({ data, evalPeriod }: ReportsSummaryProps) {
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.totalCustomers += item.total_customers || 0
        acc.completedCustomers += item.total_introduce_completed || 0
        acc.riskWordTriggers += item.total_risk_word_trigger || 0
        acc.materialSend += item.total_material_send || 0
        acc.courseRemind += item.total_course_remind || 0
        acc.homeworkPublish += item.total_homework_publish || 0
        acc.feedbackTrack += item.total_feedback_track || 0
        acc.weekMaterialSend += item.total_week_material_send || 0
        acc.sundayLinkSend += item.total_sunday_link_send || 0
        return acc
      },
      {
        totalCustomers: 0,
        completedCustomers: 0,
        riskWordTriggers: 0,
        materialSend: 0,
        courseRemind: 0,
        homeworkPublish: 0,
        feedbackTrack: 0,
        weekMaterialSend: 0,
        sundayLinkSend: 0
      }
    )
  }, [data])

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-sm font-medium text-gray-700">汇总（统计周期：{evalPeriod}）</div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">总人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.totalCustomers}</div>
        </div>
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">完成人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.completedCustomers}</div>
        </div>
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">风险词触发人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.riskWordTriggers}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">完成资料发送人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.materialSend}</div>
        </div>
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">完成到课提醒人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.courseRemind}</div>
        </div>
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">完成课后作业发布人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.homeworkPublish}</div>
        </div>
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">完成课后学习感受追踪人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.feedbackTrack}</div>
        </div>
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">完成下周资料发送人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.weekMaterialSend}</div>
        </div>
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-500">发送周日螳螂销转链接人数</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{totals.sundayLinkSend}</div>
        </div>
      </div>
    </div>
  )
}

export default ReportsSummary
