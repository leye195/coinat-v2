import { useRef } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getCurrencyInfo } from '@/api';
import { combineTickers } from '@/lib/socket';
import sort, { initSort, Sort } from '@/lib/sort';
import { CoinState, typeState } from '@/store/coin';
import { exchangeState } from '@/store/exchange';

interface UseTickerDataProps {
  krwCoinData: CoinState;
  btcCoinData: CoinState;
}

const useTickerData = ({ krwCoinData, btcCoinData }: UseTickerDataProps) => {
  const selectedType = useRef<string | null>(null);
  const sortType = useRef({
    symbol: false,
    last: false,
    blast: false,
    per: false,
  });

  const coinType = useRecoilValue(typeState);
  const setExchangeState = useSetRecoilState(exchangeState);

  const getTickers = async () => {
    try {
      const data = combineTickers(
        coinType === 'KRW' ? krwCoinData.data : btcCoinData.data,
        coinType,
      );

      const { data: currencyData } = await getCurrencyInfo();

      const btc = data.find((data) => data.symbol === 'BTC');
      const upbitBit = btc?.last ?? 0;
      const binanceBit = btc?.blast ?? 0;

      setExchangeState({
        upbitBit,
        binanceBit,
        usdToKrw: currencyData.value,
        isLoading: false,
      });

      const result = sort(
        data,
        selectedType.current ?? 'symbol',
        sortType.current[selectedType.current as Sort],
      );
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (type: string) => () => {
    sortType.current = {
      ...initSort,
      [type]: !sortType.current[type as Sort],
    };

    selectedType.current = type;
  };

  const { data, ...rest } = useQuery({
    queryKey: ['coins', coinType, krwCoinData.data, btcCoinData.data],
    queryFn: getTickers,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  return {
    data,
    handleSort,
    ...rest,
  };
};

export default useTickerData;
