import styled from '@emotion/styled';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useId } from 'react';
import { useQuery } from 'react-query';
import { useMedia } from 'react-use';
import { Divider } from '@/components/Divider';
import ExchangeChart from '@/components/ExchangeChart';
import { Flex } from '@/components/Flex';
import Layout from '@/components/Layout';
import MetaTag from '@/components/Metatag';
import Skeleton from '@/components/Skeleton';
import { Spacing } from '@/components/Spacing';
import Tab, { ActiveBar } from '@/components/Tab';
import { Text } from '@/components/Text';
import { getCoins } from '@/lib/coin';
import { getTickers, initSocket } from '@/lib/socket';
import { getBreakpointQuery, setComma } from '@/lib/utils';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import { Coin } from '@/types/Coin';
import { NextPageWithLayout } from '@/types/Page';

const tabs = [
  { name: '1달', value: 'months' },
  { name: '1주', value: 'weeks' },
  { name: '1일', value: 'days' },
];

const ExchangePage: NextPageWithLayout = ({
  isSSRError,
  code,
  type,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const id = useId();
  const [activeTab, setActiveTab] = useState({
    value: 'months',
    index: 0,
  });

  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);
  const navigate = useRouter();
  const { data } = useQuery({
    queryKey: ['exchange', code, type],
    queryFn: getTickers,
    enabled: !isSSRError,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    select: (response) => {
      const data = response.upbit[type === 'KRW' ? 'krw' : 'btc'];
      return data[code?.toUpperCase()];
    },
  });

  const priceSymbol = type === 'KRW' ? 'KRW' : 'BTC';

  const status = useMemo(() => {
    const color =
      data?.change === 'FALL'
        ? palette.blue
        : data?.change === 'RISE'
        ? palette.red
        : palette.black;

    const changeRate = (data?.changeRate ?? 0) * 100;

    return {
      color,
      changeRate: setComma(changeRate),
      changeSymbol: changeRate > 0 ? '+' : '',
    };
  }, [data]);

  const onClickTab = (value: string, index: number) => {
    setActiveTab({
      value,
      index,
    });
  };

  useEffect(() => {
    if (isSSRError) {
      navigate.replace('/');
    }
  }, [isSSRError, code, navigate]);

  useEffect(() => {
    const checkCodeValidation = async () => {
      const response = await getCoins(type == 'KRW' ? 'KRW' : 'BTC');
      const data = response.find((item: Coin) => item.name === code);

      if (!data) {
        navigate.replace('/');
        return;
      }
      initSocket(response);
    };

    checkCodeValidation();
  }, [code, type, navigate]);

  return (
    <Container flexDirection="column">
      <MetaTag title={`${data?.tradePrice ?? 0} ${code.toUpperCase()}/KRW`} />
      <HeaderBox flexDirection="column" justifyContent="center">
        <Flex alignItems="center" gap="4px">
          <Image
            alt={code}
            src={`https://static.upbit.com/logos/${code}.png`}
            width={24}
            height={24}
            unoptimized
          />
          <Text fontWeight={800} fontSize="18px">
            {code}
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
        <Flex alignItems="center" justifyContent="space-between" isFull>
          <Flex
            flexDirection={isSmDown ? 'column' : 'row'}
            alignItems={isSmDown ? 'flex-start' : 'flex-end'}
            gap={isSmDown ? '8px' : '2px'}
          >
            <Flex alignItems="flex-end" gap="2px">
              <Text fontSize="24px" fontWeight={800} color={status.color}>
                {priceSymbol === 'KRW'
                  ? setComma(data?.tradePrice ?? 0)
                  : data?.tradePrice}
              </Text>
              <Text fontSize="12px" color={status.color}>
                {priceSymbol}
              </Text>
            </Flex>
            <Text fontSize="14px" color={status.color}>
              ({status.changeSymbol}
              {status.changeRate}%, {status.changeSymbol}
              {priceSymbol === 'KRW'
                ? setComma(data?.changePrice ?? 0)
                : data?.changePrice.toFixed(8) ?? 0}
              )
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            style={{
              minWidth: 150,
            }}
            alignItems="stretch"
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="12px">고가</Text>
              {data?.highPrice ? (
                <Text fontSize="12px" fontWeight={800} color={palette.red}>
                  {priceSymbol === 'KRW'
                    ? setComma(data.highPrice)
                    : data.highPrice.toFixed(8)}
                </Text>
              ) : (
                <Skeleton height={12} width={32} />
              )}
            </Flex>
            <Divider
              type="horizontal"
              size="1px"
              style={{
                width: '100%',
                marginBlock: '6px',
              }}
            />
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="12px">저가</Text>
              {data?.lowPrice ? (
                <Text fontSize="12px" fontWeight={800} color={palette.blue}>
                  {priceSymbol === 'KRW'
                    ? setComma(data.lowPrice)
                    : data.lowPrice.toFixed(8)}
                </Text>
              ) : (
                <Skeleton height={12} width={32} />
              )}
            </Flex>
          </Flex>
        </Flex>
      </HeaderBox>
      <Spacing size="16px" type="vertical" />
      <ContentBox flexDirection="column" gap="12px">
        <Flex isFull>
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
        </Flex>

        {code && data ? (
          <ExchangeChart
            code={`${priceSymbol}-${code}`}
            type={activeTab.value}
            newData={data}
            priceSymbol={priceSymbol}
          />
        ) : (
          <Skeleton width="100%" height={500} borderRadius={12} />
        )}
      </ContentBox>
    </Container>
  );
};

ExchangePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
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
  width: 100%;
`;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { code = '', type = 'KRW' } = query;

  try {
    if (!code || Array.isArray(code)) {
      throw new Error('code invalid');
    }

    return {
      props: {
        code: code.toUpperCase(),
        type,
        isSSRError: false,
      },
    };
  } catch (error) {
    return {
      props: {
        code,
        type,
        isSSRError: true,
      },
    };
  }
};

export default ExchangePage;
