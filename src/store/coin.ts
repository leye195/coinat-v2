import { Router } from 'next/router';
import { atom } from 'recoil';
import type { Coin } from 'types/Coin';

type CoinState = {
  isLoading: boolean;
  data: Coin[];
};

export const typeState = atom({
  key: 'typeState',
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
