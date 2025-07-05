import { useQuery } from '@tanstack/react-query';
import { getCurrencyInfo } from '@/api';

const useCurrencyInfo = () => {
  return useQuery({
    queryKey: ['currency-info'],
    queryFn: getCurrencyInfo,
    select: (result) => {
      return result.data;
    },
    refetchInterval: 1000 * 60 * 30,
    refetchIntervalInBackground: true,
  });
};

export default useCurrencyInfo;
