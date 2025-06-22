'use client';
import { useId, useMemo, useState } from 'react';
import Image from 'next/image';

import { Divider } from '@/components/Divider';
import { Flex } from '@/components/Flex';
import Skeleton from '@/components/Skeleton';
import Spacing from '@/components/Spacing';
import Tab, { ActiveBar } from '@/components/Tab';
import Text from '@/components/Text';
import TradingViewChart from '@/components/TradingView';
import { timeTabs } from '@/data/tab';
import { getCoinSymbolImage } from '@/lib/coin';
import { Unit } from '@/lib/trading-view/utils';
import { cn, formatPrice, setComma } from '@/lib/utils';
import { palette } from '@/styles/variables';
import { useExchangeData } from 'hooks/queries';

export default function Chart() {
  const id = useId();
  const [activeTimeTab, setActiveTimeTab] = useState({
    value: 'months',
    index: 0,
  });
  const code = 'ETH';
  const exchangeRate = 1;

  const { data } = useExchangeData({
    code,
    type: 'KRW',
    exchange: 'upbit',
    exchangeRate,
  });

  const getPrice = (price: number) => {};

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

  return (
    <Flex
      className={cn('mt-2 mx-auto mb-0 max-w-[1024px]')}
      flexDirection="column"
    >
      <Flex
        className="bg-white p-3"
        isFull
        flexDirection="column"
        justifyContent="center"
      >
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
                {formatPrice(data?.tradePrice ?? 0, exchangeRate, 'KRW')}
              </Text>
            </Flex>
            <Text fontSize="14px" color={status.color}>
              ({status.changeSymbol}
              {status.changeRate}%, {status.changeSymbol}
              {formatPrice(data?.changePrice ?? 0, exchangeRate, 'KRW')})
            </Text>
          </div>
          <Flex
            className="min-w-[150px]"
            flexDirection="column"
            alignItems="stretch"
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="12px">고가</Text>
              {data?.highPrice ? (
                <Text fontSize="12px" fontWeight={800} color={palette.red}>
                  {formatPrice(data?.highPrice ?? 0, exchangeRate, 'KRW')}
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
              {data?.lowPrice ? (
                <Text fontSize="12px" fontWeight={800} color={palette.blue}>
                  {formatPrice(data?.lowPrice ?? 0, exchangeRate, 'KRW')}
                </Text>
              ) : (
                <Skeleton height={12} width={32} />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Spacing size="16px" type="vertical" />
      <Flex className="bg-white mt-2" isFull justifyContent="space-between">
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
        <TradingViewChart code="ETH" interval={activeTimeTab.value as Unit} />
      </Flex>
    </Flex>
  );
}
