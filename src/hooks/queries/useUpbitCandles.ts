'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { getUpbitCandles } from '@/api';
import type { CandleType, UpbitCandle } from '@/types/Candle';

type ParsedCandle = {
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
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data || !enabled) return;

    onSuccess?.(data);
  }, [enabled, data, onSuccess, isFetched]);

  return { data, isFetched, ...rest };
};

export const useUpbitSeriesData = (
  props: Omit<UseUpbitCandles, 'interval' | 'type' | 'onSuccess'>,
) => {
  const transformData = (data: ParsedCandle[]) => {
    return data?.map(({ open, high, low, close, timestamp }) => ({
      open,
      high,
      low,
      close,
      time: format(timestamp, 'yyyy-MM-dd'),
    }));
  };

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
