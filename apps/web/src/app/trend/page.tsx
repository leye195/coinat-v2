import { Suspense } from 'react';
import DailyVolumn from '@/components/DailyVolumn';
import DailyVolumnSkeleton from '@/components/DailyVolumn/DailyVolumnSkeleton';
import Page from './components/Page';

export default async function TrendPage() {
  return (
    <Page
      dailyAskVolumn={
        <Suspense fallback={<DailyVolumnSkeleton />}>
          <DailyVolumn orderBy="ask" count={10} />
        </Suspense>
      }
      dailyBidVolumn={
        <Suspense fallback={<DailyVolumnSkeleton />}>
          <DailyVolumn orderBy="bid" count={10} />
        </Suspense>
      }
    />
  );
}
