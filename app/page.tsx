'use client';

import { useState } from 'react';
import { parseExcelFile } from '@/lib/excel';
import {
  calculatePCF,
  getMonthlySummary,
  getTotalEmission,
  getEmissionByType,
} from '@/lib/pcf';
import { ActivityData, PCFResult, MonthlySummary } from '@/types';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [results, setResults] = useState<PCFResult[]>([]);
  const [monthly, setMonthly] = useState<MonthlySummary[]>([]);
  const [byType, setByType] = useState<{
    전기: number;
    원소재: number;
    운송: number;
  } | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setFileName(file.name);

    try {
      const data: ActivityData[] = await parseExcelFile(file);

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) throw new Error('Api 오류');

      const result = await response.json();

      setResults(result.results);
      setMonthly(result.monthly);
      setTotal(result.total);
      setByType(result.byType);
    } catch {
      setError('파일을 읽는 중 오류가 발생했습니다. 형식을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {results.length === 0 ? (
        <UploadScreen
          onUpload={handleFileUpload}
          loading={loading}
          error={error}
        />
      ) : (
        <Dashboard
          results={results}
          monthly={monthly}
          total={total}
          byType={byType!}
          fileName={fileName}
          onReset={() => {
            setResults([]);
            setMonthly([]);
            setTotal(0);
            setByType(null);
            setFileName('');
          }}
        />
      )}
    </main>
  );
}

function UploadScreen({
  onUpload,
  loading,
  error,
}: {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h1 className="text-4xl font-bold text-green-400 mb-2">
          탄소 관리 플랫폼
        </h1>
        <p className="text-gray-400 text-lg">
          엑셀 파일을 업로드하면 PCF를 자동 계산합니다
        </p>
      </div>

      <label className="cursor-pointer bg-green-600 hover:bg-green-500 transition-colors px-8 py-4 rounded-xl text-lg font-semibold">
        {loading ? '처리 중...' : '엑셀 파일 업로드'}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onUpload}
          className="hidden"
          disabled={loading}
        />
      </label>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="text-gray-500 text-sm text-center">
        <p>지원 형식: .xlsx, .xls</p>
        <p>과제용 데이터 시트를 그대로 업로드하세요</p>
      </div>
    </div>
  );
}
