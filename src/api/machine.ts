import { api } from '@/utils/api';
import type { ClientSchedule } from './appointment';
import type { MachineTypes } from '@/const/general';
import type { Space } from './user';

export interface MachineSchedule extends ClientSchedule {
  machines: ReservedMachine[];
}

export interface MachineInfo {
  id: number;
  name: string;
  space: Space;
  type: MachineTypes;
}

export interface ReservedMachine extends MachineInfo {
  machineStartTime: string;
  machineEndTime: string;
  independentShockWaveShots?: number;
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

// 更新儀器預約資訊
export interface UpdateMachinePayload {
  machineId:	number;
  startTime: string;
  endTime: string;
  shockWaveShots?:	number;
}
export async function adjustIndependentMachineInfo(clientScheduleId: number, payload: UpdateMachinePayload) {
  const { data } = await api.patch(`clientSchedules/${clientScheduleId}/adjust-independentMachineInfo`, payload);
  return data;
}
