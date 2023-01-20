import Image from 'next/future/image';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMedia } from 'react-use';
import styled from '@emotion/styled';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CoinState, typeState, watchListState } from 'store/coin';
import { exchangeSelector } from 'store/exchange';
import { breakpoint, breakpoints, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import { CombinedTickers } from '@/lib/socket';
import {
  equal,
  filter,
  findIndex,
  getBreakpointQuery,
  setComma,
} from '@/lib/utils';
import { sortColumn } from '@/lib/sort';

import Table from '@/components/Table';
import Button from '@/components/Button';

type Props = {
  krwCoinData: CoinState;
  btcCoinData: CoinState;
  coinList: CombinedTickers[];
  handleSort: (type: string) => () => void;
};

const BinanceCell = styled.div`
  ${flex({ direction: 'column' })};

  p {
    margin: 0;
  }
`;

const UpbitCell = styled(BinanceCell)`
  gap: ${spacing.xxxs};
`;

const PercentCell = styled(BinanceCell)``;

const SymbolCell = styled.div`
  ${flex({ alignItems: 'center' })}
  gap: ${spacing.xs};

  ${breakpoint('sm').down`
    gap: ${spacing.xxxs};
  `}

  img {
    border-radius: 2rem;
  }

  svg {
    color: ${({ theme }) => theme.color.yellow};
  }
`;

const Warning = styled.div`
  color: ${({ theme }) => theme.color.white};
  background-color: orange;
  padding: 0.125rem;
  font-size: 14px;
  font-weight: 600;

  ${breakpoint('md').down`
    font-size: 10px;
  `}
`;

const CoinTable = ({
  btcCoinData,
  coinList,
  krwCoinData,
  handleSort,
}: Props) => {
  const [watchList, setWatchList] = useRecoilState(watchListState);
  const coinType = useRecoilValue(typeState);
  const exchangeData = useRecoilValue(exchangeSelector);
  const isSmDown = useMedia(getBreakpointQuery(breakpoints.down('sm')), false);

  const handleFav = (symbol: string) => () => {
    const { krw, btc } = watchList;
    const type = coinType?.toLowerCase() ?? 'krw';

    setWatchList({
      btc: equal(type, 'btc')
        ? !equal(
            findIndex(watchList.btc, (val: string) => equal(val, symbol)),
            -1,
          )
          ? filter(watchList.btc, (val: string) => !equal(val, symbol))
          : [...watchList.btc, symbol]
        : btc,
      krw: !equal(type, 'btc')
        ? !equal(
            findIndex(watchList.krw, (val: string) => equal(val, symbol)),
            -1,
          )
          ? filter(watchList.krw, (val: string) => !equal(val, symbol))
          : [...watchList.krw, symbol]
        : krw,
    });
  };

  return (
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
              .filter((data) => !equal(data.symbol, 'BTC'))
              .map((data: CombinedTickers) => (
                <Table.Row key={data.symbol}>
                  <Table.Cell>
                    <SymbolCell>
                      <Button onClick={handleFav(data.symbol)}>
                        <FontAwesomeIcon
                          icon={
                            equal(
                              findIndex(
                                watchList[
                                  coinType.toLowerCase() as 'btc' | 'krw'
                                ],
                                (val: string) => equal(val, data.symbol),
                              ),
                              -1,
                            )
                              ? faStar
                              : faSolidStar
                          }
                        />
                      </Button>
                      <picture>
                        <img
                          alt={data.symbol}
                          src={`https://static.upbit.com/logos/${data.symbol}.png`}
                          width={isSmDown ? 16 : 20}
                          height={isSmDown ? 16 : 20}
                        />
                      </picture>
                      {data.symbol}
                    </SymbolCell>
                  </Table.Cell>
                  <Table.Cell>
                    <UpbitCell>
                      <p>
                        {coinType === 'KRW'
                          ? `${setComma(data.last)}₩`
                          : data.last}
                      </p>
                      {data.upbitWarning && <Warning>투자 유의</Warning>}
                    </UpbitCell>
                  </Table.Cell>
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
                      <p>{(data?.per ?? 0).toFixed(2)}%</p>
                    </PercentCell>
                  </Table.Cell>
                </Table.Row>
              ))}
          </>
        )
      }
    />
  );
};

export default CoinTable;
