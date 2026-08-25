'use client';

import { useActionState } from 'react';
import { updateFarmAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Map, Warehouse, MapPin, CheckCircle2 } from 'lucide-react';
import LocationPickerDynamic from '@/components/maps/LocationPickerDynamic';
import { Farm } from '@prisma/client';

export function SettingsForm({ farm }: { farm: Farm }) {
  const updateWithId = updateFarmAction.bind(null, farm.id);
  const [state, formAction, isPending] = useActionState(updateWithId, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 font-medium">
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-md border border-green-500/20 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <Warehouse className="w-4 h-4" />
          Nama Kandang / Bisnis
        </Label>
        <Input 
          id="name" 
          name="name" 
          type="text" 
          defaultValue={farm.name}
          required 
          className="bg-background/50 border-border"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Alamat Lengkap (Opsional)
        </Label>
        <Input 
          id="address" 
          name="address" 
          type="text" 
          defaultValue={farm.address || ''}
          className="bg-background/50 border-border"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 mb-2">
          <Map className="w-4 h-4" />
          Titik Lokasi (Maps)
        </Label>
        <LocationPickerDynamic 
          initialLat={farm.latitude}
          initialLng={farm.longitude}
        />
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          disabled={isPending}
        >
          {isPending ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
