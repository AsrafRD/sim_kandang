'use client';

import dynamic from 'next/dynamic';
import type { LocationPickerProps } from './LocationPicker';

const LocationPicker = dynamic(() => import('./LocationPicker'), { 
  ssr: false,
  loading: () => <div className="h-[250px] w-full bg-muted animate-pulse rounded-xl border border-border" />
});

export default function LocationPickerDynamic(props: LocationPickerProps) {
  return <LocationPicker {...props} />;
}
