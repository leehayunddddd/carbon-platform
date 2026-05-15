'use client';

import { MonthlySummary } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: MonthlySummary[];
}

export default function TrendLineChart({ data }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 md:col-span-2">
      <h2 className="text-lg font-semibold mb-4">월별 총 배출량 추이</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: '#22c55e' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
