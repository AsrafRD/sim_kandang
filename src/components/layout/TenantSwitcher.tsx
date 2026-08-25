'use client';

import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TenantSwitcher({ farms, currentFarmId }: { farms: any[], currentFarmId: string }) {
  const router = useRouter();
  
  return (
    <Select 
      value={currentFarmId} 
      onValueChange={(val) => {
        if (val === 'create_new_farm') {
          router.push('/farm/create');
        } else {
          router.push(`/farm/${val}/overview`);
        }
      }}
    >
      <SelectTrigger className="w-full bg-background border-border shadow-sm">
        <SelectValue>
          {farms.find(f => f.farm.id === currentFarmId)?.farm.name || 'Select Farm'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {farms.map((f) => (
          <SelectItem key={f.farm.id} value={f.farm.id}>
            {f.farm.name}
          </SelectItem>
        ))}
        <div className="h-px bg-border my-1" />
        <SelectItem value="create_new_farm" className="text-primary font-medium focus:bg-primary/10">
          + Buat Kandang Baru
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
