'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import sort, { initSort, Sort } from '@/lib/sort';
import { CoinState, typeState } from '@/store/coin';
import { exchangeState } from '@/store/exchange';
import { combineTickers, cryptoSocketState } from '@/store/socket';
import useCurrencyInfo from './useCurrencyInfo';

interface UseTickerDataProps {
  krwCoinData: CoinState;
  btcCoinData: CoinState;
  usdtCoinData: CoinState;
}

const useTickerData = ({
  krwCoinData,
  btcCoinData,
  usdtCoinData,
}: UseTickerDataProps) => {
  const selectedType = useRef<string | null>(null);
  const sortType = useRef({
    symbol: false,
    last: false,
    blast: false,
    per: false,
  });

  const coinType = useRecoilValue(typeState);
  const setExchangeState = useSetRecoilState(exchangeState);
  const tickerState = useRecoilValue(cryptoSocketState);
  const {
    data: currencyData = {
      value: 0,
      name: 'KRW_USD',
    },
  } = useCurrencyInfo();

  const getTickers = async () => {
    const { data: originData } =
      coinType === 'KRW'
        ? krwCoinData
        : coinType === 'USDT'
        ? usdtCoinData
        : btcCoinData;

    try {
      const combinedData = combineTickers(originData, tickerState, coinType); //combineTickers(originData, coinType);

      const btc = combinedData.find((data) => data.symbol === 'BTC');
      const upbitBTC = btc?.last ?? 0;
      const binanceBTC = btc?.blast ?? 0;

      setExchangeState({
        upbitBTC,
        binanceBTC,
        usdToKrw: currencyData?.value ?? 0,
        isLoading: false,
      });

      const result = sort(
        combinedData,
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
    queryKey: ['coins', coinType],
    queryFn: getTickers,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    enabled:
      !!krwCoinData.data.length &&
      !!btcCoinData.data.length &&
      !!usdtCoinData.data.length,
  });

  return {
    data,
    handleSort,
    ...rest,
  };
};

export default useTickerData;
