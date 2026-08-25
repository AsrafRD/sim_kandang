'use client';

import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

export function PerformanceChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-muted-foreground text-sm">Belum ada data harian untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          tickLine={false} 
          axisLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          dy={10}
        />
        <YAxis 
          tickLine={false} 
          axisLine={false}
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          labelStyle={{ fontWeight: 'bold', color: '#111827' }}
          itemStyle={{ color: '#4CAF50' }}
        />
        <Area 
          type="monotone" 
          dataKey="feedConsumedKg" 
          name="Konsumsi Pakan (Kg)"
          stroke="#4CAF50" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorFeed)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
