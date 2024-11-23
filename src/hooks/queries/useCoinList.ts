'use client';

import { useRecoilValue } from 'recoil';
import { btcCoinListState, krCoinListState } from '@/store/coin';

const useCoinList = () => {
  const krwCoinData = useRecoilValue(krCoinListState);
  const btcCoinData = useRecoilValue(btcCoinListState);
  return { krwCoinData, btcCoinData };
};

export default useCoinList;
