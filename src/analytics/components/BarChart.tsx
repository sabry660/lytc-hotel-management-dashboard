import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  title?: string;
}

export default function AnalyticsBarChart({ data, color = '#D4AF37', title }: BarChartProps) {
  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-bold text-white mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
          <XAxis 
            dataKey="name" 
            stroke="#666" 
            fontSize={12}
            tick={{ fill: '#666' }}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12}
            tick={{ fill: '#666' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#090909', 
              border: '1px solid #333',
              borderRadius: '8px'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar 
            dataKey="value" 
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
