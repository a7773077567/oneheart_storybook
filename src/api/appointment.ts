import { api } from '@/utils/api';
import { z } from 'zod';
import type { User } from '@/api/user';
import type { UserShift } from '@/api/shift';

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
// export interface Client {
//   id: number;
//   memberId: number;
//   name: string;
//   phone: string;
//   address: string;
// }

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
  // clientId: number;
  client: Client;
  // date: string;
  // userShiftId: number;
  user: User;
  userShift: UserShift;
  userShiftSnapshot?: any;
  userShiftSlotId: number;
  userShiftSlotSnapshot?: any;
  userShiftAppointmentId: number;
  userShiftAppointmentSnapshot?: any;
  paymentState: number;
  state: number;
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

export async function fetchTherapyTypes() {
  const { data } = await api.get<TherapyTypesRes>('appointment/therapy-types');
  return data;
}

export async function fetchTherapists(type: number) {
  const { data } = await api.get<TherapistsRes>(`appointment/therapists/${type}`);
  return data;
}

// ========== Schemas ==========
export const bookingSchema = z.object({
  therapyType: z.number({ required_error: '必填' }).nullable(),
  therapist: z.number().optional().nullable(),
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});
export type BookingSchema = z.infer<typeof bookingSchema>;
