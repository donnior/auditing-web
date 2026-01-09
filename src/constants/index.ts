export const EVAL_TYPE = {
    FIRST_WEEK: 'FIRST_WEEK',
    SECOND_WEEK: 'SECOND_WEEK',
    THIRD_WEEK: 'THIRD_WEEK',
    FOURTH_WEEK: 'FOURTH_WEEK',
    WITHIN_48_HOURS: 'WITHIN_48_HOURS',
} as const;

export type EvalType = (typeof EVAL_TYPE)[keyof typeof EVAL_TYPE];
