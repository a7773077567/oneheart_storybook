import { api } from '@/utils/api';
import { z } from 'zod';
import type { UserShift } from '@/api/shift';
import { getTimeDate } from '@/utils/date';

export interface TherapyTypesRes {
  therapyTypes: string[];
}

export interface Therapist {
  id: number;
  type: number;
  name: string;
  avatar: string;
}
export interface TherapistsRes {
  therapists: Therapist[];
}

export interface Location {
  id: number;
  type: number;
  name: string;
  accommodation: number;
}

export interface ClientsGetParams {
  names?: string[];
  phones?: string[];
}

export interface ClientAssociation {
  id: number;
  name: string;
  phone: string;
  identityType: number;
  identityNumber: string;
  birthDate: string;
}
export interface Client extends ClientAssociation {
  email: string;
  lineUserId: string;
  isVerifiedBySMS: boolean;
  associations: ClientAssociation[];
}

export interface ClientSchedule {
  id: number;
  clientId: number;
  client: Client;
  date: string;
  userShiftId: number;
  userShift: UserShift;
  userShiftSlotId: number;
  userShiftAppointmentId: number;
  scheduleStartTime: string;
  scheduleEndTime: string;
  bookedNumber: number;
  paymentState: number;
  state: number;
  isValidForRestore: boolean;
}

export interface BookingItem {
  id: number;
  type: number;
  date: string;
  time: string;
  isBooked: boolean;
  available: boolean;
  location: number;
  state: number;
  isCheckout: boolean;
  employee: any;
  client: Client;
  therapist: Therapist;
  left?: number;
  width?: number;
}

export interface AppointmentStatus {
  maxNumber: number;
  bookedNumber: number;
  leftNumber: number;
  currentProximateNumber: number;
}

export interface Available {
  slotId: number;
  userShiftId: number;
  type: number | null;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  user: {
    id: number;
    name: string;
  };
  appointmentStatus: AppointmentStatus | null;
}

export interface AppointmentReq {
  isEmployeePrice: boolean;
  slotId: number | null;
  userShiftId: number;
  bookingClientId: number;
}

export interface AppointmentRearrangeReq {
  clientScheduleId: number;
  slotId: number;
  userShiftId: number;
}

// ========== Requests ==========

export async function fetchTherapyTypes() {
  const { data } = await api.get<TherapyTypesRes>('appointment/therapy-types');
  return data;
}

export async function fetchTherapists(type: number) {
  const { data } = await api.get<TherapistsRes>(`appointment/therapists/${type}`);
  return data;
}

export async function fetchClients(params?: ClientsGetParams) {
  const { data } = await api.get<Client[]>('clients', { params });
  return data;
}

export async function createAppointment(payload: AppointmentReq) {
  const { data } = await api.post<any, AppointmentReq>('appointments/appointment', payload);
  return data;
}

export async function fetchAvailable(params: AvailableReq) {
  const { data } = await api.get<Available[]>('appointments/available', { params });
  return data;
}
export async function fetchAvailableRearranged(params: AvailableRearrangedReq) {
  const { data } = await api.get<Available[]>('appointments/available-rearranged', { params });
  return data;
}

export async function createAppointmentRearrange(payload: AppointmentRearrangeReq) {
  const { data } = await api.post<any, AppointmentRearrangeReq>('appointments/appointment-rearrange', payload);
  return data;
}

export async function fetchClientSchedulesNotStarted(params: ClientSchedulesNotStartedReq) {
  const { data } = await api.get<ClientSchedule[]>('clientSchedules/not-started', { params });
  return data;
}

export async function fetchClientSchedulesHistories(params: ClientSchedulesHistoriesReq) {
  const { data } = await api.get<ClientSchedule[]>('clientSchedules/histories', { params });
  return data;
}

export async function cancelClientScheduleNotStarted(clientScheduleId: number) {
  const { data } = await api.post(`clientSchedules/${clientScheduleId}/cancel`);
  return data;
}

export async function fetchClientSchedulesInProgress(date: string) {
  const { data } = await api.get<ClientSchedule[]>('clientSchedules/in-progress', { params: { date } });
  return data;
}

export async function restoreClientSchedule(clientScheduleId: number) {
  const { data } = await api.post(`clientSchedules/${clientScheduleId}/restore`);
  return data;
}

// ========== Schemas ==========
export const availableReqSchema = z.object({
  userShiftType: z.number({ required_error: '必填' }),
  userIds: z.number().array().min(1, { message: '至少選擇1名治療師' }),
  date: z.string(),
  startTime: z.string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
  endTime: z.string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
})
  .refine(({ startTime, endTime }) => {
    const start = getTimeDate(startTime);
    const end = getTimeDate(endTime);
    return end.isAfter(start);
  }, {
    message: '結束時間必須大於開始時間',
    path: ['endTime'],
  });
export type AvailableReq = z.infer<typeof availableReqSchema>;

export const availableRearrangedSchema = z.object({
  clientScheduleId: z.number(),
  date: z.string(),
  startTime: z.string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
  endTime: z.string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
}).refine(({ startTime, endTime }) => {
  const start = getTimeDate(startTime);
  const end = getTimeDate(endTime);
  return end.isAfter(start);
}, {
  message: '結束時間必須大於開始時間',
  path: ['endTime'],
});
export type AvailableRearrangedReq = z.infer<typeof availableRearrangedSchema>;

export const ClientSchedulesNotStartedSchema = z.object({
  phone: z.string().optional(),
  name: z.string().optional(),
  userShiftTypes: z.number().array(),
  date: z.string(),
});
export type ClientSchedulesNotStartedReq = z.infer<typeof ClientSchedulesNotStartedSchema>;

export const clientSchedulesHistoriesSchema = z.object({
  phone: z.string().optional(),
  name: z.string().optional(),
  userShiftTypes: z.number().array(),
  startDate: z.string(),
  endDate: z.string(),
});
export type ClientSchedulesHistoriesReq = z.infer<typeof clientSchedulesHistoriesSchema>;
