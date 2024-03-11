import { z } from 'zod';
import { api } from '@/utils/api';
import type { PostRes } from '@/composables/helpers';

export enum ShiftTypes {
  PhysicalConsultation = '物理諮詢門診',
  PhysicalTherapy = '物理治療門診',
  FootPressure = '足壓門診',
  Nutrition = '營養門診',
  Sleep = '睡眠門診',
  Sports = '運科門診',
  OneOnOne = '一對一教練課',
  Group = '團課',
}

export const ShiftColors = ['#88F2D8', '#91D0C1', '#F8C9CB', '#E86969', '#A5D6F1', '#45B1ED'] as const;

export const shiftSchema = z.object({
  id: z.number().optional(),
  type: z.number(),
  name: z.string(),
  duration: z.number().array(),
  unavailable: z.number().array().array(),
  color: z.enum(ShiftColors),
});
export type ShiftSchema = z.infer<typeof shiftSchema>;

export interface ShiftReq {
  id?: number;
  type: number;
  name: string;
  duration: Record<string, number>;
  unavailable: Record<string, number>[];
  color: (typeof ShiftColors)[number];
}

export type ShiftRes = Required<ShiftReq>;

export async function getShiftList() {
  const { data } = await api.get<ShiftRes[]>('shift');
  return data;
}

export async function getShift(shiftId: number) {
  const { data } = await api.get<ShiftRes>(`shift/${shiftId}`);
  return data;
}

export async function createShift(payload: ShiftReq) {
  const { data } = await api.post<PostRes>('shift', payload);
  return data;
}

export async function updateShift(shiftId: number, payload: ShiftReq) {
  const { data } = await api.put<PostRes>(`shift/${shiftId}`, payload);
  return data;
}

export async function deleteShift(shiftId: number) {
  const { data } = await api.delete<PostRes>(`shift/${shiftId}`);
  return data;
}
