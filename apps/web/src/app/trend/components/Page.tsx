'use client';

import { ReactNode, Suspense, useCallback, useId, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Divider } from '@/components/Divider';
import ErrorMessage from '@/components/ErrorMessage';
import { Flex } from '@/components/Flex';
import MarketCapTable from '@/components/MarketCapTable';
import NewsSkeleton from '@/components/News/NewsSkeleton';
import NewsList from '@/components/NewsList';
import Tab, { ActiveBar } from '@/components/Tab';
import TableSkeleton from '@/components/Table/Skeleton';
import Text from '@/components/Text';
import { newsTabs } from '@/data/tab';
import { useMount } from '@/hooks';
import { cn } from '@/lib/utils';
import { palette } from '@/styles/variables';

type TrendPageProps = {
  dailyAskVolumn: ReactNode;
  dailyBidVolumn: ReactNode;
};

const TrendPage = ({ dailyAskVolumn, dailyBidVolumn }: TrendPageProps) => {
  const isMounted = useMount();
  const id = useId();
  const [activeTab, setActiveTab] = useState({
    name: 'all',
    index: 0,
  });

  const onClickTab = useCallback(
    (name: string, index: number) => () => {
      setActiveTab({
        name,
        index,
      });
    },
    [],
  );

  if (!isMounted) return <></>;

  return (
    <Flex
      className="mx-auto mt-2 max-w-5xl"
      justifyContent="center"
      flexDirection="column"
      gap="8px"
    >
      <Flex
        className="bg-white p-3"
        alignItems="center"
        justifyContent="space-between"
        isFull
      >
        <Text fontWeight={800} fontSize="18px">
          디지털 자산 뉴스
        </Text>
        <Tab.Group>
          {newsTabs.map(({ name, value }, idx) => (
            <Tab.Button key={`${id}-${name}`} onClick={onClickTab(value, idx)}>
              <Text fontSize="14px">{name}</Text>
            </Tab.Button>
          ))}
          <ActiveBar
            width={`${100 / newsTabs.length}%`}
            left={`${(100 / newsTabs.length) * activeTab.index}%`}
          />
        </Tab.Group>
      </Flex>
      <ErrorBoundary
        fallback={
          <Flex
            className="my-auto min-h-[500px] bg-white"
            isFull
            alignItems="center"
            justifyContent="center"
          >
            <ErrorMessage
              title="디지털 자산 뉴스을 불러오지 못했어요."
              description="잠시 후 다시 시도해주세요."
              className="max-w-lg text-center"
            />
          </Flex>
        }
      >
        <Suspense fallback={<NewsSkeleton />}>
          <NewsList category={activeTab.name} />
        </Suspense>
      </ErrorBoundary>
      <Flex className="max-md:!flex-col" gap="8px" isFull>
        <div
          className={cn(
            'px-3 py-6 flex flex-col w-full h-auto bg-white flex-1',
          )}
        >
          <div>
            <Text fontWeight={800} fontSize="18px">
              일 매수 채결 강도 순위
            </Text>
            <Text fontSize="12px" color={palette.gray}>
              (업비트 기준)
            </Text>
          </div>
          {dailyBidVolumn}
        </div>
        <div
          className={cn(
            'px-3 py-6 flex flex-col w-full h-auto bg-white flex-1',
          )}
        >
          <div>
            <Text fontWeight={800} fontSize="18px">
              일 매도 채결 강도 순위
            </Text>
            <Text fontSize="12px" color={palette.gray}>
              (업비트 기준)
            </Text>
          </div>
          {dailyAskVolumn}
        </div>
      </Flex>
      <Flex
        className="min-h-[500px] bg-white px-3 py-6"
        isFull
        flexDirection="column"
      >
        <Flex alignItems="center" gap="4px">
          <Text fontWeight={800} fontSize="18px">
            디지털 자산 시총
          </Text>
          <Text fontSize="12px" color={palette.gray}>
            (업비트 기준)
          </Text>
        </Flex>
        <Divider
          type="horizontal"
          size="1px"
          style={{
            width: '100%',
            marginBlock: '12px',
          }}
        />
        <ErrorBoundary
          fallback={
            <Flex
              className="my-auto"
              isFull
              alignItems="center"
              justifyContent="center"
            >
              <ErrorMessage
                title="디지털 자산 시총을 불러오지 못했어요."
                description="잠시 후 다시 시도해주세요."
                className="max-w-lg text-center"
              />
            </Flex>
          }
        >
          <Suspense fallback={<TableSkeleton />}>
            <MarketCapTable />
          </Suspense>
        </ErrorBoundary>
      </Flex>
    </Flex>
  );
};

export default TrendPage;
