'use client';

import React, { useId, useRef, useState } from 'react';
import useUpbitDataFeed from 'hooks/trading-view/useUpbitDataFeed';
import { Unit } from '@/lib/trading-view/utils';
import { timeTabs } from '@/data/tab';

import { Flex } from '../Flex';
import Tab, { ActiveBar } from '../Tab';
import Text from '../Text';

const TradingViewChart = () => {
  const id = useId();
  const [activeTimeTab, setActiveTimeTab] = useState({
    value: 'months',
    index: 0,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useUpbitDataFeed({
    code: 'ETH',
    unit: activeTimeTab.value as Unit,
    containerRef: chartContainerRef,
  });

  const onClickTimeTab = (value: string, index: number) => () => {
    setActiveTimeTab({
      value,
      index,
    });
  };

  return (
    <>
      <Flex className="bg-white" isFull justifyContent="space-between">
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
      <div ref={chartContainerRef} />
    </>
  );
};

export default TradingViewChart;
