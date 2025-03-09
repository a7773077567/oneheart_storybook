import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1),
  phone: z.string().length(10, { message: '請輸入完整手機號碼' }).startsWith('09', { message: '請輸入台灣手機號碼' }),
  gender: z.string().nullable().optional(),
  identityNumber: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  introducerClientId: z.number().nullable().optional(),
  howToKnowUs: z.string(),
});
