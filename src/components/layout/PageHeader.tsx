'use client';
import { usePathname } from 'next/navigation';

export function PageHeader() {
  const pathname = usePathname();

  let title = '';
  let description = '';

  if (pathname.includes('/overview')) {
    title = 'Ringkasan';
    description = 'Ringkasan operasional kandang dan performa keseluruhan.';
  } else if (pathname.includes('/analytics')) {
    title = 'Command Center';
    description = 'Deep analytics and performance projection.';
  } else if (pathname.includes('/barns')) {
    title = 'Data Kandang';
    description = 'Peta sebaran kandang dan simulasi kondisi.';
  } else if (pathname.includes('/livestock')) {
    title = 'Ternak (Broiler)';
    description = 'Manajemen populasi dan data ternak aktif.';
  } else if (pathname.includes('/feeding')) {
    title = 'Manajemen Pakan';
    description = 'Inventaris dan konsumsi pakan harian.';
  } else if (pathname.includes('/health')) {
    title = 'Kesehatan & Vaksin';
    description = 'Manajemen kesehatan, vaksin, dan vitamin.';
  } else if (pathname.includes('/daily-input')) {
    title = 'Laporan Harian';
    description = 'Pencatatan data harian (mortalitas, pakan, dll).';
  } else if (pathname.includes('/reports')) {
    title = 'Reports';
    description = 'Laporan keseluruhan operasional.';
  } else if (pathname.includes('/settings')) {
    title = 'Pengaturan';
    description = 'Pengaturan sistem dan manajemen tim.';
  } else {
    title = 'FARMOS';
    description = 'Sistem Manajemen Kandang Modern';
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-lg md:text-xl font-bold font-heading text-foreground tracking-tight">{title}</h1>
      <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-md md:max-w-xl">{description}</p>
    </div>
  );
}
