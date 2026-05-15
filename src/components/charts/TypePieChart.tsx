'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/lib/constants';

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = [CHART_COLORS.전기, CHART_COLORS.원소재, CHART_COLORS.운송];

export default function TypePieChart({ data }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">활동 유형별 비율</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${((percent as number) * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value.toFixed(2)} kgCO₂e`]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
