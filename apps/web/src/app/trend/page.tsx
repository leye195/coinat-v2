import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DailyVolumn from '@/components/DailyVolumn';
import DailyVolumnSkeleton from '@/components/DailyVolumn/DailyVolumnSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import { Flex } from '@/components/Flex';
import Page from './components/Page';

export default async function TrendPage() {
  return (
    <Page
      dailyAskVolumn={
        <ErrorBoundary
          fallback={
            <Flex
              className="h-[415px]"
              isFull
              alignItems="center"
              justifyContent="center"
            >
              <ErrorMessage
                title="데이터를 불러오지 못했어요."
                description="잠시 후 다시 시도해주세요."
              />
            </Flex>
          }
        >
          <Suspense fallback={<DailyVolumnSkeleton />}>
            <DailyVolumn orderBy="ask" count={10} />
          </Suspense>
        </ErrorBoundary>
      }
      dailyBidVolumn={
        <ErrorBoundary
          fallback={
            <Flex
              className="h-[415px]"
              isFull
              alignItems="center"
              justifyContent="center"
            >
              <ErrorMessage
                title="데이터를 불러오지 못했어요."
                description="잠시 후 다시 시도해주세요."
              />
            </Flex>
          }
        >
          <Suspense fallback={<DailyVolumnSkeleton />}>
            <DailyVolumn orderBy="bid" count={10} />
          </Suspense>
        </ErrorBoundary>
      }
    />
  );
}
