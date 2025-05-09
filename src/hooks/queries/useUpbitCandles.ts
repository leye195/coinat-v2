'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { getUpbitCandles } from '@/api';
import type { CandleType, UpbitCandle } from '@/types/Candle';

type UseUpbitCandles = {
  priceSymbol: string;
  code: string;
  type: string;
  interval: string;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
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
    const parsedData = data.map((item: UpbitCandle) => ({
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
  }, [enabled, data, onSuccess]);

  return { data, isFetched, ...rest };
};

export default useUpbitCandles;
