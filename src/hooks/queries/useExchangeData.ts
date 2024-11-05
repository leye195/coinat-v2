import { useQuery } from 'react-query';
import { getTickers } from '@/lib/socket';
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
  const selectFn = (response: Exchange) => {
    const currency = exchange === 'binance' || type !== 'KRW' ? 'btc' : 'krw';
    const data = response[exchange][currency][code?.toUpperCase()];
    return { ...data, exchangeRate };
  };

  return useQuery({
    queryKey: ['exchange', code, type, exchange],
    queryFn: getTickers,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    select: selectFn,
  });
};

export default useExchangeData;
