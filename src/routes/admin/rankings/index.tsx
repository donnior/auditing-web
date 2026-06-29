import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { z } from 'zod'

import { EVAL_TYPE, type EvalType } from '@/constants'
import { daysBefore } from '@/lib/utils'
import { getRecentWeekPeriodOptions } from '@/lib/reportPeriods'
import {
  type EvaluationDetail,
  type WeeklyReportSummary,
  getCampCustomerDailyPerformanceSummary,
  getReports,
  getWeeklyReportSummaryDetails,
} from '@/modules/reports/api'
import type { Staff } from '@/modules/staffs/api'
import { useStaffsForReports } from '@/modules/staffs/useStaffs'

const RANKING_TYPES = [
  { value: 'gmv', label: '销售额排行', title: '销售额排行榜' },
  { value: 'churn', label: '流失人数排行', title: '流失人数排行榜' },
  { value: 'refund', label: '退款金额排行', title: '退款金额排行榜' },
] as const

type RankingType = (typeof RANKING_TYPES)[number]['value']

const searchSchema = z.object({
  evalPeriod: z.coerce.string().optional(),
  rankingType: z.enum(['gmv', 'churn', 'refund']).optional(),
})

export const Route = createFileRoute('/admin/rankings/')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

type EmployeeMeta = {
  employeeId: string
  employeeName: string
  employeeQwId: string
  groupName: string
}

type StageBundle = {
  summary: WeeklyReportSummary
  items: EvaluationDetail[]
}

type PerformanceTotal = {
  employeeId: string
  gmvAmount: number
  refundAmount: number
}

type RankingRow = EmployeeMeta & {
  totalCustomers: number
  riskCustomers: number
  churnCount: number
  gmvAmount: number
  refundAmount: number
}

type AnalysisGoodAspect = {
  title: string
  description: string
  source: string
}

type SopTemplate = {
  type: string
  scene: string
  steps: string[]
  sample: string
}

type SpeechAnalysis = {
  summary: string
  goodAspects: AnalysisGoodAspect[]
  sopTemplates: SopTemplate[]
}

const ANALYSIS_GOOD_ASPECTS: AnalysisGoodAspect[] = [
  {
    title: '薄弱点探寻',
    description: '家长反馈阅读、完形或语法填空问题后，能先围绕问题共情，再自然引导到沙沙老师课程和针对性练习，避免长篇说教。',
    source: '课前深度沟通话术',
  },
  {
    title: '学习规划承接',
    description: '能把“方法学习+刻意练习”说清楚，并承诺开课后按节点推送学习任务，让家长感到服务有节奏。',
    source: '课前深度沟通话术',
  },
  {
    title: '预期管理',
    description: '提前说明课程对标中考难度，孩子前期可能有爬坡期，同时给出个性化跟踪、精细化辅导和难度调整方案。',
    source: '预期管理话术',
  },
  {
    title: '到课提醒',
    description: '提醒中包含开课时间、课程亮点、到课福利、上课平台和冲突回放处理，能减少家长临场操作成本。',
    source: '课程预告具体话术SOP',
  },
  {
    title: '课后回访',
    description: '先肯定孩子完成直播和专注表现，再根据正向或负向反馈安排小测、答疑和后续跟进，语气更容易被接受。',
    source: '首课学员课后感受回访',
  },
  {
    title: '学习反馈闭环',
    description: '能用作业完成度、正确率、错题复习和下周坚持动作串成学习闭环，既有表扬也有具体方案。',
    source: '学习情况反馈',
  },
  {
    title: '课程价值外化',
    description: '能反复强调“考啥学啥”“中考真题”“极致重复”和课堂笔记资料，把课程价值从感受转成可理解的证据。',
    source: '课程核心亮点',
  },
  {
    title: '关单节奏',
    description: '先确认家长课感受，再说明优惠、课时、赠品和名额紧迫感，最后用“帮您锁定名额”进行柔性收口。',
    source: '活动关单话术',
  },
  {
    title: '未续费维护',
    description: '对暂未续费家长先表达感谢，再保留学习问题咨询和后续资料触达，降低打扰感并保留长期转化空间。',
    source: '未续费用户维护话术',
  },
]

