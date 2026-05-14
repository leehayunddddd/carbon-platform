'use client';

import { PCFResult, MonthlySummary } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface Props {
  results: PCFResult[];
  monthly: MonthlySummary[];
  total: number;
  byType: { 전기: number; 원소재: number; 운송: number };
  fileName: string;
  onReset: () => void;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

export default function Dashboard({
  results,
  monthly,
  total,
  byType,
  fileName,
  onReset,
}: Props) {
  const pieData = [
    { name: '전기', value: Math.round(byType.전기 * 100) / 100 },
    { name: '원소재', value: Math.round(byType.원소재 * 100) / 100 },
    { name: '운송', value: Math.round(byType.운송 * 100) / 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-400">
            🌿 탄소 관리 플랫폼
          </h1>
          <p className="text-gray-400 mt-1">📄 {fileName}</p>
        </div>
        <button
          onClick={onReset}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          ← 새 파일 업로드
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="총 탄소 배출량"
          value={`${total.toFixed(1)}`}
          unit="kgCO₂e"
          color="text-green-400"
        />
        <SummaryCard
          title="전기"
          value={byType.전기.toFixed(1)}
          unit="kgCO₂e"
          color="text-green-400"
        />
        <SummaryCard
          title="원소재"
          value={byType.원소재.toFixed(1)}
          unit="kgCO₂e"
          color="text-blue-400"
        />
        <SummaryCard
          title="운송"
          value={byType.운송.toFixed(1)}
          unit="kgCO₂e"
          color="text-yellow-400"
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 월별 바 차트 */}
        <div className="bg-gray-900 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">월별 탄소 배출량</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly}>
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
              <Bar dataKey="전기" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="원소재" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="운송" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 파이 차트 */}
        <div className="bg-gray-900 rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">활동 유형별 비율</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toFixed(1)} kgCO₂e`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 월별 추이 라인 차트 */}
        <div className="bg-gray-900 rounded-xl p-5 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">월별 총 배출량 추이</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthly}>
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
      </div>

      {/* 데이터 테이블 */}
      <div className="bg-gray-900 rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">
          상세 데이터 ({results.length}건)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2 pr-4">날짜</th>
                <th className="text-left py-2 pr-4">유형</th>
                <th className="text-left py-2 pr-4">설명</th>
                <th className="text-right py-2 pr-4">활동량</th>
                <th className="text-right py-2 pr-4">단위</th>
                <th className="text-right py-2 pr-4">배출계수</th>
                <th className="text-right py-2">탄소배출량 (kgCO₂e)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-2 pr-4">{r.date}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        r.activityType === '전기'
                          ? 'bg-green-900 text-green-300'
                          : r.activityType === '원소재'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}
                    >
                      {r.activityType}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-gray-300">{r.description}</td>
                  <td className="py-2 pr-4 text-right">
                    {r.amount.toLocaleString()}
                  </td>
                  <td className="py-2 pr-4 text-right text-gray-400">
                    {r.unit}
                  </td>
                  <td className="py-2 pr-4 text-right text-gray-400">
                    {r.factor}
                  </td>
                  <td className="py-2 text-right font-semibold text-green-400">
                    {r.emission.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  unit,
  color,
}: {
  title: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-gray-500 text-xs mt-1">{unit}</p>
    </div>
  );
}
