export enum PaymentMethod {
  現金 = 1,
  匯款 = 2,
  信用卡 = 3,
  'LINEPay' = 4,
  街口 = 5,
  點數 = 6,
}

export const ScheduleStateMap = new Map([
  [1, { name: 'appointment', label: '預約', cardStyle: { color: '#FFFFFF' } }],
  [2, { name: 'checkIn', label: '報到', cardStyle: { color: '#88F2D8' } }],
  [3, { name: 'serviceDone', label: '完成服務', cardStyle: { color: '#E86969' } }],
  [4, { name: 'recordDone', label: '病例完成', cardStyle: { color: '#FFFFFF' }, queryStyle: { bgc: '#D9D9D9', color: '#49454F' } }],
  [5, { name: 'appointmentCanceled', label: '預約取消', queryStyle: { bgc: '#E86969', color: '#FFFFFF' } }],
  [6, { name: 'appointmentRearranged', label: '預約改期', queryStyle: { bgc: '#91D0C1', color: '#FFFFFF' } }],
  [7, { name: 'appointment', label: '刪除' }],
]);

export const SchedulePaymentMap = new Map([
  [1, { name: 'unpaid', label: '未結帳', cardStyle: { bgc: '#F8C9CB' } }],
  [2, { name: 'paid', label: '結帳', cardStyle: { bgc: '#A5D6F1' } }],
]);
