import { atom } from 'recoil';
import type { Coin } from 'types/Coin';

type CoinState = {
  isLoading: boolean;
  data: Coin[];
};

export const typeState = atom({
  key: 'typeState',
  default: 'KRW',
});

export const krCoinListState = atom<CoinState>({
  key: 'krCoinListState',
  default: {
    isLoading: true,
    data: [],
  },
});

export const btcCoinListState = atom<CoinState>({
  key: 'btcCoinListState',
  default: {
    isLoading: true,
    data: [],
  },
});
