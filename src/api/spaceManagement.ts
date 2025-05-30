import { api } from '@/utils/api';

export interface SpaceMonthlyConfig {
  id: number;
  name: string;
  type: number;
  year: number;
  month: number;
  therapistNumber: number;
  customerComplaintsAndRefundRate: number;
}

export interface UpdateSpaceMonthlyConfig {
  year: number;
  month: number;
  therapistNumber: number;
  customerComplaintsAndRefundRate: number;
}

export async function fetchSpaceMonthlyConfigList(yearMonth: string) {
  const { data } = await api.get<SpaceMonthlyConfig[]>(`spaces/monthly-config`, { params: { yearMonth } });
  return data;
}

export async function updateSpaceMonthlyConfig(spaceId: number, payload: UpdateSpaceMonthlyConfig) {
  const { data } = await api.post<UpdateSpaceMonthlyConfig>(`spaces/${spaceId}/monthly-config`, payload);
  return data;
}
