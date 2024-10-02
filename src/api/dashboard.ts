import { api } from '@/utils/api';
import type { ClientSchedule } from './appointment';

export interface UserInProgressClientSchedulesParams {
  startDate: string;
  endDate: string;
}

export async function UserInProgressClientSchedules(params: UserInProgressClientSchedulesParams) {
  const { data } = await api.get<ClientSchedule[]>('dashboard/userSingleSpaceInProgressClientSchedules', { params });
  return data;
}
