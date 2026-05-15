'use client';

import { CHART_COLORS } from '@/lib/constants';
import { MonthlySummary } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: MonthlySummary[];
}

export default function MonthlyBarChart({ data }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">월별 탄소 배출량</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Bar dataKey="전기" fill={CHART_COLORS.전기} radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="원소재"
            fill={CHART_COLORS.원소재}
            radius={[4, 4, 0, 0]}
          />
          <Bar dataKey="운송" fill={CHART_COLORS.운송} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
