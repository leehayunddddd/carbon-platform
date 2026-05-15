import { NextRequest, NextResponse } from 'next/server';
import {
  calculatePCF,
  getMonthlySummary,
  getTotalEmission,
  getEmissionByType,
} from '@/lib/pcf';
import { ActivityData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: ActivityData[] = body.data;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: '올바른 데이터 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const results = calculatePCF(data);
    const monthly = getMonthlySummary(results);
    const total = getTotalEmission(results);
    const byType = getEmissionByType(results);

    return NextResponse.json({ results, monthly, total, byType });
  } catch {
    return NextResponse.json(
      { error: '계산 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
