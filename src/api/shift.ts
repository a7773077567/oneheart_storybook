import { z } from 'zod';
import { api } from '@/utils/api';
import type { PostRes } from '@/composables/helpers';
import { omit } from 'radash';

// ========== Types ==========

export const ShiftColors = ['#88F2D8', '#91D0C1', '#F8C9CB', '#E86969', '#A5D6F1', '#45B1ED'] as const;

export interface Duration {
  startTime: string;
  endTime: string;
}
export interface ShiftTemplate {
  id: number;
  spaceId: number;
  type: number;
  name: string;
  startTime: string;
  endTime: string;
  notAvailableTimes: Duration[];
  color: string;
  maxClients: number | null;
}
export interface UserShift extends Omit<ShiftTemplate, 'id'> {
  userId: number;
  date: string;
}
export interface UserShiftReq extends Omit<UserShift, 'spaceId'> {}
export type ShiftTemplateReq = Omit<ShiftTemplate, 'id' | 'spaceId'>;

export const shiftTemplateSchema = z.object({
  type: z.number(),
  name: z.string().trim().min(1, { message: '不可為空' }),
  duration: z.number().array(),
  notAvailableTimes: z.number().array().array(),
  color: z.string(),
  maxClients: z.string(),
}).refine(({ maxClients, type }) => {
  if (Number.isNaN(+maxClients)) {
    return false;
  }
  if (maxClients !== '' && +maxClients < 1) {
    return false;
  }
  if (maxClients === '' && type !== 2) {
    return false;
  }
  return true;
}, {
  message: '必填並輸入大於1的數字',
  path: ['maxClients'],
});
export type ShiftTemplateSchema = z.infer<typeof shiftTemplateSchema>;

export interface ShiftReq {
  id?: number;
  type: number;
  name: string;
  duration: Record<string, number>;
  unavailable: Record<string, number>[];
  color: (typeof ShiftColors)[number];
}

export type ShiftRes = Required<ShiftReq>;
export interface EmployeeShiftRes {
  id: number;
  date: string | Date;
  employeeId: number;
  shift: ShiftReq;
}

export interface Employee {
  id: number;
  name: string;
  avatar: string;
}

export interface createEmployeeShiftsReq {
  date: string;
  shiftIds: number[];
}

// ========== Requests ==========
export async function fetchShiftTemplates() {
  const { data } = await api.get<ShiftTemplate[]>('shiftTemplates');
  return data;
}

export async function fetchShiftTemplate(shiftTemplateId: number) {
  const { data } = await api.get<ShiftTemplate>(`shiftTemplates/${shiftTemplateId}`);
  return data;
}

export async function createShiftTemplate(payload: ShiftTemplateReq) {
  const { data } = await api.post('shiftTemplates', payload);
  return data;
}

export async function updateShiftTemplate(shiftTemplateId: number, payload: ShiftTemplateReq) {
  const { data } = await api.put(`shiftTemplates/${shiftTemplateId}`, payload);
  return data;
}

export async function deleteShiftTemplate(shiftTemplateId: number) {
  const { data } = await api.delete(`shiftTemplates/${shiftTemplateId}`);
  return data;
}

export async function fetchEmployees() {
  const { data } = await api.get<Employee[]>('employee');
  return data;
}

export async function fetchEmployeeShifts() {
  const { data } = await api.get<EmployeeShiftRes[]>('employee/shift', { params: { month: 2 } });
  return data;
}

export async function createUserShift(payload: UserShiftReq) {
  const { data } = await api.post<any, UserShiftReq>(`userShifts`, payload);
  return data;
}

export async function deleteEmployeeShift(employeeShiftId: number) {
  const { data } = await api.delete<PostRes>(`employee/shift/${employeeShiftId}`);
  return data;
}

// ========== Utils ==========

export function toUserShiftReq(shiftTemplate: ShiftTemplate, userId: number, date: string): UserShiftReq {
  return {
    ...omit(shiftTemplate, ['id', 'spaceId']),
    userId,
    date,
  };
}
