import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: { name: string; value: number }[];
  color?: string;
  title?: string;
}

export default function AnalyticsLineChart({ data, color = '#D4AF37', title }: LineChartProps) {
  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-bold text-white mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
