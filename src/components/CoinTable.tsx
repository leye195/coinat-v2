import Image from 'next/future/image';
import { useRecoilValue } from 'recoil';

import { CoinState, typeState } from 'store/coin';
import { exchangeSelector } from 'store/exchange';
import { CombinedTickers } from '@/lib/socket';

import Table from '@/components/Table';
import styled from '@emotion/styled';
import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import { setComma } from '@/lib/utils';
import { sortColumn } from '@/lib/sort';

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

  img {
    border-radius: 2rem;
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
  const coinType = useRecoilValue(typeState);
  const exchangeData = useRecoilValue(exchangeSelector);

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
              .filter((data) => data.symbol !== 'BTC')
              .map((data: CombinedTickers) => (
                <Table.Row key={data.symbol}>
                  <Table.Cell>
                    <SymbolCell>
                      <picture>
                        <img
                          alt={data.symbol}
                          src={`https://static.upbit.com/logos/${data.symbol}.png`}
                          width={20}
                          height={20}
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
                      <p>{(data?.per ?? 0).toFixed(3)}%</p>
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
