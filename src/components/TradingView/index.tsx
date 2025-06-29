'use client';

import React, { useRef } from 'react';
import useUpbitDataFeed from 'hooks/trading-view/useUpbitDataFeed';
import { Unit } from '@/lib/trading-view/utils';

interface TradingViewChartProps {
  code: string;
  interval: Unit;
  type: 'KRW' | 'USDT';
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
