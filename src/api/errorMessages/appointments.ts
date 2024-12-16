const messages: [string, string][] = [
  ['userShiftAppointment is already booked', '客戶於此時段已預約過'],
  ['clientSchedule can\'t be rearrange more than one time', '無法預約改期，預約改期最多只能一次'],
  ['ClientGroup points not enough', '群組堂數不足'],
  ['client already in groupClass', '客戶已預約過此堂團課'],
  ['multiChannelPay sum is not equal to amount', '交易總金額不符'],
  ['ClientSchedule already checkout', '此交易已結帳完成'],
  ['userShiftSlot is overlap with other userShiftSlot', '時間跟其他班別重疊'],
  ['StartTime and EndTime can not edit at same time', '開始時間跟結束時間不可同時編輯'],
  ['cannot find medicalAndTrainingRecord', '此預約單並非此場館，無法進行此操作'],
  ['ClientSchedule not found', '此預約單並非此場館，無法進行此操作'],
  ['Schedule not found', '此預約單並非此場館，無法進行此操作'],
  ['The schedule has been paid. Please cancel the payment first; only then can the schedule be canceled.', '此預約單已經結帳，請先取消此筆交易再進行取消預約單的操作'],
];

export default messages;
