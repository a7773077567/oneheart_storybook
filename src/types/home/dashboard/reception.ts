export interface TodayBusinessStatus {
  therapistExecutionHoursStatistic: {
    label: string;
    cancelledClientScheduleCount: number;
    firstClientScheduleCount: number;
    completionHoursInMinute: number;
    appointmentHoursInMinute: number;
    emptyShiftPercentage: number;
    userShiftHoursInMinute: number;
  }[];
  newAndReturnStatistic: {
    label: string;
    value: number;
  }[];
  onetimeAndSessionsPurchaseStatistic: {
    label: string;
    value: number;
  }[];
  allPaymentStatistic: {
    label: string;
    value: number;
  }[];
}
