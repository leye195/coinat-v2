import { Suspense } from 'react';
import Skeleton from '@/components/Skeleton';
import { cn } from '@/lib/utils';
import FearGreed from './index';

export default function FearGreedServer() {
  return (
    <section
      className={cn(
        'flex justify-between items-center',
        'p-3 mt-2 bg-white border border-[#d0d0d0] font-semibold',
        'max-md:p-2 max-md:mt-0 max-md:text-sm',
        'max-sm:text-[11px]',
      )}
    >
      <div className="inline-flex">
        <Suspense
          fallback={<Skeleton width="100%" height={20} borderRadius="4px" />}
        >
          <FearGreed />
        </Suspense>
      </div>
    </section>
  );
}
