import { type EvalType, EVAL_TYPE } from '@/constants'

export const EVAL_TYPE_NAMES: Record<EvalType, string> = {
    [EVAL_TYPE.FIRST_WEEK]: '首周评估',
    [EVAL_TYPE.SECOND_WEEK]: '第二周评估',
    [EVAL_TYPE.THIRD_WEEK]: '第三周评估',
    [EVAL_TYPE.FOURTH_WEEK]: '第四周评估',
    [EVAL_TYPE.WITHIN_48_HOURS]: '加微后48小时检测',
};
