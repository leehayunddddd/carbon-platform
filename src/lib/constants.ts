export const EMISSION_FACTORS = {
  전기: 0.456,
  원소재: {
    플라스틱1: 2.3,
    플라스틱2: 3.2,
  },
  운송: 3.5,
} as const;

export const CHART_COLORS = {
  전기: '#22c55e',
  원소재: '#3b82f6',
  운송: '#f59e0b',
} as const;
