'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useExchangeData } from 'hooks/queries';
import CoinInfo from '@/components/CoinInfo';
import { Divider } from '@/components/Divider';
import { Flex } from '@/components/Flex';
import MetaTags from '@/components/Metatags';
import {
  BtcCoinSelector,
  KrwCoinSelector,
  UsdtCoinSelector,
} from '@/components/Selector';
import Skeleton from '@/components/Skeleton';
import Spacing from '@/components/Spacing';
import Tab, { ActiveBar } from '@/components/Tab';
import Text from '@/components/Text';
import TradingViewChart from '@/components/TradingView';
import { timeTabs } from '@/data/tab';
import { getCoins, getCoinSymbolImage } from '@/lib/coin';
import { Unit } from '@/lib/trading-view/utils';
import { cn, formatPrice, setComma } from '@/lib/utils';
import { palette } from '@/styles/variables';
import { Coin, TickerType } from '@/types/Coin';
import Loading from './loading';

interface ChartProps {
  code: string;
  type: string;
}

const DEFAULT_TAB = {
  value: 'days',
  index: 2,
};

const EXCHANGE_RATE = 1;

export default function Chart({ code, type }: ChartProps) {
  const id = useId();
  const [activeTimeTab, setActiveTimeTab] = useState(DEFAULT_TAB);

  const priceSymbol = type as TickerType;
  const navigate = useRouter();

  const { data } = useExchangeData({
    code,
    type: type === 'BTC' ? 'BTC' : 'KRW',
    exchange: 'upbit',
    exchangeRate: EXCHANGE_RATE,
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
      changeSymbol: changeRate > 0 ? '+' : '',
    };
  }, [data]);

  const onClickTimeTab = (value: string, index: number) => () => {
    setActiveTimeTab({
      value,
      index,
    });
  };

  useEffect(() => {
    const checkCodeValidation = async () => {
      const response = await getCoins(type === 'BTC' ? 'BTC' : 'KRW');
      const data = response.find((item: Coin) => item.name === code);

      if (!data) {
        navigate.replace('/');
        return;
      }
    };

    checkCodeValidation();
  }, [code, navigate, type]);

  useEffect(() => {
    setActiveTimeTab(DEFAULT_TAB);
  }, [code]);

  return (
    <Flex
      className={cn('mt-2 mx-auto mb-0 max-w-[1024px]')}
      flexDirection="column"
    >
      <MetaTags
        title={`${formatPrice(
          data?.tradePrice ?? 0,
          EXCHANGE_RATE,
          type === 'BTC' ? 'BTC' : 'KRW',
        )} ${code.toUpperCase()}/${type === 'BTC' ? 'BTC' : 'KRW'}`}
      />
      <Flex
        className="bg-white p-3"
        isFull
        flexDirection="column"
        justifyContent="center"
      >
        <Flex alignItems="center" justifyContent="space-between" isFull>
          <Flex alignItems="center" gap="4px">
            <Image
              alt={code}
              src={getCoinSymbolImage(code)}
              width={24}
              height={24}
              unoptimized
            />
            <Text fontWeight={800} fontSize="18px">
              {code}
            </Text>
          </Flex>
          {priceSymbol === 'KRW' && code && <KrwCoinSelector code={code} />}
          {priceSymbol === 'USDT' && code && <UsdtCoinSelector code={code} />}
          {priceSymbol === 'BTC' && code && <BtcCoinSelector code={code} />}
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
          <div
            className={cn(
              'flex gap-[2px] items-end',
              'max-sm:flex-col max-sm:gap-[8px] max-sm:items-start',
            )}
          >
            <Flex alignItems="flex-end" gap="2px">
              <Text fontSize="24px" fontWeight={800} color={status.color}>
                {formatPrice(
                  data?.tradePrice ?? 0,
                  EXCHANGE_RATE,
                  priceSymbol === 'BTC' ? 'BTC' : 'KRW',
                )}
              </Text>
            </Flex>
            <Text fontSize="14px" color={status.color}>
              ({status.changeSymbol}
              {status.changeRate}%, {status.changeSymbol}
              {formatPrice(
                data?.changePrice ?? 0,
                EXCHANGE_RATE,
                priceSymbol === 'BTC' ? 'BTC' : 'KRW',
              )}
              )
            </Text>
          </div>
          <Flex
            className="min-w-[150px]"
            flexDirection="column"
            alignItems="stretch"
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="12px">고가</Text>
              {data ? (
                <Text fontSize="12px" fontWeight={800} color={palette.red}>
                  {formatPrice(
                    data.highPrice,
                    EXCHANGE_RATE,
                    priceSymbol === 'BTC' ? 'BTC' : 'KRW',
                  )}
                </Text>
              ) : (
                <Skeleton height={12} width={32} />
              )}
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
              {data ? (
                <Text fontSize="12px" fontWeight={800} color={palette.blue}>
                  {formatPrice(
                    data.lowPrice,
                    EXCHANGE_RATE,
                    priceSymbol === 'BTC' ? 'BTC' : 'KRW',
                  )}
                </Text>
              ) : (
                <Skeleton height={12} width={32} />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Spacing size="16px" type="vertical" />
      <Flex className="mt-2 bg-white" isFull justifyContent="space-between">
        <Tab.Group>
          {timeTabs.map(({ name, value }, idx) => (
            <Tab.Button
              key={`${id}-${name}`}
              onClick={onClickTimeTab(value, idx)}
            >
              <Text fontSize="14px">{name}</Text>
            </Tab.Button>
          ))}
          <ActiveBar
            width={`${100 / timeTabs.length}%`}
            left={`${(100 / timeTabs.length) * activeTimeTab.index}%`}
          />
        </Tab.Group>
      </Flex>
      <Flex isFull>
        <Loading isLoading={!data}>
          <TradingViewChart
            code={code}
            interval={activeTimeTab.value as Unit}
            type={priceSymbol}
          />
        </Loading>
      </Flex>
      <Spacing size="16px" type="vertical" />
      <CoinInfo code={code} />
    </Flex>
  );
}
