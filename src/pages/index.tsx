import styled from '@emotion/styled';
import { useRef } from 'react';
import { useQuery } from 'react-query';
import { useMedia } from 'react-use';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { getCurrencyInfo } from '@/api';
import CoinTable from '@/components/CoinTable';
import Exchange from '@/components/Exchange';
import FearGreed from '@/components/FearGreed';
import Layout from '@/components/Layout';
import Tab from '@/components/Tab';

import useCoinList from '@/hooks/useCoinList';
import { combineTickers } from '@/lib/socket';
import sort, { initSort, Sort } from '@/lib/sort';
import { getBreakpointQuery, setComma } from '@/lib/utils';
import { typeState } from '@/store/coin';
import { exchangeSelector, exchangeState } from '@/store/exchange';
import { breakpoint, breakpoints, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import type { NextPageWithLayout } from '@/types/Page';

const HomePage: NextPageWithLayout = () => {
  const selectedType = useRef<string | null>(null);
  const sortType = useRef({
    symbol: false,
    last: false,
    blast: false,
    per: false,
  });

  const coinType = useRecoilValue(typeState);
  const exchangeData = useRecoilValue(exchangeSelector);
  const setExchangeState = useSetRecoilState(exchangeState);

  const { krwCoinData, btcCoinData } = useCoinList();
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);

  const { data } = useQuery({
    queryKey: ['coins', coinType, krwCoinData.data, btcCoinData.data],
    queryFn: () => getTickers(),
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

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

      const result = sort(
        data,
        selectedType.current ?? 'symbol',
        sortType.current[selectedType.current as Sort],
      );
      return result;
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
            <p>암호화폐 - {data?.length}개</p>
          </CountBox>
          <CoinTable
            krwCoinData={krwCoinData}
            btcCoinData={btcCoinData}
            coinList={data ?? []}
            handleSort={handleSort}
          />
        </TableBlock>
      </ContentsBlock>
    </Container>
  );
};

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
  margin: ${spacing.xs} 0;

  ${breakpoint('md').down`
    width: 100vw;
    gap: 0;
    margin: ${spacing.xxs} 0;
    border: 1px solid #d0d0d0;
    background-color: white;
  `}

  ${breakpoint('sm').down`
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
  margin: 0 auto;

  ${breakpoint('md').down`
    margin-top: ${spacing.xxxs};
  `}
`;

HomePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default HomePage;
