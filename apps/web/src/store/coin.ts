import { create } from 'zustand';
import type { Coin } from '@/types/Coin';

// zustand

type State = {
  type: string; // KRW | USDT | BTC
  krwList: Coin[];
  btcList: Coin[];
  usdtList: Coin[];
  isLoading: boolean;
};

type Action = {
  updateType: (type: string) => void;
  setList: (data: Record<'krw' | 'btc' | 'usdt', Coin[]>) => void;
};

export const useCoinStore = create<State & Action>((set) => ({
  type: 'KRW',
  krwList: [],
  btcList: [],
  usdtList: [],
  isLoading: true,
  updateType: (type: string) => {
    set(() => ({ type }));
  },
  setList: (data: Record<'krw' | 'btc' | 'usdt', Coin[]>) => {
    set({
      isLoading: false,
      krwList: data.krw,
      btcList: data.btc,
      usdtList: data.usdt,
    });
  },
}));
