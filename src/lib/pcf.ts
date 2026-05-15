import { ActivityData, PCFResult, MonthlySummary } from '@/types';
import { EMISSION_FACTORS } from './constants';

export function getEmissionFactor(
  activityType: string,
  description: string
): number {
  if (activityType === '전기') return EMISSION_FACTORS.전기;
  if (activityType === '운송') return EMISSION_FACTORS.운송;
  if (activityType === '원소재') {
    if (description === '플라스틱 2')
      return EMISSION_FACTORS.원소재['플라스틱2'];
    return EMISSION_FACTORS.원소재['플라스틱1'];
  }
  return 0;
}

export function calculatePCF(data: ActivityData[]): PCFResult[] {
  return data.map((item) => {
    const factor = getEmissionFactor(item.activityType, item.description);
    const emission = item.amount * factor;
    return { ...item, factor, emission };
  });
}

export function getMonthlySummary(results: PCFResult[]): MonthlySummary[] {
  const map = new Map<string, MonthlySummary>();
  results.forEach((r) => {
    const month = r.date.slice(0, 7);
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

export function getTotalEmission(results: PCFResult[]): number {
  return results.reduce((sum, r) => sum + r.emission, 0);
}

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
