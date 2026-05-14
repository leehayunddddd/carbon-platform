import {
  ActivityData,
  EmissionFactor,
  PCFResult,
  MonthlySummary,
} from '@/types';

// 배출계수 (과제 데이터 기준)
export const EMISSION_FACTORS: EmissionFactor[] = [
  { activity: '전기', factor: 0.456, unit: 'kgCO2e / kWh' },
  { activity: '원소재(플라스틱1)', factor: 2.3, unit: 'kgCO2e / kg' },
  { activity: '원소재(플라스틱2)', factor: 3.2, unit: 'kgCO2e / kg' },
  { activity: '운송', factor: 3.5, unit: 'kgCO2e / ton-km' },
];

// 활동 유형별 배출계수 가져오기
export function getEmissionFactor(
  activityType: string,
  description: string
): number {
  if (activityType === '전기') return 0.456;
  if (activityType === '운송') return 3.5;
  if (activityType === '원소재') {
    if (description.includes('2')) return 3.2;
    return 2.3;
  }
  return 0;
}

// PCF 계산
export function calculatePCF(data: ActivityData[]): PCFResult[] {
  return data.map((item) => {
    const factor = getEmissionFactor(item.activityType, item.description);
    const emission = item.amount * factor;
    return { ...item, factor, emission };
  });
}

// 월별 요약
export function getMonthlySummary(results: PCFResult[]): MonthlySummary[] {
  const map = new Map<string, MonthlySummary>();

  results.forEach((r) => {
    const month = r.date.slice(0, 7); // "2025-01"
    if (!map.has(month)) {
      map.set(month, { month, 전기: 0, 원소재: 0, 운송: 0, total: 0 });
    }
    const entry = map.get(month)!;
    entry[r.activityType] += r.emission;
    entry.total += r.emission;
  });

  return Array.from(map.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
}

// 전체 총합
export function getTotalEmission(results: PCFResult[]): number {
  return results.reduce((sum, r) => sum + r.emission, 0);
}

// 활동 유형별 합계
export function getEmissionByType(results: PCFResult[]) {
  return {
    전기: results
      .filter((r) => r.activityType === '전기')
      .reduce((s, r) => s + r.emission, 0),
    원소재: results
      .filter((r) => r.activityType === '원소재')
      .reduce((s, r) => s + r.emission, 0),
    운송: results
      .filter((r) => r.activityType === '운송')
      .reduce((s, r) => s + r.emission, 0),
  };
}
