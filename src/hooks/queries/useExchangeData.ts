'use client';

import { useQuery } from '@tanstack/react-query';
import { tickers } from '@/lib/socket';
import type { Exchange } from '@/types/Ticker';

type UseExchangeDataProps = {
  code: string;
  type: string;
  exchange: keyof Exchange;
  exchangeRate: number;
};

const useExchangeData = ({
  code,
  type,
  exchange,
  exchangeRate,
}: UseExchangeDataProps) => {
  return useQuery({
    queryKey: ['exchange', code, type, exchange],
    queryFn: () => {
      const currency = exchange === 'binance' || type !== 'KRW' ? 'btc' : 'krw';
      const data = tickers[exchange][currency][code?.toUpperCase()];

      return { ...data, exchangeRate };
    },
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });
};

export default useExchangeData;
