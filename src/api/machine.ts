import { api } from '@/utils/api';
import type { ClientSchedule } from './appointment';
import type { MachineTypes } from '@/const/general';
import type { Space } from './user';

export interface MachineSchedule extends ClientSchedule {
  machines: (MachineInfo & {
    machineStartTime: string;
    machineEndTime: string;
  })[];
}

export interface MachineInfo {
  id: number;
  name: string;
  type: MachineTypes;
  space: Space;
}

// 取得所有儀器
export async function getMachineList() {
  const { data } = await api.get<MachineInfo[]>('machines');
  return data;
};

// 取得單一儀器
export async function getSingleMachine(machineId: number) {
  const { data } = await api.get<MachineInfo>(`machines/${machineId}`);
  return data;
};

// 取得客戶進行中的儀器排程
export async function getMachineScheduleInprogress(params: { date: string; machineIds?: number[] }) {
  const { data } = await api.get<MachineSchedule[]>('machines/in-progress', { params });
  return data;
}

// 更新排程獨立預約資訊
export async function adjustIndependentMachineInfo(clientScheduleId: number) {
  const { data } = await api.get(`clientSchedules/${clientScheduleId}/adjust-independentMachineInfo`);
  return data;
}
