'use client';

import { useRecoilValue } from 'recoil';
import {
  btcCoinListState,
  krCoinListState,
  usdtCoinListState,
} from '@/store/coin';

const useCoinList = () => {
  const krwCoinData = useRecoilValue(krCoinListState);
  const btcCoinData = useRecoilValue(btcCoinListState);
  const usdtCoinData = useRecoilValue(usdtCoinListState);

  return { krwCoinData, btcCoinData, usdtCoinData };
};

export default useCoinList;
