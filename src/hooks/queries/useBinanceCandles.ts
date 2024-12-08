'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { getBinanceCandles } from '@/api';
import { reCalculateTimeStamp } from '@/lib/utils';
import { CandleType } from '@/types/Candle';

type UseBinanceCandles = {
  priceSymbol: string;
  code: string;
  type: string;
  interval: string;
  enabled?: boolean;
  exchangeRate: number;
  onSuccess?: (data: any) => void;
};

const useBinanceCandles = ({
  priceSymbol,
  code,
  type,
  enabled,
  exchangeRate,
  interval,
  onSuccess,
}: UseBinanceCandles) => {
  function selectBinanceCandles({ data }: AxiosResponse) {
    const parsedData = data.map((item: Array<string | number>) => ({
      close: +item[4] * exchangeRate,
      high: +item[2] * exchangeRate,
      low: +item[3] * exchangeRate,
      open: +item[1] * exchangeRate,
      timestamp: reCalculateTimeStamp(+item[0], type as CandleType),
      volume: +item[5],
    }));

    return parsedData;
  }

  const { data, ...rest } = useQuery({
    queryKey: [
      'exchange',
      `${code}BTC`,
      type,
      priceSymbol,
      interval,
      'binance',
    ],
    queryFn: ({ queryKey }) =>
      getBinanceCandles({
        symbol: queryKey[1],
        interval: queryKey[2] as CandleType,
      }),
    enabled,
    select: selectBinanceCandles,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data || !enabled) return;

    onSuccess?.(data);
  }, [data, enabled, onSuccess]);

  return {
    data,
    ...rest,
  };
};

export default useBinanceCandles;
