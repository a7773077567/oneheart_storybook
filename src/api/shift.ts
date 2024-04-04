import { z } from 'zod';
import { api } from '@/utils/api';
import { omit } from 'radash';
import type { Role, User } from './user';

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
export interface UserShift {
  id: number;
  spaceId: number;
  userId: number;
  type: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  notAvailableTimes: Duration[];
  color: string;
  maxClients: number | null;
  user: {
    id: number;
    name: string;
    role: Role;
  };
}
export interface UserShiftPost extends Omit<UserShift, 'id' | 'spaceId' | 'user'> {}
export type UserShiftPatch = Pick<UserShift, 'notAvailableTimes'>;
export type ShiftTemplateReq = Omit<ShiftTemplate, 'id' | 'spaceId'>;
export interface UserShiftsGet {
  userIds: number[];
  startDate: string;
  endDate: string;
}

export const shiftTemplateSchema = z.object({
  type: z.number(),
  name: z.string().trim().min(1, { message: '請輸入班別名稱' }),
  duration: z.number().array(),
  notAvailableTimes: z.number().array().array(),
  color: z.string(),
  maxClients: z.string().optional(),
}).refine(({ maxClients, type }) => {
  if (type === 2) {
    return true;
  }
  if (!!maxClients && +maxClients > 0) {
    return true;
  }
  return false;
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

export async function fetchUserShifts(params: UserShiftsGet) {
  const { data } = await api.get<UserShift[]>('userShifts', { params });
  return data;
}

export async function fetchUserShift(userShiftId: number) {
  const { data } = await api.get<UserShift>(`userShifts/${userShiftId}`);
  return data;
}

export async function createUserShift(payload: UserShiftPost) {
  const { data } = await api.post<any, UserShiftPost>(`userShifts`, payload);
  return data;
}

export async function updateUserShift(userShiftId: number, payload: UserShiftPatch) {
  const { data } = await api.patch(`userShifts/${userShiftId}`, payload);
  return data;
}

export async function deleteUserShift(userShiftId: number) {
  const { data } = await api.delete(`userShifts/${userShiftId}`);
  return data;
}

// ========== Utils ==========

export function toUserShiftReq(shiftTemplate: ShiftTemplate, userId: number, date: string): UserShiftPost {
  return {
    ...omit(shiftTemplate, ['id', 'spaceId']),
    userId,
    date,
  };
}
