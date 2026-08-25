import { z } from 'zod';

export const dailyRecordSchema = z.object({
  date: z.string().or(z.date()),
  mortality: z.coerce.number().min(0, "Kematian tidak bisa negatif"),
  culling: z.coerce.number().min(0, "Afkir tidak bisa negatif"),
  feedConsumedKg: z.coerce.number().min(0, "Pakan tidak bisa negatif"),
  waterConsumedL: z.coerce.number().min(0, "Air tidak bisa negatif"),
  temperature: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export type DailyRecordInput = z.infer<typeof dailyRecordSchema>;
