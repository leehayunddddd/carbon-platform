'use client';

import { PCFResult, MonthlySummary } from '@/types';
import MonthlyBarChart from './charts/MonthlyBarChart';
import TypePieChart from './charts/TypePieChart';
import TrendLineChart from './charts/TrendLineChart';

interface Props {
  results: PCFResult[];
  monthly: MonthlySummary[];
  total: number;
  byType: { 전기: number; 원소재: number; 운송: number };
  fileName: string;
  onReset: () => void;
}

export default function Dashboard({
  results,
  monthly,
  total,
  byType,
  fileName,
  onReset,
}: Props) {
  const pieData = [
    { name: '전기', value: parseFloat(byType.전기.toFixed(2)) },
    { name: '원소재', value: parseFloat(byType.원소재.toFixed(2)) },
    { name: '운송', value: parseFloat(byType.운송.toFixed(2)) },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-400">
            탄소 관리 플랫폼
          </h1>
          <p className="text-gray-400 mt-1">{fileName}</p>
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
          value={`${total.toFixed(2)}`}
          unit="kgCO₂e"
          color="text-green-400"
        />
        <SummaryCard
          title="전기"
          value={byType.전기.toFixed(2)}
          unit="kgCO₂e"
          color="text-green-400"
        />
        <SummaryCard
          title="원소재"
          value={byType.원소재.toFixed(2)}
          unit="kgCO₂e"
          color="text-blue-400"
        />
        <SummaryCard
          title="운송"
          value={byType.운송.toFixed(2)}
          unit="kgCO₂e"
          color="text-yellow-400"
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MonthlyBarChart data={monthly} />
        <TypePieChart data={pieData} />
        <TrendLineChart data={monthly} />
      </div>

      {/* 데이터 테이블 */}
      <div className="bg-gray-900 rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-4">
          상세 데이터 ({results.length}건)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-400 border-b border-gray-700">
                <th className="text-left py-2 pr-4">날짜</th>
                <th className="text-left py-2 pr-4">유형</th>
                <th className="text-left py-2 pr-4">설명</th>
                <th className="text-right py-2 pr-4">활동량</th>
                <th className="text-right py-2 pr-4">단위</th>
                <th className="text-right py-2 pr-4">배출계수</th>
                <th className="text-right py-2 pr-4">탄소배출량 (kgCO₂e)</th>
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
