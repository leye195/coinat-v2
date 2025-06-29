'use client';

import React, { useRef } from 'react';
import useUpbitDataFeed from 'hooks/trading-view/useUpbitDataFeed';
import { Unit } from '@/lib/trading-view/utils';
import { TickerType } from '@/types/Coin';

interface TradingViewChartProps {
  code: string;
  interval: Unit;
  type: TickerType;
}

const TradingViewChart = ({ code, interval, type }: TradingViewChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useUpbitDataFeed({
    code,
    type,
    unit: interval,
    containerRef: chartContainerRef,
  });

  return <div className="flex w-full justify-center" ref={chartContainerRef} />;
};

export default TradingViewChart;
