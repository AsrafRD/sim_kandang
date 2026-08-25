'use client';

import dynamic from 'next/dynamic';
import type { FarmMapData } from './FarmMap';

const FarmMap = dynamic(() => import('./FarmMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-2xl mb-6 border border-border" />
});

export default function FarmMapDynamic({ farms }: { farms: FarmMapData[] }) {
  return <FarmMap farms={farms} />;
}
