import { api } from '@/utils/api';
import type { UserShiftDetail } from '@/api/shift';
import type { Client } from '@/api/clientManagement';

export interface UserInProgressClientSchedulesParams {
  startDate: string;
  endDate: string;
}

export interface UserInProgressClientSchedule {
  id: number;
  userShift: UserShiftDetail;
  date: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  client: Client;
  state: number;
}

export async function fetchUserInProgressClientSchedules(params: UserInProgressClientSchedulesParams) {
  const { data } = await api.get<UserInProgressClientSchedule[]>('/dashboard/userInProgressClientSchedules', { params });
  return data;
}
