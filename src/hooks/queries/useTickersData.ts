'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import sort, { initSort, Sort } from '@/lib/sort';
import { useCoinStore } from '@/store/coin';
import { useExchangeStore } from '@/store/exchange';
import { combineTickers, cryptoSocketState } from '@/store/socket';
import { Coin } from '@/types/Coin';
import useCurrencyInfo from './useCurrencyInfo';

interface UseTickerDataProps {
  krwCoinData: Coin[];
  btcCoinData: Coin[];
  usdtCoinData: Coin[];
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

  const { type } = useCoinStore();

  const { setExchangeState } = useExchangeStore();
  const tickerState = useRecoilValue(cryptoSocketState);
  const {
    data: currencyData = {
      value: 0,
      name: 'KRW_USD',
    },
  } = useCurrencyInfo();

  const getTickers = async () => {
    const originData =
      type === 'KRW'
        ? krwCoinData
        : type === 'USDT'
        ? usdtCoinData
        : btcCoinData;

    try {
      const combinedData = combineTickers(originData, tickerState, type); //combineTickers(originData, coinType);

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
    queryKey: ['coins', type],
    queryFn: getTickers,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    enabled:
      !!krwCoinData.length && !!btcCoinData.length && !!usdtCoinData.length,
  });

  return {
    data,
    handleSort,
    ...rest,
  };
};

export default useTickerData;
