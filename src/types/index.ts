export type ActivityType = '전기' | '원소재' | '운송';

export interface ActivityData {
  date: string;
  activityType: ActivityType;
  description: string;
  amount: number;
  unit: string;
}

export interface EmissionFactor {
  activity: string;
  factor: number;
  unit: string;
}

export interface PCFResult {
  date: string;
  activityType: ActivityType;
  description: string;
  amount: number;
  unit: string;
  factor: number;
  emission: number;
}

export interface MonthlySummary {
  month: string;
  전기: number;
  원소재: number;
  운송: number;
  total: number;
}
