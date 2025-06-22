'use client';

import React, { useRef } from 'react';
import useUpbitDataFeed from 'hooks/trading-view/useUpbitDataFeed';
import { Unit } from '@/lib/trading-view/utils';

interface TradingViewChartProps {
  code: string;
  interval: Unit;
}

const TradingViewChart = ({ code, interval }: TradingViewChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useUpbitDataFeed({
    code,
    unit: interval,
    containerRef: chartContainerRef,
  });

  return <div className="w-full flex justify-center" ref={chartContainerRef} />;
};

export default TradingViewChart;
