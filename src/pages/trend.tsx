import styled from '@emotion/styled';
import { useId, useState } from 'react';
import { useQuery } from 'react-query';
import { getNews } from 'api';
import { NewsResponse } from 'types/News';
import { NextPageWithLayout } from 'types/Page';
import Layout from '@/components/Layout';
import { Flex } from '@/components/Flex';
import { Text } from '@/components/Text';
import Tab, { ActiveBar } from '@/components/Tab';
import { Divider } from '@/components/Divider';
import MainNews from '@/components/News/MainNews';
import SubNews from '@/components/News/SubNews';
import { breakpoints } from '@/styles/mixin';

const tabs = [
  { name: '전체', value: 'all' },
  { name: '일반', value: 'general' },
  { name: '규제', value: 'policy' },
  { name: '테크', value: 'tech' },
];

const TrendPage: NextPageWithLayout = () => {
  const id = useId();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState({
    name: 'all',
    index: 0,
  });

  const { data } = useQuery({
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
          {tabs.map(({ name, value }, idx) => (
            <Tab.Button
              key={`${id}-${name}`}
              onClick={() => onClickTab(value, idx)}
            >
              <Text fontSize="14px">{name}</Text>
            </Tab.Button>
          ))}
          <ActiveBar
            width={`${100 / tabs.length}%`}
            left={`${(100 / tabs.length) * activeTab.index}%`}
          />
        </Tab.Group>
      </HeaderBox>
      <ContentBox flexDirection="column" gap="12px">
        <MainNewsBox gap="8px">
          {data?.featured_list.slice(0, 2).map((news) => (
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
          {data?.list.slice(0, 20).map((news) => (
            <SubNews key={news.id} data={news} />
          ))}
        </SubNewsBox>
      </ContentBox>
    </Container>
  );
};

const Container = styled(Flex)`
  margin-top: 8px;
`;

const HeaderBox = styled(Flex)`
  width: 100%;
  padding: 12px;
  background-color: white;
`;

const ContentBox = styled(Flex)`
  padding: 24px 12px;
  background-color: white;
  min-height: calc(100vh - 180px);
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