const SOP_TEMPLATES: SopTemplate[] = [
  {
    type: '课前深度沟通SOP',
    scene: '新用户承接后，开课前了解孩子英语情况和学习安排。',
    steps: [
      '先获得家长语音或电话沟通授权，说明是为了做个性化学习规划。',
      '围绕阅读、完形、语法填空等薄弱点提问，并结合家长回答共情。',
      '同步课程学习方式、课前准备和后续任务推送节奏。',
      '完成预期管理，说明课程对标中考难度，有问题会及时调整练习难度和数量。',
    ],
    sample: `在咱们开课前，想和您了解一下孩子目前的英语学习情况，方便帮孩子做个性化的学习规划；第二呢，也是想和您同步一下咱们课程的学习方式和课前准备，让孩子从第一节课开始就能进入状态。大概占用您几分钟的时间，您看现在方便吗？

如果孩子主要是阅读丢分，阅读确实是英语考试比较容易丢分的题型，可能是词汇量不够，也可能是做题方法不对。沙沙老师在本次课程中会结合中考真题，带孩子掌握不同类型阅读的解题方法。我这边也会结合孩子的薄弱点，给他安排针对性的练习。

另外妈妈，我也提前跟您说一下，咱们课程核心是“考啥学啥”，直接对标中考难度，孩子刚开始接触时可能会有一个短暂的爬坡期。如果孩子觉得吃力，咱们及时沟通，我会调整练习题难度和数量，保证孩子跳一跳能够得着。`,
  },
  {
    type: '课程预告SOP',
    scene: '周五晚到周六开课前，多轮提醒家长和孩子准时进课。',
    steps: [
      '周五晚先同步上课时间、主讲老师和本节课核心内容。',
      '周六上午强化课程价值，突出中考高频考点和现场真题演练。',
      '开课前1小时用群公告提示准备笔记本、登录小鹅通等待开课。',
      '开课前10分钟一对一提醒，附上主题、时间、平台和操作协助入口。',
    ],
    sample: `家长晚上好呀！再跟您同步一下咱们周六19点沙沙老师的英语课，千万别让孩子错过啦。本次课程重点讲“中考核心完型阅读解题方法”和“阅读关键词定位法”，都是期中、期末和中考里非常高频的考点。

沙沙老师会把复杂的方法拆成孩子能听懂、能照着做的步骤，课上还会现场带大家练多道中考真题，比孩子自己刷题效率更高。只要孩子完整到课，课后我们会发沙沙老师整理的课堂笔记，方便孩子复盘重点、避开丢分坑。

周六19:00准时开课，建议孩子提前10分钟进入小鹅通APP调试设备。若当天确实有时间冲突，您也提前和我说一下，我帮孩子保留回放，并约好补看的时间。`,
  },
  {
    type: '开课外呼SOP',
    scene: '直播已经开始但客户未进入直播间时，快速电话触达。',
    steps: [
      '确认身份后直接提醒课程已经开始，后台看到孩子暂未进入直播间。',
      '判断原因：未进平台、已准备好、时间冲突。',
      '未进平台则指导手机号登录小鹅通或发送直达链接。',
      '时间冲突则保留回放，并约定孩子忙完后的补看时间。',
    ],
    sample: `您好，是XX同学的妈妈/爸爸吗？我是清华沙沙的助教XX老师。提醒您咱们今天的英语课已经开始了，后台看到孩子还没有进入直播间，是不是有什么事情耽误了？

如果是还没找到入口，您用报名手机号登录小鹅通APP，进入“我的课程”就能看到直播间；我也可以马上在微信里给您发一个直达链接，点进去就能上课。有任何平台操作问题，您直接回复我，我看到后马上帮您处理。

如果孩子今天时间有冲突，本节课内容还是比较重要的，我先帮您生成回放。等孩子忙完后，辛苦您提醒他一定要补看，补看后也可以把不懂的题拍给我，我给孩子做答疑。`,
  },
  {
    type: '课后回访SOP',
    scene: '首课后收集反馈、稳定体验、推进课后小测。',
    steps: [
      '先肯定孩子完成直播课，降低家长防御心。',
      '询问孩子感受：能否听懂、是否适应、有没有卡点。',
      '正面反馈强调专注力和进步潜力，负面反馈解释难度和适应期。',
      '引导孩子完成30分钟课后小测，并承诺不懂可以随时提问。',
    ],
    sample: `XX妈妈/宝贝，看到孩子准时学完了今天的完型阅读直播课，先给XX点个赞。第一次跟着沙沙老师上课能坚持下来真的很棒，很多同学刚开始都会觉得时间有点长，但孩子能完整听完，说明专注力和配合度都不错。

您这边有没有问过孩子，今天课程听下来感觉怎么样？能不能听懂，好不好理解，有没有哪个地方觉得难或者不适应？如果孩子觉得中考真题有挑战也很正常，我们每节课前都会发文章翻译和生词表，课后也可以把不懂的题拍给我，我帮他拆解。

等孩子有空的时候，可以花30分钟完成一下课后小测。这个小测不是为了给孩子压力，主要是帮他巩固今天的方法，也方便我更清楚孩子的吸收情况，后面给他安排更合适的练习。`,
  },
  {
    type: '学习反馈SOP',
    scene: '周中对已完课且完成练习的客户进行学习反馈。',
    steps: [
      '先表扬孩子完成学习任务，强化“万事开头难，已经跨过第一步”。',
      '根据正确率区分反馈，正确率高则强调课堂吸收效率，正确率一般则聚焦问题集中、便于复习。',
      '指出需要订正或复习的具体方向。',
      '落到下周继续坚持和学习闭环。',
    ],
    sample: `妈妈，我看了XX这次课后作业的完成情况，先表扬一下孩子，能够保质保量完成本周学习任务，这一点很值得肯定。万事开头难，他已经把最难的第一步跨过去了。

从课后测来看，孩子课堂吸收效率还是不错的，说明今天的方法课没有白听。错的几个点也不用太焦虑，问题相对集中，反而更便于我们针对性复习。比如短语搭配、细节定位或者上下文依据这些地方，我们再带孩子回看一下讲义和课堂笔记。

这周建议孩子先把错题订正完，再把课堂笔记补齐，本周学习就能形成“预习-上课-练习-订正”的闭环。每周保持这个节奏，坚持一段时间，完型阅读的稳定性会越来越好。`,
  },
  {
    type: '活动关单SOP',
    scene: '家长课后对A/B类客户进行一对一续费转化。',
    steps: [
      '先询问家长是否听了家长会，并承接沙沙老师观点。',
      '说明全年班价格、课时数、平均单节价格和一对一规划价值。',
      '强调直播期间优惠、前50名赠品和名额剩余。',
      '用“我帮您锁定名额”进行下一步确认。',
    ],
    sample: `XX妈妈，刚才沙沙老师的家长会您听了吗？是不是能感觉到老师讲的都是中考英语真正要抓的重点。咱们英语学习不是单纯多刷题，而是要围绕中考原题、核心词汇、完型阅读方法和写作结构做系统训练。

今天的全年班优惠确实比较划算，4990元可以上52节课，相当于10个月的钱上13个月的课，平均下来每节课才90多块钱，比外面一对一划算很多。而且不是只有直播课，课后还有助教老师做督学、作业反馈、答疑和学习规划，孩子每周该学什么、怎么练、哪里要补，都会有人跟。

现在直播期间还有名额福利，前50名会额外赠送单词速记课。我看群里已经有几位家长续费了，优惠名额也不多了。您要是确定想让孩子继续跟着沙沙老师系统学，我现在就帮您先锁定一个名额。`,
  },
  {
    type: '试卷分析SOP',
    scene: '第三周点对点服务关单，用专业诊断建立信任。',
    steps: [
      '邀请家长发送最近一次大考试卷，说明会结合试卷做学习规划。',
      '按完形、阅读、作文三类问题做诊断。',
      '给出1到2个具体题目案例，让家长直观看到薄弱点。',
      '把薄弱点对应到全年课程模块和黄金提升时间窗口。',
    ],
    sample: `亲爱的家长，为了更准确了解XX目前的英语基础，您可以把孩子最近一次大考试卷发给我看一下，期中、期末或者月考试卷都可以。我会从整体上看孩子现在的薄弱点，再结合咱们课程给孩子做一个更适合他的学习规划。

我会重点看三个部分：完型题里孩子是不是容易漏掉上下文依据，阅读题里是不是细节定位和主旨判断容易出错，作文里是不是存在结构不清晰、语法错误或者表达比较单一的问题。如果能看到具体题目，我也会挑1到2道典型错题给您解释，这样您能更直观看到孩子到底卡在哪里。

分析完之后，我会把问题对应到后面的学习安排里。比如词汇和固定搭配不稳，就要加强中考核心词汇；阅读方法不熟，就要用真题训练关键词定位和出题人思维；作文表达弱，就要补结构和高级句型。这样后续学习就不是泛泛地补，而是有目标地提分。`,
  },
  {
    type: '结课续费SOP',
    scene: '第四周结课前，总结月卡学习成果并做最后优惠提醒。',
    steps: [
      '汇总直播课、回放、课后练习、正确率提升和作业反馈次数。',
      '强调孩子在具体板块上的进步。',
      '说明继续系统学习能进一步稳定提分。',
      '提醒优惠剩余时间和恢复原价节点。',
    ],
    sample: `XX妈妈，咱们一个月的课程马上就要结束了，我也跟您简单总结一下孩子这段时间的学习情况。孩子这一个月完成了直播课、课后练习和多次作业反馈，能够坚持下来本身就很不容易。

从学习表现来看，孩子在XX板块已经有明显进步，比如完型做题时开始知道找上下文依据，阅读也会主动圈关键词了。现在更重要的是把这个方法继续练熟，因为英语提分不是听懂一次就结束，而是要通过持续练习，把方法变成稳定的做题习惯。

咱们现在的优惠活动还剩最后几天，之后就会恢复原价。如果孩子能继续跟着全年班系统学习，把单词、语法、完型阅读和写作都按中考节奏打牢，后面初二、初三会省心很多。您这边可以先考虑一下，我也可以帮您看一下目前还剩哪些优惠名额。`,
  },
]

