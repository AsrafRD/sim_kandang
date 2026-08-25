'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts';

export function PerformanceChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#263D28" vertical={false} />
          
          <XAxis 
            dataKey="dateStr" 
            stroke="#7C8176" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          
          <YAxis 
            yAxisId="left" 
            stroke="#7C8176"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
            label={{ value: 'Feed (Kg)', angle: -90, position: 'insideLeft', fill: '#7C8176' }}
          />
          
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#C65A4A" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={10}
            label={{ value: 'Mortality (Birds)', angle: 90, position: 'insideRight', fill: '#C65A4A' }}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#233629', borderColor: '#263D28', color: '#F5F2E8', borderRadius: '8px' }}
            itemStyle={{ color: '#F5F2E8' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {/* Feed Consumption - Bar */}
          <Bar 
            yAxisId="left" 
            dataKey="feedConsumedKg" 
            name="Feed Consumed (Kg)" 
            fill="#D7A84A" 
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          
          {/* Mortality - Line */}
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="mortality" 
            name="Mortality" 
            stroke="#C65A4A" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#C65A4A', strokeWidth: 2, stroke: '#17221C' }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
