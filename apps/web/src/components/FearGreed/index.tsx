'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getFearGreedIndex } from '@/api';
import { fearGreedColor, fearGreedIndex } from '@/data/fearGreed';
import type { FearGreed as FearGreedType } from '@/types/FearGreed';

const FearGreed = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['fear-greed'],
    queryFn: async () => {
      const res = await getFearGreedIndex();
      const { data } = res.data;
      return data;
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 50,
    select: (data) => {
      return data[0];
    },
  });

  return (
    <>
      <span>공포 · 탐욕 지수 :</span>
      <span
        className="ml-2 text-[var(--color)]"
        style={{
          '--color':
            fearGreedColor[data?.value_classification as FearGreedType],
        }}
      >
        {data?.value} -{' '}
        {fearGreedIndex[data?.value_classification as FearGreedType]}
      </span>
    </>
  );
};

export default FearGreed;
