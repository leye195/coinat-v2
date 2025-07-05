'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { getUpbitCandles } from '@/api';
import { transformData } from '@/lib/trading-view/utils';
import type { CandleType, UpbitCandle } from '@/types/Candle';

export type ParsedCandle = {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: number;
  volume: number;
};

type UseUpbitCandles = {
  priceSymbol: string;
  code: string;
  type: string;
  interval: string;
  enabled?: boolean;
  onSuccess?: (data: ParsedCandle[]) => void;
};

const useUpbitCandles = ({
  priceSymbol,
  code,
  type,
  enabled,
  interval,
  onSuccess,
}: UseUpbitCandles) => {
  function selectUpbitCandles({ data }: AxiosResponse) {
    const parsedData: ParsedCandle[] = data.map((item: UpbitCandle) => ({
      close: item.trade_price,
      high: item.high_price,
      low: item.low_price,
      open: item.opening_price,
      timestamp: new Date(item.candle_date_time_kst).getTime(),
      volume: item.candle_acc_trade_volume,
    }));

    return parsedData.reverse();
  }

  const { data, isFetched, ...rest } = useQuery({
    queryKey: ['exchange', `${priceSymbol}-${code}`, type, interval, 'upbit'],
    queryFn: ({ queryKey }) =>
      getUpbitCandles({
        market: queryKey[1],
        candleType: queryKey[2] as CandleType,
        count: 200,
      }),
    enabled,
    select: selectUpbitCandles,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return failureCount < 3;
      return false;
    },
    retryDelay: (_, error: any) => {
      const remainingReq = error.response?.headers?.['remaining-req'];

      if (remainingReq) {
        const match = /min=(\d+); sec=(\d+)/.exec(remainingReq);
        if (match) {
          const [_, min, sec] = match;
          const delay = (+min * 60 + +sec) * 1000;
          return delay || 1000; // 최소 1초
        }
      }
      return 1000;
    },
  });

  useEffect(() => {
    if (!data || !enabled || !isFetched) return;

    onSuccess?.(data);
  }, [enabled, data, onSuccess, isFetched]);

  return { data, isFetched, ...rest };
};

export const useUpbitSeriesData = (
  props: Omit<UseUpbitCandles, 'interval' | 'type' | 'onSuccess'>,
) => {
  const { data: dayData = [] } = useUpbitCandles({
    ...props,
    interval: 'days',
    type: 'days',
  });

  const { data: weekData = [] } = useUpbitCandles({
    ...props,
    interval: 'weeks',
    type: 'weeks',
  });

  const { data: monthData = [] } = useUpbitCandles({
    ...props,
    interval: 'months',
    type: 'months',
  });

  const seriesesData = new Map([
    ['1D', transformData(dayData)],
    ['1W', transformData(weekData)],
    ['1M', transformData(monthData)],
  ]);

  return seriesesData;
};

export default useUpbitCandles;
