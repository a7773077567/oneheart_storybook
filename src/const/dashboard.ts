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
  canceledCount: {
    name: 'canceledCount',
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
