import { api } from '@/utils/api';
import { z } from 'zod';
import type { TherapyTypes } from '@/const/general';
import dayjs from 'dayjs';

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

export type TherapyType = `${TherapyTypes}`;
export interface TherapyTypesRes {
  therapyTypes: TherapyType[];
}

export interface Therapist {
  id: number;
  type: number;
  name: string;
}
export interface TherapistsRes {
  therapists: Therapist[];
}

export async function fetchTherapyTypes() {
  const { data } = await api.get<TherapyTypesRes>('appointment/therapy-types');
  return data;
}

export async function fetchTherapists(type: number) {
  const { data } = await api.get<TherapistsRes>(`appointment/therapists/${type}`);
  return data;
}
