'use client';

import { useCoinStore } from '@/store/coin';

const useCoinList = () => {
  const {
    krwList: krwCoinData,
    btcList: btcCoinData,
    usdtList: usdtCoinData,
  } = useCoinStore();

  return { krwCoinData, btcCoinData, usdtCoinData };
};

export default useCoinList;
