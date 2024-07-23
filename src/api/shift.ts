import { api } from '@/utils/api';
import type { Role, Space } from './user';

// ========== Types ==========

export const ShiftColors = ['#88F2D8', '#91D0C1', '#F8C9CB', '#E86969', '#A5D6F1', '#45B1ED'] as const;

export interface Duration {
  startTime: string;
  endTime: string;
}
export interface ShiftTemplate {
  id: number;
  spaceId: number;
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  name: string;
  startTime: string;
  endTime: string;
  notAvailableTimes: Duration[];
  color: string;
  maxClients: number | null;
  maxClientsForCoachClass: number | null;
}

export interface GroupShiftTemplate {
  id: number;
  spaceId: number;
  type: 11;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  numberOfClasses: number;
  maxClientsForGroupClass: number;
  remainingClasses: number;
}

export type UserShiftTemplate = ShiftTemplate | GroupShiftTemplate;

export interface AvailableClassesForGym {
  shiftTemplates: ShiftTemplate[];
  groupClasses: GroupShiftTemplate[];
}

export type GroupShiftTemplates = (ShiftTemplate | GroupShiftTemplate)[];

export interface GroupShiftTemplatePayload {
  numberOfClasses: number;
  maxClientsForGroupClass: number;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
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
  notAvailableTimes: Duration[] ;
  color: string;
  maxClients: number | null;
  maxClientsForCoachClass: number | null;
  groupClassId: number | null;
}

export interface CreateUserShift {
  userId: number;
  type: number;
  name: string | null;
  date: string;
  startTime: string;
  endTime: string;
  notAvailableTimes: Duration[];
  color: string;
  maxClients: number | null;
  maxClientsForCoachClass: number | null;
  groupClassId: number | null;
}
export interface UpdateUserShift {
  notAvailableTimes: Duration[];
}
export interface CreateShiftTemplate {
  type: number;
  name: string;
  startTime: string;
  endTime: string;
  notAvailableTimes: NotAvailableTime[];
  color: string;
  maxClients: number | null;
  maxClientsForCoachClass: number | null;
}

interface NotAvailableTime {
  startTime: string;
  endTime: string;
}
export interface UserShiftsGet {
  userIds: number[];
  startDate: string;
  endDate: string;
}

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

export async function createShiftTemplate(payload: CreateShiftTemplate) {
  const { data } = await api.post('shiftTemplates', payload);
  return data;
}

export async function updateShiftTemplate(shiftTemplateId: number, payload: CreateShiftTemplate) {
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

export async function createUserShift(payload: CreateUserShift) {
  const { data } = await api.post<any, CreateUserShift>(`userShifts`, payload);
  return data;
}

export async function updateUserShift(userShiftId: number, payload: UpdateUserShift) {
  const { data } = await api.patch(`userShifts/${userShiftId}`, payload);
  return data;
}

export async function deleteUserShift(userShiftId: number) {
  const { data } = await api.delete(`userShifts/${userShiftId}`);
  return data;
}
// ========== Group Related ==========
export async function fetchGroupShiftTemplates() {
  const { data } = await api.get<GroupShiftTemplate[]>('groupClasses');
  return data;
}

export async function createGroupShiftTemplate(payload: GroupShiftTemplatePayload) {
  const { data } = await api.post('groupClasses', payload);
  return data;
}

export async function deleteGroupShiftTemplate(id: number) {
  const { data } = await api.delete(`groupClasses/${id}`);
  return data;
}

export async function fetchAvailableClassesForGym() {
  const { data } = await api.get<AvailableClassesForGym>('userShifts/availableClassesForGym');
  return data;
}
