import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import Image from 'next/future/image';

import { getCoins, getCurrencyInfo } from 'api';
import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import { setComma } from '@/lib/utils';
import { CombinedTickers, combineTickers, initSocket } from '@/lib/socket';
import sort, { initSort, Sort, sortColumn } from '@/lib/sort';
import { btcCoinListState, krCoinListState, typeState } from 'store/coin';
import { exchangeSelector, exchangeState } from 'store/exchange';
import type { NextPageWithLayout } from 'types/Page';

import Layout from '@/components/Layout';
import Table from '@/components/Table';
import Exchange from '@/components/Exchange';

const Container = styled.div`
  font-weight: 700;
`;

const ExchangeBlock = styled.div`
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
    gap: ${spacing.xxxs};
  `}
`;

const BinanceCell = styled.div`
  ${flex({ direction: 'column' })};

  p {
    margin: 0;
  }
`;

const ContentsBlock = styled.section``;

const CountBox = styled.div`
  p {
    margin: 0.5rem;
  }
`;

const TableBlock = styled.div`
  max-width: 768px;
  margin: ${spacing.m} auto 0 auto;
`;

const PercentCell = styled(BinanceCell)``;

const SymbolCell = styled.div`
  ${flex({ alignItems: 'center' })}
  gap: ${spacing.xs};

  img {
    border-radius: 2rem;
  }
`;

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
    } finally {
      if (!timeRef.current) {
        timeRef.current = setTimeout(() => {
          timeRef.current = null;
          getTickers();
        }, 2000);
      }
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
      <ExchangeBlock>
        <ExchangeBox>
          <Exchange
            title="환율(USD/KRW)"
            value={setComma(exchangeData.usdToKrw)}
            isLoading={exchangeData.isLoading || !exchangeData.usdToKrw}
          />
          <Exchange
            title="환율(USDT/KRW)"
            value={setComma(exchangeData.usdtToKrw)}
            isLoading={exchangeData.isLoading || !exchangeData.usdtToKrw}
          />
          <Exchange
            title="업비트(BTC/KRW)"
            value={setComma(exchangeData.upbitBit)}
            isLoading={exchangeData.isLoading || !exchangeData.upbitBit}
          />
          <Exchange
            title="바이낸스(BTC/KRW)"
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
          <CountBox>
            <p>암호화폐 - {coinList.length}개</p>
          </CountBox>
          <Table
            header={
              <>
                {['코인', '업비트(₩)', '바이낸스(BTC)', '차이(%)'].map(
                  (name, idx) => (
                    <Table.Header
                      key={name}
                      name={name}
                      right={
                        <Image
                          src="/assets/updown.png"
                          alt=""
                          width={6}
                          height={12}
                        />
                      }
                      width="25%"
                      onClick={handleSort(sortColumn[idx])}
                    />
                  ),
                )}
              </>
            }
            body={
              krwCoinData.isLoading ||
              btcCoinData.isLoading ||
              exchangeData.isLoading ? (
                <Table.Skeleton />
              ) : (
                <>
                  {coinList
                    .filter((data) => data.symbol !== 'BTC')
                    .map((data: CombinedTickers) => (
                      <Table.Row>
                        <Table.Cell>
                          <SymbolCell>
                            <img
                              alt={data.symbol}
                              src={`https://static.upbit.com/logos/${data.symbol}.png`}
                              width={20}
                              height={20}
                            />
                            {data.symbol}
                          </SymbolCell>
                        </Table.Cell>
                        <Table.Cell>{setComma(data.last)}₩</Table.Cell>
                        <Table.Cell>
                          <BinanceCell>
                            <p>{data.blast}</p>
                            {data.convertedBlast && (
                              <p>{setComma(data.convertedBlast ?? 0)}₩</p>
                            )}
                          </BinanceCell>
                        </Table.Cell>
                        <Table.Cell
                          color={
                            data.per
                              ? data.per > 0
                                ? '#ef5350'
                                : '#42a5f5'
                              : '#000000'
                          }
                        >
                          <PercentCell>
                            <p>{(data?.per ?? 0).toFixed(3)}%</p>
                          </PercentCell>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </>
              )
            }
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