const STAGE_ORDER: EvalType[] = [
  EVAL_TYPE.FIRST_WEEK,
  EVAL_TYPE.SECOND_WEEK,
  EVAL_TYPE.THIRD_WEEK,
  EVAL_TYPE.FOURTH_WEEK,
]

const PREVIOUS_STAGE: Partial<Record<EvalType, EvalType>> = {
  [EVAL_TYPE.SECOND_WEEK]: EVAL_TYPE.FIRST_WEEK,
  [EVAL_TYPE.THIRD_WEEK]: EVAL_TYPE.SECOND_WEEK,
  [EVAL_TYPE.FOURTH_WEEK]: EVAL_TYPE.THIRD_WEEK,
}

function getPageItems<T>(data?: { content?: T[]; items?: T[] }): T[] {
  return data?.content ?? data?.items ?? []
}

function formatPeriod(evalPeriod: string) {
  return `${daysBefore(evalPeriod, 6)} - ${evalPeriod}`
}

function normalizeCampTag(campTag?: string) {
  return campTag || '未标记'
}

function toAmount(value?: number | string | null) {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount) ? amount : 0
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getStableSeed(input: string) {
  return Array.from(input).reduce((seed, char) => (seed * 33 + char.charCodeAt(0)) % 100000, 5381)
}

