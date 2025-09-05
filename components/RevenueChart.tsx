import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RevenueChartProps {
  data: { name: string; revenue: number }[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-brand-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-brand-gray-700">{label}</p>
          <p className="text-brand-blue">{`Receita: ${payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</p>
        </div>
      );
    }
  
    return null;
  };

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${Number(value) / 1000}k`}/>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}/>
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Receita"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
