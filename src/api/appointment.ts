import { api } from '@/utils/api';
import { z } from 'zod';
import dayjs from 'dayjs';
import type { Employee } from './shift';

export const bookingSchema = z.object({
  therapyType: z.number({ required_error: '必填' }).nullable(),
  therapist: z.number().optional().nullable(),
  date: z.string().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
});
export type BookingSchema = z.infer<typeof bookingSchema>;
export const bookingInitialValues: Partial<BookingSchema> = {
  date: dayjs().format('YYYY-MM-DD'),
};

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
export interface Client {
  id: number;
  memberId: number;
  name: string;
  phone: string;
  address: string;
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
  employee: Employee;
  client: Client;
  therapist: Therapist;
  left?: number;
  width?: number;
}

export async function fetchTherapyTypes() {
  const { data } = await api.get<TherapyTypesRes>('appointment/therapy-types');
  return data;
}

export async function fetchTherapists(type: number) {
  const { data } = await api.get<TherapistsRes>(`appointment/therapists/${type}`);
  return data;
}