function pickRotatedItems<T>(items: T[], seed: number, count: number) {
  if (items.length === 0) return []
  const start = seed % items.length
  const rotated = [...items.slice(start), ...items.slice(0, start)]
  return rotated.slice(0, Math.min(count, items.length))
}

function buildSpeechAnalysis(row: RankingRow, evalPeriod: string): SpeechAnalysis {
  const seed = getStableSeed(`${row.employeeId}-${row.employeeName}-${evalPeriod}`)
  const goodAspects = pickRotatedItems(ANALYSIS_GOOD_ASPECTS, seed, 4 + (seed % 2))
  const sopTemplates = pickRotatedItems(SOP_TEMPLATES, seed * 3 + row.employeeName.length, 3 + (seed % 2))

  return {
    summary: `本分析围绕 ${row.employeeName} 与客户的承接沟通展开，重点观察薄弱点探寻、到课提醒、课后回访和续费转化节点。系统从预置SOP素材中抽取 ${goodAspects.length} 个表现亮点，并沉淀出 ${sopTemplates.length} 类可复用话术模板。`,
    goodAspects,
    sopTemplates,
  }
}

function SpeechAnalysisModal({
  row,
  evalPeriod,
  analysis,
  onClose,
}: {
  row: RankingRow | null
  evalPeriod: string
  analysis: SpeechAnalysis | null
  onClose: () => void
}) {
  if (!row || !analysis) return null

  const periodText = evalPeriod ? `${evalPeriod}（${formatPeriod(evalPeriod)}）` : '-'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative z-10 flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-950">话术分析</h3>
              {/*<span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">预置示例</span>*/}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {row.employeeName} · {row.groupName} · {periodText}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="关闭话术分析弹窗"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-5">
          <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="text-xs font-medium text-blue-700">AI分析结果</div>
            <p className="mt-1 text-sm leading-6 text-gray-700">{analysis.summary}</p>
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-950">亮点分析</h4>
              <span className="text-xs text-gray-500"></span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {analysis.goodAspects.map((item) => (
                <div key={item.title} className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h5 className="text-sm font-semibold text-gray-950">{item.title}</h5>
                    <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{item.source}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-950">SOP话术示范</h4>
              <span className="text-xs text-gray-500"></span>
            </div>
            <div className="space-y-3">
              {analysis.sopTemplates.map((template) => (
                <div key={template.type} className="rounded-md border border-gray-200 bg-white p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h5 className="text-sm font-semibold text-gray-950">{template.type}</h5>
                    <span className="text-xs text-gray-500">{template.scene}</span>
                  </div>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-gray-600">
                    {template.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <div className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-700">
                    <div className="font-medium text-gray-900">参考话术：</div>
                    <div className="mt-1 whitespace-pre-line">{template.sample}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function sortSummaries(summaries: WeeklyReportSummary[]) {
  return summaries
    .filter((summary) => summary.eval_type !== EVAL_TYPE.WITHIN_48_HOURS)
    .sort((a, b) => STAGE_ORDER.indexOf(a.eval_type as EvalType) - STAGE_ORDER.indexOf(b.eval_type as EvalType))
}

function groupByEmployee(summaries: WeeklyReportSummary[]) {
  return summaries.reduce((acc, summary) => {
    const group = acc.get(summary.employee_id) ?? []
    group.push(summary)
    acc.set(summary.employee_id, group)
    return acc
  }, new Map<string, WeeklyReportSummary[]>())
}

function buildEmployeeMeta(staffs: Staff[], summaries: WeeklyReportSummary[]) {
  const map = new Map<string, EmployeeMeta>()

  staffs.forEach((staff) => {
    map.set(staff.id, {
      employeeId: staff.id,
      employeeName: staff.name,
      employeeQwId: staff.qw_id,
      groupName: staff.group_name || '-',
    })
  })

  summaries.forEach((summary) => {
    if (map.has(summary.employee_id)) return
    map.set(summary.employee_id, {
      employeeId: summary.employee_id,
      employeeName: summary.employee_name,
      employeeQwId: summary.employee_qw_id,
      groupName: '-',
    })
  })

  return Array.from(map.values()).filter((employee) => employee.employeeQwId)
}

async function fetchStageBundles(summaries: WeeklyReportSummary[]): Promise<StageBundle[]> {
  const sorted = sortSummaries(summaries)
  return Promise.all(
    sorted.map(async (summary) => {
      const response = await getWeeklyReportSummaryDetails(
        summary.id,
        'totalCustomers',
        Math.max(200, summary.total_customers || 0)
      )
      return {
        summary,
        items: getPageItems<EvaluationDetail>(response),
      }
    })
  )
}

async function fetchPerformanceTotals(employees: EmployeeMeta[], startDate: string, endDate: string) {
  const entries = await Promise.all(
    employees.map(async (employee): Promise<PerformanceTotal> => {
      const summaries = await getCampCustomerDailyPerformanceSummary(employee.employeeQwId, startDate, endDate)
      return {
        employeeId: employee.employeeId,
        gmvAmount: summaries.reduce((sum, item) => sum + toAmount(item.gmv_amount), 0),
        refundAmount: summaries.reduce((sum, item) => sum + toAmount(item.refund_amount), 0),
      }
    })
  )

  return entries
}

function getCampTag(item: EvaluationDetail) {
  return normalizeCampTag(item.camp_tag)
}

function groupDetailsByCampTag(items: EvaluationDetail[]) {
  return items.reduce((acc, item) => {
    const campTag = getCampTag(item)
    const group = acc.get(campTag) ?? []
    group.push(item)
    acc.set(campTag, group)
    return acc
  }, new Map<string, EvaluationDetail[]>())
}

function buildChurnByEmployee(currentBundles: StageBundle[], previousBundles: StageBundle[]) {
  const previousByEmployeeAndStage = new Map<string, StageBundle>()
  const churnByEmployee = new Map<string, number>()

  previousBundles.forEach((bundle) => {
    previousByEmployeeAndStage.set(
      `${bundle.summary.employee_id}__${bundle.summary.eval_type}`,
      bundle
    )
  })

  currentBundles.forEach((bundle) => {
    const evalType = bundle.summary.eval_type as EvalType
    const previousEvalType = PREVIOUS_STAGE[evalType]
    if (!previousEvalType) return

    const previousBundle = previousByEmployeeAndStage.get(
      `${bundle.summary.employee_id}__${previousEvalType}`
    )
    if (!previousBundle) return

    const currentGroups = groupDetailsByCampTag(bundle.items)
    const previousGroups = groupDetailsByCampTag(previousBundle.items)
    const campTags = new Set([...currentGroups.keys(), ...previousGroups.keys()])
    let churnCount = 0

    campTags.forEach((campTag) => {
      const currentIds = new Set((currentGroups.get(campTag) ?? []).map((item) => item.customer_id))
      const previousItems = previousGroups.get(campTag) ?? []
      churnCount += previousItems.filter((item) => !currentIds.has(item.customer_id)).length
    })

    churnByEmployee.set(
      bundle.summary.employee_id,
      (churnByEmployee.get(bundle.summary.employee_id) ?? 0) + churnCount
    )
  })

  return churnByEmployee
}

function buildRankingRows(
  employees: EmployeeMeta[],
  currentSummaries: WeeklyReportSummary[],
  currentBundles: StageBundle[],
  previousBundles: StageBundle[],
  performanceTotals: PerformanceTotal[],
  rankingType: RankingType
) {
  const summariesByEmployee = groupByEmployee(currentSummaries)
  const churnByEmployee = buildChurnByEmployee(currentBundles, previousBundles)
  const performanceByEmployee = new Map(performanceTotals.map((item) => [item.employeeId, item]))

  return employees
    .map((employee): RankingRow => {
      const summaries = summariesByEmployee.get(employee.employeeId) ?? []
      const performance = performanceByEmployee.get(employee.employeeId)
      return {
        ...employee,
        totalCustomers: summaries.reduce((sum, summary) => sum + (summary.total_customers || 0), 0),
        riskCustomers: summaries.reduce((sum, summary) => sum + (summary.total_risk_word_trigger || 0), 0),
        churnCount: churnByEmployee.get(employee.employeeId) ?? 0,
        gmvAmount: performance?.gmvAmount ?? 0,
        refundAmount: performance?.refundAmount ?? 0,
      }
    })
    .filter((row) => row.totalCustomers > 0 || row.riskCustomers > 0 || row.churnCount > 0 || row.gmvAmount > 0 || row.refundAmount > 0)
    .sort((a, b) => {
      const primary =
        rankingType === 'churn'
          ? b.churnCount - a.churnCount
          : rankingType === 'refund'
            ? b.refundAmount - a.refundAmount
            : b.gmvAmount - a.gmvAmount

      if (primary !== 0) return primary
      if (b.gmvAmount !== a.gmvAmount) return b.gmvAmount - a.gmvAmount
      return a.employeeName.localeCompare(b.employeeName)
    })
}

function RouteComponent() {
  const { evalPeriod, rankingType } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [analysisEmployee, setAnalysisEmployee] = useState<RankingRow | null>(null)
  const periodOptions = useMemo(() => getRecentWeekPeriodOptions(8), [])
  const selectedEvalPeriod = evalPeriod || periodOptions[0]?.value || ''
  const selectedRankingType = rankingType || 'gmv'
  const showSpeechAnalysis = selectedRankingType === 'gmv'
  const activeRanking = RANKING_TYPES.find((item) => item.value === selectedRankingType) ?? RANKING_TYPES[0]
  const previousEvalPeriod = selectedEvalPeriod ? daysBefore(selectedEvalPeriod, 7) : ''

  const { staffs, isLoading: isStaffsLoading } = useStaffsForReports()

  const currentReportsQuery = useQuery({
    queryKey: ['rankingReports', selectedEvalPeriod],
    queryFn: () => getReports(undefined, undefined, selectedEvalPeriod, undefined, 1000),
    enabled: Boolean(selectedEvalPeriod),
  })

  const previousReportsQuery = useQuery({
    queryKey: ['rankingReports', previousEvalPeriod],
    queryFn: () => getReports(undefined, undefined, previousEvalPeriod, undefined, 1000),
    enabled: Boolean(previousEvalPeriod),
  })

  const currentSummaries = useMemo(
    () => sortSummaries(getPageItems<WeeklyReportSummary>(currentReportsQuery.data)),
    [currentReportsQuery.data]
  )
  const previousSummaries = useMemo(
    () => sortSummaries(getPageItems<WeeklyReportSummary>(previousReportsQuery.data)),
    [previousReportsQuery.data]
  )
  const employees = useMemo(
    () => buildEmployeeMeta(staffs ?? [], currentSummaries),
    [staffs, currentSummaries]
  )

  const currentBundlesQuery = useQuery({
    queryKey: ['rankingCurrentBundles', selectedEvalPeriod, currentSummaries.map((summary) => summary.id).join(',')],
    queryFn: () => fetchStageBundles(currentSummaries),
    enabled: currentSummaries.length > 0,
  })

  const previousBundlesQuery = useQuery({
    queryKey: ['rankingPreviousBundles', previousEvalPeriod, previousSummaries.map((summary) => summary.id).join(',')],
    queryFn: () => fetchStageBundles(previousSummaries),
    enabled: previousSummaries.length > 0,
  })

  const performanceQuery = useQuery({
    queryKey: ['rankingPerformance', selectedEvalPeriod, employees.map((employee) => `${employee.employeeId}:${employee.employeeQwId}`).join(',')],
    queryFn: () => fetchPerformanceTotals(employees, daysBefore(selectedEvalPeriod, 6), selectedEvalPeriod),
    enabled: employees.length > 0 && Boolean(selectedEvalPeriod),
  })

  const rows = useMemo(
    () => buildRankingRows(
      employees,
      currentSummaries,
      currentBundlesQuery.data ?? [],
      previousBundlesQuery.data ?? [],
      performanceQuery.data ?? [],
      selectedRankingType
    ),
    [employees, currentSummaries, currentBundlesQuery.data, previousBundlesQuery.data, performanceQuery.data, selectedRankingType]
  )
  const speechAnalysis = useMemo(
    () => analysisEmployee ? buildSpeechAnalysis(analysisEmployee, selectedEvalPeriod) : null,
    [analysisEmployee, selectedEvalPeriod]
  )

  const totalGmv = rows.reduce((sum, row) => sum + row.gmvAmount, 0)
  const totalCustomers = rows.reduce((sum, row) => sum + row.totalCustomers, 0)
  const totalRisks = rows.reduce((sum, row) => sum + row.riskCustomers, 0)
  const topEmployee = rows[0]?.employeeName || '-'
  const isLoading =
    isStaffsLoading ||
    currentReportsQuery.isLoading ||
    previousReportsQuery.isLoading ||
    currentBundlesQuery.isLoading ||
    previousBundlesQuery.isLoading ||
    performanceQuery.isLoading
  const isError =
    currentReportsQuery.isError ||
    previousReportsQuery.isError ||
    currentBundlesQuery.isError ||
    previousBundlesQuery.isError ||
    performanceQuery.isError

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-950">{activeRanking.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            识别本周期表现突出的员工，下钻查看员工周期详情和客户承接情况。
          </p>
        </div>
        <Link
          to="/admin/period-reports"
          className="inline-flex w-fit items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-700"
        >
          返回报告
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">统计周期</label>
        <select
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm md:max-w-sm"
          value={selectedEvalPeriod}
          onChange={(event) => {
            navigate({
              search: {
                evalPeriod: event.target.value,
                rankingType: selectedRankingType,
              },
            })
          }}
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}（{formatPeriod(option.value)}）
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4 text-lg font-semibold text-gray-950">排行类型</div>
          <div className="space-y-3 p-4">
            {RANKING_TYPES.map((item) => {
              const isActive = item.value === selectedRankingType
              return (
                <button
                  key={item.value}
                  type="button"
                  className={`w-full rounded-md border px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-700'
                  }`}
                  onClick={() => {
                    navigate({
                      search: {
                        evalPeriod: selectedEvalPeriod,
                        rankingType: item.value,
                      },
                    })
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </aside>

        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="grid grid-cols-1 gap-3 border-b border-gray-100 p-4 md:grid-cols-4">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium text-gray-500">榜首员工</div>
              <div className="mt-3 truncate text-lg font-semibold text-gray-950">{topEmployee}</div>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium text-gray-500">总GMV</div>
              <div className="mt-3 text-lg font-semibold text-gray-950">{formatMoney(totalGmv)}</div>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium text-gray-500">覆盖客户</div>
              <div className="mt-3 text-lg font-semibold text-gray-950">{totalCustomers}人</div>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium text-gray-500">风险触发</div>
              <div className="mt-3 text-lg font-semibold text-gray-950">{totalRisks}条</div>
            </div>
          </div>

          {isLoading && (
            <div className="flex h-64 items-center justify-center text-gray-500">加载中...</div>
          )}

          {isError && (
            <div className="flex h-64 items-center justify-center bg-red-50 text-red-600">加载失败，请重试</div>
          )}

          {!isLoading && !isError && rows.length === 0 && (
            <div className="flex h-64 items-center justify-center text-gray-500">暂无排行榜数据</div>
          )}

          {!isLoading && !isError && rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">排名</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">员工</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">分组</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">接待客户</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">总GMV</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">流失人数</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">退款金额</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">钻取</th>
                    {showSpeechAnalysis && (
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">分析</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rows.map((row, index) => (
                    <tr key={row.employeeId} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-blue-700">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-50 px-2">
                          {index + 1}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-950">{row.employeeName}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">{row.groupName}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-950">{row.totalCustomers}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-950">{formatMoney(row.gmvAmount)}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-blue-700">{row.churnCount}人</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-red-600">{formatMoney(row.refundAmount)}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">
                        <Link
                          to="/admin/period-reports/$employeeId/$evalPeriod"
                          params={{ employeeId: row.employeeId, evalPeriod: selectedEvalPeriod }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          员工详情
                        </Link>
                      </td>
                      {showSpeechAnalysis && (
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => setAnalysisEmployee(row)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            话术分析
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showSpeechAnalysis && (
        <SpeechAnalysisModal
          row={analysisEmployee}
          evalPeriod={selectedEvalPeriod}
          analysis={speechAnalysis}
          onClose={() => setAnalysisEmployee(null)}
        />
      )}
    </div>
  )
}
