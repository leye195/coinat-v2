import { useId, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoinInfo } from '@/api';
import { Flex } from './Flex';
import MultilineText from './MultilineText';
import { SectionWithTitle } from './SectionWithTitle';
import Table from './Table';
import Text from './Text';

type Props = {
  code: string;
};

const CoinInfo = ({ code }: Props) => {
  const id = useId();
  const { data } = useQuery({
    queryKey: [code, 'coin-info'],
    queryFn: () => getCoinInfo(code),
    select: (res) => {
      const { data } = res.data;
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 12,
  });

  return (
    <Flex
      flexDirection="column"
      className="min-h-[550px] bg-white px-3 py-5"
      justifyContent="center"
      gap="32px"
      isFull
    >
      <Flex flexDirection="column" isFull>
        <Table
          header={
            <>
              {['시가총액', '현재 유통량'].map((name) => (
                <Table.Header
                  name={
                    <Text
                      className="max-sm:!text-sm"
                      fontSize={18}
                      fontWeight={700}
                    >
                      {name}
                    </Text>
                  }
                  width="50%"
                  key={`${id}_${name}`}
                />
              ))}
            </>
          }
          body={
            <>
              <Table.Row className="border-b">
                <Table.Row>
                  <Table.Cell width="30%">프로젝트팀 제공</Table.Cell>
                  <Table.Cell width="70%">
                    <Text className="max-sm:!text-sm">
                      {data?.market_data.project_name?.market_cap ?? '미제공'}
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="30%">프로젝트팀 제공</Table.Cell>
                  <Table.Cell width="70%">
                    <Text className="max-sm:!text-sm">
                      {data?.market_data.project_name?.circulating_supply ??
                        '미제공'}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              </Table.Row>
              <Table.Row className="border-b">
                <Table.Row>
                  <Table.Cell width="30%">코인마켓캡 제공</Table.Cell>
                  <Table.Cell width="70%">
                    <Text className="max-sm:!text-sm">
                      {data?.market_data.coin_market_cap?.market_cap ??
                        '미제공'}{' '}
                      - ({data?.market_data.coin_market_cap.date})
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="30%">코인마켓캡 제공</Table.Cell>
                  <Table.Cell width="70%">
                    <Text className="max-sm:!text-sm">
                      {data?.market_data.coin_market_cap?.circulating_supply ??
                        '미제공'}{' '}
                      - ({data?.market_data.coin_market_cap.date})
                    </Text>
                  </Table.Cell>
                </Table.Row>
              </Table.Row>
              <Table.Row>
                <Table.Row>
                  <Table.Cell width="30%">코인게코 제공</Table.Cell>
                  <Table.Cell width="70%">
                    <Text className="max-sm:!text-sm">
                      {data?.market_data.coin_gecko?.market_cap ?? '미제공'} - (
                      {data?.market_data.coin_gecko.date})
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="30%">코인게코 제공</Table.Cell>
                  <Table.Cell width="70%">
                    <Text className="max-sm:!text-sm">
                      {data?.market_data.coin_gecko?.circulating_supply ??
                        '미제공'}{' '}
                      - ({data?.market_data.coin_gecko.date})
                    </Text>
                  </Table.Cell>
                </Table.Row>
              </Table.Row>
            </>
          }
        ></Table>
      </Flex>
      <Flex flexDirection="column" gap="20px">
        {data?.main_components.map((info) => (
          <SectionWithTitle
            key={`${id}_${info.detail.subtitle}`}
            title={
              <Text className="max-sm:!text-sm" fontSize={20} fontWeight={700}>
                {info.detail.subtitle}
              </Text>
            }
            className="gap-2"
          >
            <MultilineText className="text-gray-400 max-sm:text-xs">
              {info.detail.content}
            </MultilineText>
          </SectionWithTitle>
        ))}
      </Flex>
    </Flex>
  );
};

export default memo(CoinInfo);
