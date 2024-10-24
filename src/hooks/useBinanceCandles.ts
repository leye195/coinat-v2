import { type AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { getBinanceCandles } from '@/api';
import { reCalculateTimeStamp } from '@/lib/utils';
import { CandleType } from '@/types/Candle';

type UseBinanceCandles = {
  priceSymbol: string;
  code: string;
  type: string;
  enabled?: boolean;
  exchangeRate: number;
  onSuccess: (data: any) => void;
};

const useBinanceCandles = ({
  priceSymbol,
  code,
  type,
  enabled,
  exchangeRate,
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

  return useQuery({
    queryKey: ['exchange', `${code}BTC`, type, 'binance', priceSymbol],
    queryFn: ({ queryKey }) =>
      getBinanceCandles({
        symbol: queryKey[1],
        interval: queryKey[2] as CandleType,
      }),
    enabled,
    select: selectBinanceCandles,
    onSuccess,
    refetchOnWindowFocus: false,
  });
};

export default useBinanceCandles;
