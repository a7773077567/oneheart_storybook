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

export interface TherapistOverviewStatistic {
  averageExecutionCount: number;
  returnVisitRate: number;
  clientRate: number;
  referralCount: number;
}

export interface TherapistTurnoverStatistic {
  lineChartData: {
    type: 'today' | 'month' | 'quarter' | 'year' | 'past12month';
    value: number;
    time: string | null;
    day: number | null;
    isoweek: number | null;
    month: number | null;
  }[];
  onetimePurchase: number;
  firstSessionPurchase: number;
  secondSessionPurchase: number;
}

export interface TherapistTurnoverStatisticsDetailsData {
  clientId: number;
  clientName: number;
  userShiftType: number;
  amount: number;
}

export interface TherapistClientGroupStatistic {
  clientId: number;
  clientName: string;
  clientGroupDetails: {
    label: string;
    type: number;
    points: number;
  }[];
}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export enum ClientGroupSortTypes {
  物理治療 = 1,
  院長物理治療 = 2,
  營養 = 3,
  教練課 = 4,
  震波 = 5,
  射頻 = 6,
  磁波 = 7,
  G動椅 = 8,
}
