import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useId } from 'react';
import { useQuery } from 'react-query';
import { useMedia } from 'react-use';

import CoinInfo from '@/components/CoinInfo';
import { Divider } from '@/components/Divider';
import ExchangeChart from '@/components/ExchangeChart';
import { Flex } from '@/components/Flex';
import Layout from '@/components/Layout';
import MetaTags from '@/components/Metatags';
import Skeleton from '@/components/Skeleton';
import Spacing from '@/components/Spacing';
import Tab, { ActiveBar } from '@/components/Tab';
import { Text } from '@/components/Text';

import { exchangeTabs, timeTabs } from '@/data/tab';
import { getCoins, getCoinSymbolImage } from '@/lib/coin';
import { btcKrw, getTickers, initSocket } from '@/lib/socket';
import { cn, getBreakpointQuery, setComma } from '@/lib/utils';
import { breakpoints } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import type { CandleType } from '@/types/Candle';
import type { Coin } from '@/types/Coin';
import type { NextPageWithLayout } from '@/types/Page';

const ExchangePage: NextPageWithLayout = ({
  code,
  type,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const id = useId();
  const [activeTimeTab, setActiveTimeTab] = useState({
    value: 'months',
    index: 0,
  });
  const [activeExchangeTab, setActiveExchangeTab] = useState({
    value: 'upbit',
    index: 0,
  });
  const priceSymbol = type === 'KRW' ? 'KRW' : 'BTC';
  const exchangeRate =
    priceSymbol === 'KRW' && activeExchangeTab.value === 'binance'
      ? btcKrw.upbit
      : 1;

  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);
  const navigate = useRouter();
  const { data } = useQuery({
    queryKey: ['exchange', code, type],
    queryFn: getTickers,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    select: (response) => {
      const exchange = activeExchangeTab.value as 'upbit' | 'binance';
      const currency = exchange === 'binance' || type !== 'KRW' ? 'btc' : 'krw';
      const data = response[exchange][currency][code?.toUpperCase()];

      return {
        ...data,
        exchangeRate,
      };
    },
  });

  const status = useMemo(() => {
    const color =
      data?.change === 'FALL'
        ? palette.blue
        : data?.change === 'RISE'
        ? palette.red
        : palette.black;

    const changeRate =
      (data?.changeRate ?? 0) *
      (activeExchangeTab.value === 'binance' ? 1 : 100);

    return {
      color,
      changeRate: setComma(changeRate),
      changeSymbol: changeRate > 0 ? '+' : '',
    };
  }, [data, activeExchangeTab]);

  const onClickTimeTab = (value: string, index: number) => {
    setActiveTimeTab({
      value,
      index,
    });
  };

  const onClickMarketTab = (value: string, index: number) => {
    setActiveExchangeTab({
      value,
      index,
    });
  };

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
    <Flex
      className={cn('mt-2 mx-auto mb-0 max-w-[1024px]')}
      flexDirection="column"
    >
      <MetaTags
        title={`${
          priceSymbol === 'KRW'
            ? setComma((data?.tradePrice ?? 0) * exchangeRate)
            : data?.tradePrice ?? 0
        } ${code.toUpperCase()}/KRW`}
      />
      <Flex
        className="bg-white p-3"
        isFull
        flexDirection="column"
        justifyContent="center"
      >
        <Flex alignItems="center" gap="4px">
          <Image
            alt={code}
            src={getCoinSymbolImage(code)}
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
                  ? setComma((data?.tradePrice ?? 0) * exchangeRate)
                  : data?.tradePrice ?? 0}
              </Text>
              <Text fontSize="12px" color={status.color}>
                {priceSymbol}
              </Text>
            </Flex>
            <Text fontSize="14px" color={status.color}>
              ({status.changeSymbol}
              {status.changeRate}%, {status.changeSymbol}
              {priceSymbol === 'KRW'
                ? setComma((data?.changePrice ?? 0) * exchangeRate)
                : data?.changePrice ?? 0}
              )
            </Text>
          </Flex>
          <Flex
            className="min-w-[150px]"
            flexDirection="column"
            alignItems="stretch"
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="12px">고가</Text>
              {data?.highPrice ? (
                <Text fontSize="12px" fontWeight={800} color={palette.red}>
                  {priceSymbol === 'KRW'
                    ? setComma(data.highPrice * exchangeRate)
                    : data.highPrice}
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
                    ? setComma(data.lowPrice * exchangeRate)
                    : data.lowPrice}
                </Text>
              ) : (
                <Skeleton height={12} width={32} />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Spacing size="16px" type="vertical" />
      <Flex
        className="bg-white px-3 py-6"
        isFull
        flexDirection="column"
        gap="12px"
      >
        <Flex isFull justifyContent="space-between">
          <Tab.Group>
            {timeTabs.map(({ name, value }, idx) => (
              <Tab.Button
                key={`${id}-${name}`}
                onClick={() => onClickTimeTab(value, idx)}
              >
                <Text fontSize="14px">{name}</Text>
              </Tab.Button>
            ))}
            <ActiveBar
              width={`${100 / timeTabs.length}%`}
              left={`${(100 / timeTabs.length) * activeTimeTab.index}%`}
            />
          </Tab.Group>
          <Tab.Group>
            {exchangeTabs.map(({ name, value }, index) => (
              <Tab.Button
                key={`${id}-${name}`}
                onClick={() => onClickMarketTab(value, index)}
              >
                <Text fontSize="14px">{name}</Text>
              </Tab.Button>
            ))}
            <ActiveBar
              width={`${100 / exchangeTabs.length}%`}
              left={`${(100 / exchangeTabs.length) * activeExchangeTab.index}%`}
            />
          </Tab.Group>
        </Flex>

        {data ? (
          <ExchangeChart
            key={activeExchangeTab.value}
            code={code}
            exchange={activeExchangeTab.value}
            type={activeTimeTab.value as CandleType}
            newData={data}
            priceSymbol={priceSymbol}
          />
        ) : (
          <Skeleton width="100%" height={500} borderRadius={12} />
        )}
      </Flex>
      <Spacing size="16px" type="vertical" />
      <CoinInfo code={code} />
    </Flex>
  );
};

ExchangePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

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
      },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};

export default ExchangePage;
