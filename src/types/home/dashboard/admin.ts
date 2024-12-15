export interface TherapistClientScheduleStatics {
  clientScheduleStateStatistic: {
    label: string;
    value: number;
    amount: number;
  }[];
  purchaseStatistic: {
    label: string;
    value: number;
  }[];
}

export interface TherapistEducationPoint {
  predictedEducationPoint: number;
  currentEducationPoint: number;
}
