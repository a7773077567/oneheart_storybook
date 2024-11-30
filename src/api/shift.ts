import { api } from '@/utils/api';
import type { ShiftType, SpaceType } from '@/const/general';
import type { User } from './user';

// import type { Role, Space, User } from './user';

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
  color: string;
  endTime: string;
  id: number;
  maxClientsForGroupClass: number;
  name: string;
  numberOfClasses: number; // 團課總數
  remainingClasses: number; // 剩餘可排數量
  scheduleClasses: number; // 已排課數量
  spaceId: number;
  startTime: string;
  type: ShiftType.團課;
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
  color: string;
  date: string;
  endTime: string;
  groupClass: null | GroupShiftTemplate;
  id: number;
  maxClients: number | null;
  maxClientsForCoachClass: number | null;
  name: string;
  notAvailableTimes: Duration[];
  spaceId: number;
  startTime: string;
  type: ShiftType;
  userId: number;
  user: Pick<User, 'id' | 'name' | 'role'>;
  space: {
    id: number;
    name: string;
    type: SpaceType;
  };
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
  userShiftTypes?: ShiftType[];
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
