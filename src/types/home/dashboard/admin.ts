export interface TherapistClientScheduleStatics {
  clientScheduleStateStatistic: {
    label: string;
    value: number;
    amount: number;
  }[];
  purchaseStatistic: {
    label: string;
    value: number;
    amount: number;
  }[];
}

export interface TherapistEducationPoint {
  predictedEducationPoint: number;
  currentEducationPoint: number;
}

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
