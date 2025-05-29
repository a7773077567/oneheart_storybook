import { api } from '@/utils/api';

export interface TherapistSalaryDetail {
  id: number;
  totalAmount: number;
  executionAmount: ExecutionAmount;
  shockWaveSharing: ShockWaveSharing;
  magneticWaveSharing: MagneticWaveSharing;
  gChairSharing: GChairSharing;
  secondmentBonus: SecondmentBonus;
  educationSharing: EducationSharing;
  recommendationBonus: RecommendationBonus;
  writingBonus: WritingBonus;
  positionBonus: PositionBonus;
  assistanceBonus: AssistanceBonus;
}

export interface ExecutionAmount {
  amount: number;
  baseSalary: number;
  totalExecutions: {
    amount: number;
    totalHours: number;
    unitPrice: number;
    PTLevel: number;
    executions: {
      label: string;
      weight: number;
    }[];
  };
}

export interface ShockWaveSharing {
  amount: number;
  shots: number;
  unitPrice: number;
}

interface MagneticWaveSharing {
  amount: number;
  hours: number;
  unitPrice: number;
}

export interface GChairSharing {
  amount: number;
  unitPrice: number;
  hours: {
    total: number;
    therapy: number;
    referral: number;
  };
}

export interface SecondmentBonus {
  amount: number;
}

export interface EducationSharing {
  amount: number;
  relationships: {
    id: number;
    level: number;
    name: string;
    unitPrice: number;
    hours: number;
    amount: number;
    parentId: number;
  }[];
}

export interface RecommendationBonus {
  amount: number;
  recommendations: {
    referral: string;
    bonus: number;
    type: number;
  }[];
}

export interface WritingBonus {
  amount: number;
}

export interface PositionBonus {
  amount: number;
  performanceTarget: {
    condition: {
      totalExecutionGoal: number;
      revenueTarget: number;
      complaintRefundRate: number;
      greenLightRate: number;
    };
    status: {
      totalExecutionGoal: boolean;
      revenueTarget: boolean;
      complaintRefundRate: boolean;
      greenLightRate: boolean;
    };
  };
}

export interface AssistanceBonus {
  amount: number;
}

export async function authenticateSalaryDetail(password: string) {
  const { data } = await api.post<string>(`salaries/password-recheck`, { password });
  return data;
}

export async function fetchTherapistSalaryDetail(userId: number, yearMonth: string) {
  const { data } = await api.get<TherapistSalaryDetail>(`salaries/therapist-salary-detail`, { params: { userId, yearMonth } });
  return data;
}
