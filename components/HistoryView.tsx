
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Entry } from '../types';

interface HistoryViewProps {
  entries: Entry[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ entries }) => {
  const chartData = useMemo(() => {
    // Sort entries by time
    const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    
    // Get all unique value labels ever used
    const allValueLabels = new Set<string>();
    sorted.forEach(e => e.valuePoints.forEach(p => allValueLabels.add(p.label)));
    
    // Format for Recharts
    return {
      labels: Array.from(allValueLabels),
      data: sorted.map(entry => {
        const point: any = {
          date: new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        };
        entry.valuePoints.forEach(p => {
          point[p.label] = p.score;
        });
        return point;
      })
    };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-[3rem]">
        <p className="text-gray-300 serif text-lg italic">Your journey awaits its first archive.</p>
      </div>
    );
  }

  // Generate colors for lines
  const colors = [
    '#002395', '#ED2939', '#1a1a1a', '#6b7280', 
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b'
  ];

  return (
    <div className="h-[500px] w-full pt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData.data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#d1d1d1', fontSize: 10, letterSpacing: '0.1em' }}
            dy={10}
          />
          <YAxis 
            domain={[0, 10]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#d1d1d1', fontSize: 10 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '24px', 
              border: 'none', 
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
              fontSize: '11px',
              fontFamily: 'Inter',
              padding: '16px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            wrapperStyle={{ paddingTop: '40px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em' }} 
          />
          {chartData.labels.map((label, index) => (
            <Line 
              key={label}
              type="monotone" 
              dataKey={label} 
              stroke={colors[index % colors.length]} 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls // Allows lines to skip dates where a specific value wasn't tracked
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryView;
