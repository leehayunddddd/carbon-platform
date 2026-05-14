import * as XLSX from 'xlsx';
import { ActivityData, ActivityType } from '@/types';

export function parseExcelFile(file: File): Promise<ActivityData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        console.log('시트 목록:', workbook.SheetNames);
        console.log('선택된 시트:', sheetName);

        const sheet = workbook.Sheets[sheetName];
        const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        });

        console.log('전체 행 수:', rows.length);
        console.log('첫 5행:', rows.slice(0, 5));

        const activities: ActivityData[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i] as unknown[];
          console.log(`행 ${i}:`, row);
          if (!row || row.length < 4) continue;

          const activityType = row[1] as ActivityType;
          if (!['전기', '원소재', '운송'].includes(activityType)) continue;

          const date = formatDate(row[0]);
          const description = (row[2] as string) || '';
          const amount = parseFloat(String(row[3])) || 0;
          const unit = (row[4] as string) || '';

          if (date && amount > 0) {
            activities.push({ date, activityType, description, amount, unit });
          }
        }

        console.log('파싱된 데이터:', activities.length, '건');
        resolve(activities);
      } catch (err) {
        console.error('파싱 오류:', err);
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function formatDate(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(
      date.d
    ).padStart(2, '0')}`;
  }
  return String(value).slice(0, 10);
}
