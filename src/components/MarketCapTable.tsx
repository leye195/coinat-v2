import { useCallback, useId, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { marketCapHeader } from 'data/table';
import { getMarketcap } from '@/api';
import Button from '@/components/Button';
import { Flex } from '@/components/Flex';
import Spacing from '@/components/Spacing';
import Table from '@/components/Table';
import Text from '@/components/Text';
import { getCoinSymbolImage } from '@/lib/coin';
import { setComma } from '@/lib/utils';
import { palette } from '@/styles/variables';

const MarketCapTable = () => {
  const id = useId();
  const [loadMore, setLoadMore] = useState(false);

  const { data } = useSuspenseQuery({
    queryKey: ['marketcap'],
    queryFn: getMarketcap,
    select: (response) => {
      const { data } = response;
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const toggleLoadMore = useCallback(() => {
    setLoadMore((prev) => !prev);
  }, []);

  return (
    <Flex isFull flexDirection="column">
      <Table
        header={
          <>
            {marketCapHeader.map((name, idx) => (
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
                      <picture className="flex overflow-hidden rounded-[100px]">
                        <Image
                          alt={item.symbol}
                          src={getCoinSymbolImage(item.symbol)}
                          width={24}
                          height={24}
                          unoptimized
                        />
                      </picture>
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

export default MarketCapTable;
