import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';

import { getCoins, getCurrencyInfo } from 'api';
import { flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import { setComma } from '@/lib/utils';
import { combineTickers, initSocket } from '@/lib/socket';
import { btcCoinListState, krCoinListState, typeState } from 'store/coin';
import { exchangeSelector, exchangeState } from 'store/exchange';
import type { NextPageWithLayout } from 'types/Page';

import Layout from '@/components/Layout';
import Table from '@/components/Table';
import Exchange from '@/components/Exchange';

const Container = styled.div`
  font-weight: 700;
`;

const ExchangeBox = styled.div`
  ${flex({})};
  gap: ${spacing.xxs};
  margin: ${spacing.s} 0;
`;

const CoinCell = styled(Table.Cell)``;

const UpbitCell = styled(Table.Cell)``;

const BinanceCell = styled(Table.Cell)`
  flex-direction: column;
  align-items: flex-start;

  p {
    margin: 0;
  }
`;

const PercentCell = styled(Table.Cell)``;

const Home: NextPageWithLayout = () => {
  const [isMounted, setIsMounted] = useState(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const coinType = useRecoilValue(typeState);
  const [krwCoinData, setKrwCoinList] = useRecoilState(krCoinListState);
  const [btcCoinData, setBtcCoinList] = useRecoilState(btcCoinListState);
  const exchangeData = useRecoilValue(exchangeSelector);
  const setExchangeState = useSetRecoilState(exchangeState);

  const fetchCoins = (type: 'KRW' | 'BTC') => async () => {
    try {
      const { data } = await getCoins(type);
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

      if (coinType === 'KRW') {
        const btc = data.find((data) => data.symbol === 'BTC');
        const upbitBit = btc?.last ?? 0;
        const binanceBit = btc?.blast ?? 0;

        setExchangeState({
          upbitBit,
          binanceBit,
          usdToKrw: currencyData.value,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!timeRef.current) {
        timeRef.current = setTimeout(() => {
          timeRef.current = null;
          getTickers();
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (isMounted) {
      (async () => {
        const [krwCoins, btcCoins] = await Promise.allSettled([
          fetchCoins('KRW')(),
          fetchCoins('BTC')(),
        ]);

        if (krwCoins.status === 'fulfilled' && krwCoins.value) {
          initSocket(krwCoins.value);
          setKrwCoinList({
            isLoading: false,
            data: krwCoins.value,
          });
        }

        if (btcCoins.status === 'fulfilled' && btcCoins.value) {
          setBtcCoinList({ isLoading: false, data: btcCoins.value });
        }
      })();
    }
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    if (!krwCoinData.isLoading && !btcCoinData.isLoading) {
      getTickers();
    }
  }, [krwCoinData, btcCoinData]);

  return (
    <Container>
      <ExchangeBox>
        <Exchange
          title="환율(USD/KRW)"
          value={setComma(exchangeData.usdToKrw)}
          isLoading={exchangeData.isLoading}
        />
        <Exchange
          title="환율(USDT/KRW)"
          value={setComma(exchangeData.usdtToKrw)}
          isLoading={exchangeData.isLoading}
        />
        <Exchange
          title="업비트(BTC/KRW)"
          value={setComma(exchangeData.upbitBit)}
          isLoading={exchangeData.isLoading}
        />
        <Exchange
          title="바이낸스(BTC/KRW)"
          value={setComma(exchangeData.binanceBit)}
          isLoading={exchangeData.isLoading}
        />
      </ExchangeBox>
      <Table
        header={
          <>
            {['코인', '업비트(₩)', '바이낸스(BTC)', '차이(%)'].map((name) => (
              <Table.Header key={name} name={name} width="30%" />
            ))}
          </>
        }
        body={
          krwCoinData.isLoading || btcCoinData.isLoading ? (
            <Table.Skeleton />
          ) : (
            <Table.Row>
              <CoinCell>ETH</CoinCell>
              <UpbitCell>1880500₩</UpbitCell>
              <BinanceCell>
                <p>0.06904100</p>
                <p>1880184.66₩</p>
              </BinanceCell>
              <PercentCell>0.00%</PercentCell>
            </Table.Row>
          )
        }
      ></Table>
    </Container>
  );
};

Home.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
