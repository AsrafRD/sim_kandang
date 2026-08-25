'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dailyRecordSchema, type DailyRecordInput } from '@/lib/validations/dailyRecord';
import { submitDailyRecordAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DailyInputPage() {
  const params = useParams();
  const farmId = params.farmId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DailyRecordInput>({
    resolver: zodResolver(dailyRecordSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      mortality: 0,
      culling: 0,
      feedConsumedKg: 0,
      waterConsumedL: 0,
    }
  });

  const onSubmit = async (data: DailyRecordInput) => {
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await submitDailyRecordAction(farmId, formData);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result.success) {
        setMessage({ type: 'success', text: 'Daily record submitted successfully!' });
        reset();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card className="border-border shadow-md">
        <CardHeader className="bg-primary/5 border-b border-border pb-6">
          <CardTitle className="text-2xl font-bold font-heading text-primary">Daily Input</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Catat perkembangan dan konsumsi harian kandang.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8">
          {message && (
            <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 ${
              message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
            }`}>
              {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="date" className="text-base">Tanggal Pencatatan</Label>
              <Input 
                id="date" 
                type="date" 
                {...register('date')}
                className="h-14 text-lg border-2 bg-background"
              />
              {errors.date && <p className="text-destructive text-sm">{errors.date.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="mortality" className="text-base text-destructive font-semibold">Kematian (Ekor)</Label>
                <Input 
                  id="mortality" 
                  type="number"
                  inputMode="numeric"
                  {...register('mortality')}
                  className="h-14 text-xl font-bold text-center border-2 border-destructive/20 focus-visible:ring-destructive"
                />
                {errors.mortality && <p className="text-destructive text-sm">{errors.mortality.message as string}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="culling" className="text-base text-warning font-semibold">Afkir (Ekor)</Label>
                <Input 
                  id="culling" 
                  type="number"
                  inputMode="numeric"
                  {...register('culling')}
                  className="h-14 text-xl font-bold text-center border-2 border-warning/20 focus-visible:ring-warning"
                />
                {errors.culling && <p className="text-destructive text-sm">{errors.culling.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="space-y-3">
                <Label htmlFor="feedConsumedKg" className="text-base">Konsumsi Pakan (Kg)</Label>
                <Input 
                  id="feedConsumedKg" 
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  {...register('feedConsumedKg')}
                  className="h-14 text-lg border-2 bg-background"
                />
                {errors.feedConsumedKg && <p className="text-destructive text-sm">{errors.feedConsumedKg.message as string}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="waterConsumedL" className="text-base">Konsumsi Air (L)</Label>
                <Input 
                  id="waterConsumedL" 
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  {...register('waterConsumedL')}
                  className="h-14 text-lg border-2 bg-background"
                />
                {errors.waterConsumedL && <p className="text-destructive text-sm">{errors.waterConsumedL.message as string}</p>}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <Label htmlFor="temperature" className="text-base">Suhu Kandang (°C) - Opsional</Label>
              <Input 
                id="temperature" 
                type="number"
                step="0.1"
                inputMode="decimal"
                {...register('temperature')}
                className="h-14 text-lg border-2 bg-background"
                placeholder="28.5"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="notes" className="text-base">Catatan / Kejadian Khusus</Label>
              <Input 
                id="notes" 
                type="text"
                {...register('notes')}
                className="h-14 text-base border-2 bg-background"
                placeholder="Misal: Hujan lebat, lampu mati 2 jam"
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="w-full h-16 text-lg font-bold shadow-lg mt-8"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Laporan Harian'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
