export const CaseStatusMap = {
  unexecutedCount: {
    name: 'unexecutedCount',
    label: '未執行數',
    color: 'rgba(223, 84, 88, 1)',
  },
  serviceCompletionCount: {
    name: 'serviceCompletionCount',
    label: '服務完成',
    color: 'rgba(26, 122, 179, 1)',
  },
  caseCompletionCount: {
    name: 'caseCompletionCount',
    label: '病例完成',
    color: 'rgba(5, 48, 72, 1)',
  },
  rescheduleCount: {
    name: 'rescheduleCount',
    label: '改期',
    color: 'rgba(103, 159, 195, 1)',
  },
  cancellationCount: {
    name: 'cancellationCount',
    label: '取消',
    color: 'rgba(173, 198, 214, 1)',
  },
} as const;

export const CheckoutPlanMap = {
  oneTimeCash: {
    name: 'oneTimeCash',
    label: '單次現金',
    color: 'rgba(223, 84, 88, 1)',
  },
  fiveSessionsForClient: {
    name: 'fiveSessionsForClient',
    label: '客戶五堂',
    color: 'rgba(26, 122, 179, 1)',
  },
  tenSessionsForClient: {
    name: 'tenSessionsForClient',
    label: '客戶十堂',
    color: 'rgba(5, 48, 72, 1)',
  },
} as const;

export const LoopColors = ['rgba(5, 48, 72, 1)', 'rgba(12, 90, 136, 1)', 'rgba(26, 122, 179, 1)', 'rgba(103, 159, 195, 1)', 'rgba(173, 198, 214, 1)', 'rgba(230, 184, 180, 1)', 'rgba(227, 142, 134, 1)', 'rgba(223, 84, 88, 1)', 'rgba(194, 34, 39, 1)', 'rgba(152, 16, 21, 1)'];
export const LimitColors = ['rgba(223, 84, 88, 1)', 'rgba(26, 122, 179, 1)', 'rgba(5, 48, 72, 1)', 'rgba(103, 159, 195, 1)', 'rgba(173, 198, 214, 1)'];

export const RangeSelectOptions = [
  { label: '本日', value: 'today' },
  { label: '本月', value: 'month' },
  { label: '本季', value: 'quarter' },
  { label: '今年', value: 'year' },
  { label: '過去12個月', value: 'past12month' },
];
