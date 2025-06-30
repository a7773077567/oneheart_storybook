import { api } from '@/utils/api';

export async function revokeSalaryConfirmation(payload: { userId: number; yearMonth: string }) {
  const { data } = await api.post(`salaries/revoke-salary-confirmation`, payload);
  return data;
}
