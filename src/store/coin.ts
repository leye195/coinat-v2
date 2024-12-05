import { atom } from 'recoil';
import { generateUid } from '@/lib/utils';
import type { Coin } from '@/types/Coin';

export type CoinState = {
  isLoading: boolean;
  data: Coin[];
};

export type WatchListState = Record<'krw' | 'btc', string[]>;

export const typeState = atom({
  key: `typeState/${generateUid()}`,
  default: 'KRW',
});

export const krCoinListState = atom<CoinState>({
  key: `krCoinListState/${generateUid()}`,
  default: {
    isLoading: true,
    data: [],
  },
});

export const btcCoinListState = atom<CoinState>({
  key: `btcCoinListState/${generateUid()}`,
  default: {
    isLoading: true,
    data: [],
  },
});

export const watchListState = atom<WatchListState>({
  key: `watchListState/${generateUid()}`,
  default: {
    krw: [],
    btc: [],
  },
});
