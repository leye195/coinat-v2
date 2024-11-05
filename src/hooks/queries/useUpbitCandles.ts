import { type AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { getUpbitCandles } from '@/api';
import type { CandleType, UpbitCandle } from '@/types/Candle';

type UseUpbitCandles = {
  priceSymbol: string;
  code: string;
  type: string;
  enabled?: boolean;
  onSuccess: (data: any) => void;
};

const useUpbitCandles = ({
  priceSymbol,
  code,
  type,
  enabled,
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

  return useQuery({
    queryKey: ['exchange', `${priceSymbol}-${code}`, type, 'upbit'],
    queryFn: ({ queryKey }) =>
      getUpbitCandles({
        market: queryKey[1],
        candleType: queryKey[2] as CandleType,
        count: 200,
      }),
    select: selectUpbitCandles,
    onSuccess,
    enabled,
    refetchOnWindowFocus: false,
  });
};

export default useUpbitCandles;
