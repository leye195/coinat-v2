import { Router } from 'next/router';
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
  effects: [
    ({ setSelf, resetSelf }) => {
      const handleRouteChange = (url: string) => {
        if (url.includes('type=BTC')) {
          setSelf('BTC');
        }

        if (!url || url === '/' || url.includes('?type=KRW')) {
          resetSelf();
        }
      };

      Router.events.on('routeChangeStart', handleRouteChange);

      return () => Router.events.off('routeChangeStart', handleRouteChange);
    },
  ],
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
