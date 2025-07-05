'use client';

import { useEffect } from 'react';
import { useCoinStore } from '@/store/coin';
import { Coin } from '@/types/Coin';

type UseInitCointListProps = {
  initialData: Record<'krw' | 'btc' | 'usdt', Coin[]>;
};

const useInitCoinList = ({ initialData }: UseInitCointListProps) => {
  const { setList, isLoading } = useCoinStore();

  useEffect(() => {
    if (
      initialData.krw.length === 0 ||
      initialData.btc.length === 0 ||
      !isLoading
    ) {
      return;
    }

    const { krw, btc, usdt } = initialData;

    setList({
      krw,
      btc,
      usdt,
    });
  }, [initialData, isLoading, setList]);
};

export default useInitCoinList;
