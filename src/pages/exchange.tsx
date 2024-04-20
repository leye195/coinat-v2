import styled from '@emotion/styled';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { palette } from '@/styles/variables';
import { setComma } from '@/lib/utils';
import { getTickers, initSocket } from '@/lib/socket';
import { Coin } from 'types/Coin';
import { NextPageWithLayout } from 'types/Page';
import MetaTag from '@/components/Metatag';
import { Text } from '@/components/Text';
import { Flex } from '@/components/Flex';
import Layout from '@/components/Layout';
import { Divider } from '@/components/Divider';

const ExchangePage: NextPageWithLayout = ({
  isSSRError,
  code,
  coinList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const navigate = useRouter();
  const { data } = useQuery({
    queryKey: ['exchange', code],
    queryFn: getTickers,
    enabled: !isSSRError,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    select: (response) => {
      const data = response.upbit.krw[code?.toUpperCase()];
      return data;
    },
  });

  const status = useMemo(() => {
    const color =
      data?.change === 'FALL'
        ? palette.blue
        : data?.change === 'RISE'
        ? palette.red
        : palette.black;

    const changeRate = (data?.changeRate ?? 0) * 100;
    return {
      color,
      changeRate: setComma(changeRate),
      changeSymbol: changeRate > 0 ? '+' : changeRate < 0 ? '-' : '',
    };
  }, [data]);

  useEffect(() => {
    if (isSSRError) {
      navigate.replace('/');
    }
  }, [isSSRError, code, navigate]);

  useEffect(() => {
    if (!coinList) return;
    initSocket(coinList);
  }, [coinList]);

  console.log(data);

  return (
    <Container>
      <MetaTag title={`${data?.tradePrice ?? 0} ${code.toUpperCase()}/KRW`} />
      <HeaderBox flexDirection="column" justifyContent="center">
        <Flex alignItems="center" gap="4px">
          <Image
            alt={code}
            src={`https://static.upbit.com/logos/${code}.png`}
            width={24}
            height={24}
            unoptimized
          />
          <Text fontWeight={800} fontSize="18px">
            {code}
          </Text>
        </Flex>
        <Divider
          type="horizontal"
          size="1px"
          style={{
            width: '100%',
            marginBlock: '12px',
          }}
        />
        <Flex alignItems="center" justifyContent="space-between" isFull>
          <Flex alignItems="flex-end" gap="2px">
            <Text fontSize="24px" fontWeight={800} color={status.color}>
              {data?.tradePrice ?? 0}
            </Text>
            <Text fontSize="12px" color={status.color}>
              KRW
            </Text>
            <Text fontSize="14px" color={status.color}>
              ({status.changeSymbol}
              {status.changeRate}%, {status.changeSymbol}
              {data?.changePrice})
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            style={{
              minWidth: 150,
            }}
            alignItems="stretch"
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="12px">고가</Text>
              <Text fontSize="12px" fontWeight={800} color={palette.red}>
                {data?.highPrice}
              </Text>
            </Flex>
            <Divider
              type="horizontal"
              size="1px"
              style={{
                width: '100%',
                marginBlock: '6px',
              }}
            />
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="12px">저가</Text>
              <Text fontSize="12px" fontWeight={800} color={palette.blue}>
                {data?.lowPrice}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </HeaderBox>
    </Container>
  );
};

ExchangePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

const Container = styled(Flex)`
  margin: 8px auto 0 auto;
  max-width: 1024px;
`;

const HeaderBox = styled(Flex)`
  width: 100%;
  padding: 12px;
  background-color: white;
`;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { code = '' } = query;

  try {
    if (!code || Array.isArray(code)) {
      throw new Error('code invalid');
    }

    const response = await (
      await fetch('http://localhost:3000/api/coin-v2')
    ).json();

    const data = response.find(
      (item: Coin) => item.name === code.toUpperCase(),
    );

    if (!data) {
      throw new Error('code invalid');
    }

    return {
      props: {
        code: data.name,
        coinList: response,
        isSSRError: false,
      },
    };
  } catch (error) {
    return {
      props: {
        code,
        coinList: [],
        isSSRError: true,
      },
    };
  }
};

export default ExchangePage;
