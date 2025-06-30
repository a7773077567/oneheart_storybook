import type { CoachSalaryDetail } from '@/types/home/salaryReport/coach';
import { api } from '@/utils/api';

export async function fetchCoachSalaryDetail(userId: number, yearMonth: string) {
  const { data } = await api.get<CoachSalaryDetail>('salaries/coach-salary-detail', { params: { userId, yearMonth } });
  return data;
}
export async function confirmCoachSalary(payload: { yearMonth: string }) {
  const { data } = await api.post(`salaries/confirm-coach-salary`, payload);
  return data;
}
