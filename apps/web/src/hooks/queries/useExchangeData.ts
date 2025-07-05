'use client';

import { useQuery } from '@tanstack/react-query';
import { useCryptoSocketStore } from '@/store/socket';
import type { Exchange, Ticker as Tickers } from '@/types/Ticker';

type Ticker = Tickers[string];

type UseExchangeDataProps<T = Ticker & { exchangeRate: number }> = {
  code: string;
  type: string;
  exchange: keyof Exchange;
  exchangeRate: number;
  select?: (data: Ticker & { exchangeRate: number }) => T;
};

const useExchangeData = <T = Ticker & { exchangeRate: number }>({
  code,
  type,
  exchange,
  exchangeRate,
  select,
}: UseExchangeDataProps<T>) => {
  const { tickers } = useCryptoSocketStore();

  return useQuery({
    queryKey: ['exchange', code, type, exchange],
    queryFn: (): Ticker & { exchangeRate: number } => {
      const currency = exchange === 'binance' || type !== 'KRW' ? 'btc' : 'krw';
      const data = tickers?.[exchange][currency][code?.toUpperCase()];

      if (!data) {
        return {
          tradePrice: 0,
          highPrice: 0,
          lowPrice: 0,
          openPrice: 0,
          marketWarning: '',
          changePrice: 0,
          changeRate: 0,
          change: '',
          marketState: '',
          volume: 0,
          timestamp: 0,
          exchangeRate,
        };
      }

      return { ...data, exchangeRate };
    },
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    enabled: tickers != null,
    select,
  });
};

export default useExchangeData;
