import { atom, selector } from 'recoil';
import { generateUid } from '@/lib/utils';

type ExchangeState = {
  upbitBTC: number;
  binanceBTC: number;
  usdToKrw: number;
  isLoading: boolean;
};

export const exchangeState = atom<ExchangeState>({
  key: `exchangeState/${generateUid()}`,
  default: {
    upbitBTC: 0,
    binanceBTC: 0,
    usdToKrw: 0,
    isLoading: true,
  },
});

export const exchangeSelector = selector({
  key: `exchangeSelector/${generateUid()}`,
  get: ({ get }) => {
    const { upbitBTC, binanceBTC, usdToKrw, isLoading } = get(exchangeState);
    const convertedToKrw = binanceBTC * usdToKrw;
    const bitDiff = ((upbitBTC - convertedToKrw) / convertedToKrw) * 100;
    const usdtToKrw = usdToKrw * (1 + bitDiff / 100);

    return {
      usdToKrw,
      upbitBTC,
      binanceBTC: convertedToKrw,
      usdtToKrw: isNaN(usdtToKrw) ? 0 : usdtToKrw,
      bitDiff: isNaN(bitDiff) || !bitDiff ? 0 : bitDiff,
      isLoading,
    };
  },
});
