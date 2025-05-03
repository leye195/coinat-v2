'use client';

import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import type { Exchange } from '@/types/Ticker';
import { cryptoSocketState } from '@/store/socket';

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
  const { tickers } = useRecoilValue(cryptoSocketState);

  return useQuery({
    queryKey: ['exchange', code, type, exchange],
    queryFn: () => {
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
  });
};

export default useExchangeData;
