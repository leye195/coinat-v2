import { useId, useState } from 'react';
import { useQuery } from 'react-query';
import Image from 'next/image';
import styled from '@emotion/styled';
import { getMarketcap } from 'api';
import { MarketCap } from 'types/Marketcap';
import { setComma } from '@/lib/utils';
import { palette } from '@/styles/variables';
import { Spacing } from './Spacing';
import Table from './Table';
import { Flex } from './Flex';
import { Text } from './Text';
import Button from './Button';

const MarketCapTable = () => {
  const id = useId();
  const [loadMore, setLoadMore] = useState(false);

  const { data } = useQuery({
    queryKey: ['marketcap'],
    queryFn: getMarketcap,
    select: (response) => {
      const { data } = response;
      return data as MarketCap[];
    },
    refetchOnWindowFocus: false,
  });

  const toggleLoadMore = () => {
    setLoadMore((prev) => !prev);
  };

  return (
    <Flex isFull flexDirection="column">
      <Table
        header={
          <>
            {['', '시가총액', '거래대금(24H)'].map((name, idx) => (
              <Table.Header
                key={`${name}-${id}`}
                name={
                  <Flex isFull justifyContent="flex-end">
                    {name}
                  </Flex>
                }
                width={idx ? '30%' : '40%'}
              />
            ))}
          </>
        }
        body={
          !data ? (
            <Table.Skeleton />
          ) : (
            <>
              {data?.slice(0, loadMore ? data.length : 10).map((item, idx) => (
                <Table.Row
                  key={item.symbol}
                  style={{
                    padding: 8,
                  }}
                >
                  <Table.Cell width="10%">
                    <Text
                      fontSize="14px"
                      fontWeight={800}
                      color={idx < 3 ? palette.red : palette.black}
                    >
                      {idx + 1}
                    </Text>
                  </Table.Cell>
                  <Table.Cell width="30%">
                    <Flex alignItems="center" gap="8px" isFull>
                      <IconBox>
                        <Image
                          alt={item.symbol}
                          src={`https://static.upbit.com/logos/${item.symbol}.png`}
                          width={24}
                          height={24}
                          unoptimized
                        />
                      </IconBox>
                      <Text fontSize="14px">{item.symbol}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell width="30%">
                    <Flex isFull justifyContent="flex-end">
                      <Text fontSize="14px">
                        {setComma(Math.round(item.marketCap / 100000000))}
                      </Text>
                      <Spacing size="4px" />
                      <Text fontSize="14px" color={palette.gray}>
                        억원
                      </Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell width="30%">
                    <Flex isFull justifyContent="flex-end">
                      <Text fontSize="14px">
                        {setComma(
                          Math.round(item.accTradePrice24h / 100000000),
                        )}
                      </Text>
                      <Spacing size="4px" />
                      <Text fontSize="14px" color={palette.gray}>
                        억원
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </>
          )
        }
      />
      <Button
        width="100%"
        padding={{
          top: '12px',
          bottom: '12px',
        }}
        onClick={toggleLoadMore}
      >
        <Text fontSize="14px">{loadMore ? '접기' : '더보기'}</Text>
      </Button>
    </Flex>
  );
};

const IconBox = styled.picture`
  display: flex;
  border-radius: 100px;
  overflow: hidden;
`;

export default MarketCapTable;