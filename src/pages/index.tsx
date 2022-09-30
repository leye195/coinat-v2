import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from '@emotion/styled';

import { getCoins } from 'api';
import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import { setComma } from '@/lib/utils';
import { combineTickers, initSocket } from '@/lib/socket';
import { btcCoinListState, krCoinListState, typeState } from 'store/coin';
import type { NextPageWithLayout } from 'types/Page';

import Layout from '@/components/Layout';
import Table from '@/components/Table';

const Container = styled.div`
  font-weight: 700;
`;

const InfoTitle = styled.h6`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);

  ${breakpoint('md').down`
    width: min-content;
  `}
`;

const InfoValue = styled.p`
  margin: 0;
`;

const InfoCard = styled.div`
  ${flex({ direction: 'column' })};
  gap: ${spacing.xxs};
  width: 30%;
  padding: ${spacing.s};
  border: 1px solid #d0d0d0;
  border-radius: 16px;
  background-color: #000000cc;
  color: ${({ theme }) => theme.color.white};
`;

const InfoBox = styled.div`
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

  const fetchCoins = (type: 'KRW' | 'BTC') => async () => {
    try {
      const { data } = await getCoins(type);
      return data ?? [];
    } catch (err) {
      console.error(err);
    }
  };

  const getTickers = () => {
    const data = combineTickers(
      coinType === 'KRW' ? krwCoinData.data : btcCoinData.data,
      coinType,
    );
    console.log(data);

    if (!timeRef.current) {
      timeRef.current = setTimeout(() => {
        timeRef.current = null;
        getTickers();
      }, 1000);
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
      <InfoBox>
        <InfoCard>
          <InfoTitle>환율(USD/KRW)</InfoTitle>
          <InfoValue>{setComma(1422.937)}</InfoValue>
        </InfoCard>
        <InfoCard>
          <InfoTitle>환율(USDT/KRW)</InfoTitle>
          <InfoValue>{setComma(1422.937)}</InfoValue>
        </InfoCard>
        <InfoCard>
          <InfoTitle>업비트(BTC/KRW)</InfoTitle>
          <InfoValue>{setComma(26881645.21)}</InfoValue>
        </InfoCard>
        <InfoCard>
          <InfoTitle>바이낸스(BTC/KRW)</InfoTitle>
          <InfoValue>{setComma(26881645.21)}</InfoValue>
        </InfoCard>
      </InfoBox>
      <Table
        header={
          <>
            {['코인', '업비트(₩)', '바이낸스(BTC)', '차이(%)'].map((name) => (
              <Table.Header name={name} width="30%" />
            ))}
          </>
        }
        body={
          <Table.Row>
            <CoinCell>ETH</CoinCell>
            <UpbitCell>1880500₩</UpbitCell>
            <BinanceCell>
              <p>0.06904100</p>
              <p>1880184.66₩</p>
            </BinanceCell>
            <PercentCell>0.00%</PercentCell>
          </Table.Row>
        }
      ></Table>
    </Container>
  );
};

Home.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
