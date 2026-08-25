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
    <Select value={currentFarmId} onValueChange={(val) => router.push(`/farm/${val}/overview`)}>
      <SelectTrigger className="w-full bg-background border-border shadow-sm">
        <SelectValue placeholder="Select Farm" />
      </SelectTrigger>
      <SelectContent>
        {farms.map((f) => (
          <SelectItem key={f.farm.id} value={f.farm.id}>
            {f.farm.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
