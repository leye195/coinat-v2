import { format } from 'date-fns';
import { ParsedCandle } from 'hooks/queries/useUpbitCandles';

export function getCandleKey(timestamp: number, unit: '1M' | '1D' | '1W') {
  const date = new Date(timestamp);

  switch (unit) {
    case '1D':
      date.setHours(0, 0, 0, 0);
      break;
    case '1W': {
      const day = date.getUTCDay(); // 0 (Sun) ~ 6 (Sat)
      const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday 기준
      date.setUTCDate(diff);
      date.setUTCHours(0, 0, 0, 0);
      break;
    }
    case '1M':
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
      break;
  }

  return date; // 초 단위
}

export type Unit = 'days' | 'weeks' | 'months';

// ✅ 단위 변환 도우미
export function getUnitKey(unit: Unit): '1D' | '1W' | '1M' {
  if (unit === 'days') return '1D';
  if (unit === 'weeks') return '1W';
  if (unit === 'months') return '1M';
  throw new Error('Invalid unit');
}

export const transformData = (data: ParsedCandle[]) => {
  return data?.map(({ open, high, low, close, timestamp }) => {
    const date = new Date(timestamp);
    return{ open,
      high,
      low,
      close,
      time: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
      timestamp,
    }
  });
};
