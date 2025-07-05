'use client';

import { useId } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDailyVolumnPower } from '@/api';
import { cn } from '@/lib/utils';
import { DailyVolumnResponse } from '@/types/DailyVolumn';

type DailyVolumnClientProps = {
  initialData: DailyVolumnResponse;
  count: number;
  orderBy: string;
};

function DailyVolumnClient({
  initialData,
  orderBy,
  count,
}: DailyVolumnClientProps) {
  const id = useId();
  const { data } = useQuery({
    queryKey: ['daily-volumn', orderBy],
    queryFn: () => getDailyVolumnPower(orderBy, count),
    placeholderData: initialData,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });

  return (
    <div className={cn('flex flex-col p-2', 'max-md:text-xs')}>
      {data?.markets.map((item) => (
        <div
          className={cn('flex justify-between py-2')}
          key={`${id}-${item.code}`}
        >
          <div>
            <span className={cn('inline-block min-w-5')}>{item.rank}</span>{' '}
            {item.pair}
          </div>
          <div>{item.volumePower.toFixed(2)}%</div>
        </div>
      ))}
    </div>
  );
}

export default DailyVolumnClient;
