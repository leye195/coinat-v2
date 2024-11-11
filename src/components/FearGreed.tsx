import { useQuery } from 'react-query';
import { getFearGreedIndex } from '@/api';
import Skeleton from '@/components/Skeleton';
import { fearGreedColor, fearGreedIndex } from '@/data/fearGreed';
import { cn } from '@/lib/utils';
import type { FearGreed } from '@/types/FearGreed';

const FearGreed = () => {
  const { isLoading, data } = useQuery(
    ['fear-greed'],
    async () => {
      const res = await getFearGreedIndex();
      const { data } = res.data;
      return data;
    },
    {
      refetchIntervalInBackground: true,
      refetchInterval: 1000 * 50,
      select: (data) => {
        return data[0];
      },
    },
  );

  return (
    <section
      className={cn(
        'p-3 mt-2 bg-white border border-[#d0d0d0] font-semibold',
        'max-md:p-2 max-md:mt-0 max-md:text-sm',
        'max-sm:text-[11px]',
      )}
    >
      {isLoading ? (
        <Skeleton width="100%" height={20} borderRadius="4px" />
      ) : (
        <>
          <span>공포 · 탐욕 지수 :</span>
          <span
            className="ml-2 text-[var(--color)]"
            style={{
              '--color':
                fearGreedColor[data?.value_classification as FearGreed],
            }}
          >
            {data?.value} -{' '}
            {fearGreedIndex[data?.value_classification as FearGreed]}
          </span>
        </>
      )}
    </section>
  );
};

export default FearGreed;
