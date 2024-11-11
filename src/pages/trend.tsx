import { Suspense, useCallback, useId, useState } from 'react';
import { Divider } from '@/components/Divider';
import { Flex } from '@/components/Flex';
import Layout from '@/components/Layout';
import MarketCapTable from '@/components/MarketCapTable';
import MainNews from '@/components/News/MainNews';
import NewsSkeleton from '@/components/News/NewsSkeleton';
import SubNews from '@/components/News/SubNews';
import Tab, { ActiveBar } from '@/components/Tab';
import TableSkeleton from '@/components/Table/Skeleton';
import Text from '@/components/Text';
import { newsTabs } from '@/data/tab';
import { useMount, useNewsData } from '@/hooks';
import { palette } from '@/styles/variables';
import type { NextPageWithLayout } from '@/types/Page';

const TrendPage: NextPageWithLayout = () => {
  const isMounted = useMount();
  const id = useId();
  const [offset] = useState(0);
  const [activeTab, setActiveTab] = useState({
    name: 'all',
    index: 0,
  });
  const { data, isLoading } = useNewsData({
    category: activeTab.name,
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
        className="p-3 bg-white"
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
      {isLoading ? (
        <NewsSkeleton />
      ) : (
        <Flex
          className="px-3 py-6 bg-white min-h-[500px]"
          isFull
          flexDirection="column"
          gap="12px"
        >
          <Flex className="max-md:!flex-col" gap="8px">
            {data?.featured_list.slice(offset, offset + 2).map((news) => (
              <MainNews key={news.id} data={news} />
            ))}
          </Flex>
          <Divider
            type="horizontal"
            size="1px"
            style={{
              width: '100%',
              marginBlock: '8px',
            }}
          />
          <Flex className="flex-wrap" isFull gap="16px">
            {data?.list.slice(offset, offset + 20).map((news) => (
              <SubNews key={news.id} data={news} />
            ))}
          </Flex>
        </Flex>
      )}
      <Flex
        className="px-3 py-6 bg-white min-h-[500px]"
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
        <Suspense fallback={<TableSkeleton />}>
          <MarketCapTable />
        </Suspense>
      </Flex>
    </Flex>
  );
};

TrendPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default TrendPage;
