import styled from '@emotion/styled';
import { Suspense, useId, useState } from 'react';
import { useQuery } from 'react-query';

import { Divider } from '@/components/Divider';
import { Flex } from '@/components/Flex';
import Layout from '@/components/Layout';
import MarketCapTable from '@/components/MarketCapTable';
import MainNews from '@/components/News/MainNews';
import NewsSkeleton from '@/components/News/NewsSkeleton';
import SubNews from '@/components/News/SubNews';
import Tab, { ActiveBar } from '@/components/Tab';
import TableSkeleton from '@/components/Table/Skeleton';
import { Text } from '@/components/Text';

import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import type { NewsResponse } from '@/types/News';
import type { NextPageWithLayout } from '@/types/Page';
import { getNews } from 'api';
import { newsTabs } from 'data/tab';

const TrendPage: NextPageWithLayout = () => {
  const id = useId();
  const [offset] = useState(0);
  const [activeTab, setActiveTab] = useState({
    name: 'all',
    index: 0,
  });
  const { data, isLoading } = useQuery({
    queryKey: ['news', activeTab.name],
    queryFn: ({ queryKey }) =>
      getNews(queryKey[1] === 'all' ? undefined : queryKey[1]),
    select: (response) => {
      const { data } = response;
      return data.data as NewsResponse;
    },
  });

  const onClickTab = (name: string, index: number) => {
    setActiveTab({
      name,
      index,
    });
  };

  return (
    <Container justifyContent="center" flexDirection="column" gap="8px">
      <HeaderBox alignItems="center" justifyContent="space-between">
        <Text fontWeight={800} fontSize="18px">
          디지털 자산 뉴스
        </Text>
        <Tab.Group>
          {newsTabs.map(({ name, value }, idx) => (
            <Tab.Button
              key={`${id}-${name}`}
              onClick={() => onClickTab(value, idx)}
            >
              <Text fontSize="14px">{name}</Text>
            </Tab.Button>
          ))}
          <ActiveBar
            width={`${100 / newsTabs.length}%`}
            left={`${(100 / newsTabs.length) * activeTab.index}%`}
          />
        </Tab.Group>
      </HeaderBox>
      {isLoading ? (
        <NewsSkeleton />
      ) : (
        <ContentBox flexDirection="column" gap="12px">
          <MainNewsBox gap="8px">
            {data?.featured_list.slice(offset, offset + 2).map((news) => (
              <MainNews key={news.id} data={news} />
            ))}
          </MainNewsBox>
          <Divider
            type="horizontal"
            size="1px"
            style={{
              width: '100%',
              marginBlock: '8px',
            }}
          />
          <SubNewsBox gap="16px">
            {data?.list.slice(offset, offset + 20).map((news) => (
              <SubNews key={news.id} data={news} />
            ))}
          </SubNewsBox>
        </ContentBox>
      )}
      <ContentBox flexDirection="column">
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
      </ContentBox>
    </Container>
  );
};

const Container = styled(Flex)`
  margin: 8px auto 0 auto;
  max-width: 1024px;
`;

const HeaderBox = styled(Flex)`
  width: 100%;
  padding: 12px;
  background-color: white;
`;

const ContentBox = styled(Flex)`
  padding: 24px 12px;
  background-color: white;
  min-height: 500px;
  width: 100%;
`;

const MainNewsBox = styled(Flex)`
  ${breakpoints.down('md')} {
    flex-direction: column;
  }
`;

const SubNewsBox = styled(Flex)`
  flex-wrap: wrap;
`;

TrendPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default TrendPage;
