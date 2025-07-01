export interface CoachSalaryDetail {
  id: number;
  totalAmount: number;
  baseSalary: number;
  performanceBonus: {
    amount: number;
    hours: number;
    minimumHours: number;
    executions: {
      label: string;
      hours: number;
      weight: number;
    }[];
    basic: {
      unitPrice: number;
    };
    tiered: {
      unitPrice: number;
    };
  };
  spaceRental: {
    amount: number;
    hours: number;
    unitPrice: number;
  };
  performanceChampion: {
    amount: number;
  };
  executionChampion: {
    amount: number;
  };
  coachQuarterlyBonus: {
    space: {
      id: number;
      name: string;
    };
    bonusAmount: number;
    personalBonus: number;
    teamBonus: number;
    rankBonus: number;
  }[];
  isConfirmed: boolean;
}
