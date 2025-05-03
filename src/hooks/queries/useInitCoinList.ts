'use client';

import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  btcCoinListState,
  krCoinListState,
  usdtCoinListState,
} from '@/store/coin';
import { Coin } from '@/types/Coin';

type UseInitCointListProps = {
  initialData: Record<'krw' | 'btc' | 'usdt', Coin[]>;
};

const useInitCoinList = ({ initialData }: UseInitCointListProps) => {
  const setKrwCoinList = useSetRecoilState(krCoinListState);
  const setBtcCoinList = useSetRecoilState(btcCoinListState);
  const setUsdtCoinList = useSetRecoilState(usdtCoinListState);

  useEffect(() => {
    if (initialData.krw.length === 0 || initialData.btc.length === 0) {
      return;
    }

    const { krw, btc, usdt } = initialData;

    setKrwCoinList({
      isLoading: false,
      data: krw,
    });
    setBtcCoinList({ isLoading: false, data: btc });
    setUsdtCoinList({ isLoading: false, data: usdt });
  }, [initialData, setBtcCoinList, setKrwCoinList, setUsdtCoinList]);
};

export default useInitCoinList;
