export enum PaymentMethod {
  現金 = 1,
  匯款 = 2,
  信用卡 = 3,
  LINEPay = 4,
  街口 = 5,
  堂數 = 6,
  團課卷 = 7,
  主管折扣 = 8,
  折價券 = 9,
  抵用券 = 10,
  行銷活動 = 11,
  訂金 = 12,
}

export enum PaymentState {
  未結帳 = 1,
  已結帳 = 2,
}

export const PaymentMethods = {
  cash: {
    identifier: PaymentMethod['現金'],
    label: PaymentMethod['1'],
    name: 'cash',
    calcInReceipt: true,
    forPointAndGroup: true,
  },
  transfer: {
    identifier: PaymentMethod['匯款'],
    label: PaymentMethod['2'],
    name: 'transfer',
    calcInReceipt: true,
    forPointAndGroup: true,
  },
  creditCard: {
    identifier: PaymentMethod['信用卡'],
    label: PaymentMethod['3'],
    name: 'creditCard',
    calcInReceipt: true,
    forPointAndGroup: true,
  },
  linePay: {
    identifier: PaymentMethod.LINEPay,
    label: PaymentMethod['4'],
    name: 'linePay',
    calcInReceipt: true,
    forPointAndGroup: true,
  },
  jkoPay: {
    identifier: PaymentMethod['街口'],
    label: PaymentMethod['5'],
    name: 'jkoPay',
    calcInReceipt: true,
    forPointAndGroup: true,
  },
  point: {
    identifier: PaymentMethod['堂數'],
    label: PaymentMethod['6'],
    name: 'point',
    calcInReceipt: false,
    forPointAndGroup: false,
  },
  groupTicket: {
    identifier: PaymentMethod['團課卷'],
    label: PaymentMethod['7'],
    name: 'groupTicket',
    calcInReceipt: false,
    forPointAndGroup: false,
  },
  supervisorDiscount: {
    identifier: PaymentMethod['主管折扣'],
    label: PaymentMethod['8'],
    name: 'supervisorDiscount',
    calcInReceipt: false,
    forPointAndGroup: false,

  },
  coupon: {
    identifier: PaymentMethod['折價券'],
    label: PaymentMethod['9'],
    name: 'coupon',
    calcInReceipt: false,
    forPointAndGroup: false,

  },
  voucher: {
    identifier: PaymentMethod['抵用券'],
    label: PaymentMethod['10'],
    name: 'voucher',
    calcInReceipt: false,
    forPointAndGroup: false,

  },
  promotion: {
    identifier: PaymentMethod['行銷活動'],
    label: PaymentMethod['11'],
    name: 'promotion',
    calcInReceipt: false,
    forPointAndGroup: false,

  },
  deposit: {
    identifier: PaymentMethod['訂金'],
    label: PaymentMethod['12'],
    name: 'deposit',
    calcInReceipt: false,
    forPointAndGroup: false,

  },
};

export enum ScheduleState {
  預約 = 1,
  報到 = 2,
  完成服務 = 3,
  病例完成 = 4,
  預約取消 = 5,
  預約改期 = 6,
  刪除 = 7,
}

export const ScheduleStateMap = new Map([
  [1, { name: 'appointment', label: '預約', canEditTime: true, cardStyle: { color: '#FFFFFF' } }],
  [2, { name: 'checkIn', label: '報到', canEditTime: true, cardStyle: { color: '#88F2D8' } }],
  [3, { name: 'serviceDone', label: '完成服務', canEditTime: true, cardStyle: { color: '#E86969' } }],
  [4, { name: 'recordDone', label: '病例完成', canEditTime: false, cardStyle: { color: '#FFFFFF' }, queryStyle: { bgc: '#D9D9D9', color: '#49454F' } }],
  [5, { name: 'appointmentCanceled', label: '預約取消', canEditTime: false, queryStyle: { bgc: '#E86969', color: '#FFFFFF' } }],
  [6, { name: 'appointmentRearranged', label: '預約改期', canEditTime: false, queryStyle: { bgc: '#91D0C1', color: '#FFFFFF' } }],
  [7, { name: 'appointment', label: '刪除', canEditTime: false }],
]);

export const SchedulePaymentMap = new Map([
  [1, { name: 'unpaid', label: '未結帳', cardStyle: { bgc: '#F8C9CB' } }],
  [2, { name: 'paid', label: '結帳', cardStyle: { bgc: '#A5D6F1' } }],
]);
