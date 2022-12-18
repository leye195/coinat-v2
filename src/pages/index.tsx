import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import { useQuery } from 'react-query';
import { useMedia } from 'react-use';

import { getCurrencyInfo, getFearGreedIndex } from 'api';
import { fearGreedColor, fearGreedIndex } from 'data/fearGreed';
import { breakpoint, breakpoints, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import { getCoins } from '@/lib/coin';
import { getBreakpointQuery, setComma } from '@/lib/utils';
import { CombinedTickers, combineTickers, initSocket } from '@/lib/socket';
import sort, { initSort, Sort } from '@/lib/sort';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import { btcCoinListState, krCoinListState, typeState } from 'store/coin';
import { exchangeSelector, exchangeState } from 'store/exchange';
import type { NextPageWithLayout } from 'types/Page';
import type { FearGreed } from 'types/FearGreed';

import Layout from '@/components/Layout';
import Exchange from '@/components/Exchange';
import Skeleton from '@/components/Skeleton';
import Tab from '@/components/Tab';
import CoinTable from '@/components/CoinTable';

const Container = styled.div`
  font-weight: 700;
`;

const ExchangeBlock = styled.section`
  ${breakpoint('md').down`
    overflow: auto;
  `}
`;

const ExchangeBox = styled.div`
  ${flex({})};
  gap: ${spacing.xxs};
  margin: ${spacing.s} 0;

  ${breakpoint('md').down`
    width: 100vw;
    margin: ${spacing.xs} 0;
    gap: 0;
    border: 1px solid #d0d0d0;
    background-color: white;
  `}

  ${breakpoint('sm').down`
    margin: ${spacing.xxs} 0;
    padding: 0 ${spacing.xxs};
  `}
`;

const ContentsBlock = styled.section`
  ${breakpoint('xl').down`
    padding-bottom: 20rem;
  `}
`;

const CountBox = styled.div`
  p {
    margin: 0.5rem;
  }

  ${breakpoint('md').down`
    font-size: 12px;

    p {
      margin: 0.25rem;
    }
  `}

  ${breakpoint('sm').down`
    font-size: 10px;
  `}
`;

const TableBlock = styled.div`
  max-width: 768px;
  margin: ${spacing.m} auto 0 auto;

  ${breakpoint('md').down`
    margin-top: ${spacing.xxs};
  `}

  ${breakpoint('sm').down`
    margin-top: ${spacing.xxxs};
  `}
`;

const FearGreedBlock = styled.section`
  padding: ${spacing.s};
  margin-top: ${spacing.xs};
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid #d0d0d0;
  font-weight: 600;

  ${breakpoint('md').down`
    padding: ${spacing.xs};
    margin-top: ${spacing.xxs};
    font-size: 14px;
  `}

  ${breakpoint('sm').down`
    font-size: 11px;
   `}
`;

const FearGreedTitle = styled.span`
  font-weight: 400;
`;

const FearGreedValue = styled.span<{ color: string }>`
  margin-left: ${spacing.xs};
  color: ${({ color }) => color};
`;

const FearGreed = () => {
  const { isLoading, data } = useQuery(
    ['fear-greed'],
    async () => {
      const res = await getFearGreedIndex();
      const { data } = res.data;

      return data ? data[0] : {};
    },
    {
      refetchIntervalInBackground: true,
      refetchInterval: 1000 * 50,
    },
  );

  return (
    <FearGreedBlock>
      {isLoading ? (
        <Skeleton width="100%" height={20} borderRadius="4px" />
      ) : (
        <>
          <FearGreedTitle>공포 · 탐욕 지수 :</FearGreedTitle>
          <FearGreedValue
            color={fearGreedColor[data?.value_classification as FearGreed]}
          >
            {data?.value} -{' '}
            {fearGreedIndex[data?.value_classification as FearGreed]}
          </FearGreedValue>
        </>
      )}
    </FearGreedBlock>
  );
};

const Home: NextPageWithLayout = () => {
  const [coinList, setCoinList] = useState<CombinedTickers[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const selectedType = useRef<string | null>(null);
  const sortType = useRef({
    symbol: false,
    last: false,
    blast: false,
    per: false,
  });
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const coinType = useRecoilValue(typeState);
  const [krwCoinData, setKrwCoinList] = useRecoilState(krCoinListState);
  const [btcCoinData, setBtcCoinList] = useRecoilState(btcCoinListState);
  const exchangeData = useRecoilValue(exchangeSelector);
  const setExchangeState = useSetRecoilState(exchangeState);

  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);

  const fetchCoins = (type: 'KRW' | 'BTC') => async () => {
    try {
      const data = await getCoins(type);
      return data ?? [];
    } catch (err) {
      console.error(err);
    }
  };

  const getTickers = async () => {
    try {
      const data = combineTickers(
        coinType === 'KRW' ? krwCoinData.data : btcCoinData.data,
        coinType,
      );

      const { data: currencyData } = await getCurrencyInfo();

      const btc = data.find((data) => data.symbol === 'BTC');
      const upbitBit = btc?.last ?? 0;
      const binanceBit = btc?.blast ?? 0;

      setExchangeState({
        upbitBit,
        binanceBit,
        usdToKrw: currencyData.value,
        isLoading: false,
      });

      setCoinList(
        sort(
          data,
          selectedType.current ?? 'symbol',
          sortType.current[selectedType.current as Sort],
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (type: string) => () => {
    sortType.current = {
      ...initSort,
      [type]: !sortType.current[type as Sort],
    };

    selectedType.current = type;
  };

  useEffect(() => {
    if (isMounted) {
      (async () => {
        const [krwCoins, btcCoins] = await Promise.allSettled([
          fetchCoins('KRW')(),
          fetchCoins('BTC')(),
        ]);

        console.log(krwCoins);

        if (krwCoins.status === 'fulfilled' && krwCoins.value) {
          setKrwCoinList({
            isLoading: false,
            data: krwCoins.value,
          });
        }

        if (btcCoins.status === 'fulfilled' && btcCoins.value) {
          setBtcCoinList({ isLoading: false, data: btcCoins.value });
        }

        if (
          krwCoins.status === 'fulfilled' &&
          krwCoins.value &&
          btcCoins.status === 'fulfilled' &&
          btcCoins.value
        )
          initSocket([...krwCoins.value, ...btcCoins.value]);
      })();
    }
    setIsMounted(true);
  }, [isMounted]);

  useIsomorphicLayoutEffect(() => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }

    if (!krwCoinData.isLoading && !btcCoinData.isLoading) {
      getTickers();
      timeRef.current = setInterval(getTickers, 2000);
    }
  }, [krwCoinData, btcCoinData, coinType]);

  return (
    <Container>
      <FearGreed />
      <ExchangeBlock>
        <ExchangeBox>
          <Exchange
            title={isSmDown ? 'USD/KRW' : '환율(USD/KRW)'}
            value={setComma(exchangeData.usdToKrw)}
            isLoading={exchangeData.isLoading || !exchangeData.usdToKrw}
          />
          <Exchange
            title={isSmDown ? 'USDT/KRW' : '환율(USDT/KRW)'}
            value={setComma(exchangeData.usdtToKrw)}
            isLoading={exchangeData.isLoading || !exchangeData.usdtToKrw}
          />
          <Exchange
            title="업비트(BTC)"
            value={setComma(exchangeData.upbitBit)}
            isLoading={exchangeData.isLoading || !exchangeData.upbitBit}
          />
          <Exchange
            title="바이낸스(BTC)"
            value={setComma(exchangeData.binanceBit)}
            isLoading={exchangeData.isLoading || !exchangeData.binanceBit}
          />
          <Exchange
            title="BTC 차이(%)"
            value={`${setComma(exchangeData.bitDiff)}%`}
            isLoading={exchangeData.isLoading || !exchangeData.bitDiff}
          />
        </ExchangeBox>
      </ExchangeBlock>
      <ContentsBlock>
        <TableBlock>
          <Tab tabs={['KRW', 'BTC']} />
          <CountBox>
            <p>암호화폐 - {coinList.length}개</p>
          </CountBox>
          <CoinTable
            krwCoinData={krwCoinData}
            btcCoinData={btcCoinData}
            coinList={coinList}
            handleSort={handleSort}
          />
        </TableBlock>
      </ContentsBlock>
    </Container>
  );
};

Home.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
