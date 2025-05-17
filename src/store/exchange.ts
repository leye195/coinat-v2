import { create } from 'zustand';

// zustand

type State = {
  upbitBTC: number;
  binanceBTC: number;
  usdToKrw: number;
  usdtToKrw: number;
  bitDiff: number;
  isLoading: boolean;
};

type Action = {
  setExchangeState: (data: Omit<State, 'usdtToKrw' | 'bitDiff'>) => void;
};

export const useExchangeStore = create<State & Action>((set) => ({
  upbitBTC: 0,
  binanceBTC: 0,
  usdToKrw: 0,
  usdtToKrw: 0,
  bitDiff: 0,
  isLoading: true,
  setExchangeState: (data: Omit<State, 'usdtToKrw' | 'bitDiff'>) => {
    const { upbitBTC, binanceBTC, usdToKrw, isLoading } = data;

    const convertedToKrw = binanceBTC * usdToKrw;
    const bitDiff = ((upbitBTC - convertedToKrw) / convertedToKrw) * 100;
    const usdtToKrw = usdToKrw * (1 + bitDiff / 100);

    set(() => ({
      upbitBTC,
      binanceBTC: convertedToKrw,
      usdToKrw,
      usdtToKrw,
      bitDiff,
      isLoading,
    }));
  },
}));
