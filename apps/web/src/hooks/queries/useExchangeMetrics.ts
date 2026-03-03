import { useMemo } from 'react';
import { useCryptoSocketStore } from '@/store/socket';
import useCurrencyInfo from './useCurrencyInfo';

export const useExchangeMetrics = () => {
  const tickers = useCryptoSocketStore((state) => state.tickers);

  const upbitBTC = tickers?.upbit?.krw?.['BTC']?.tradePrice ?? 0;
  const binanceBTC = tickers?.binance?.btc?.['BTC']?.tradePrice ?? 0;

  const { data: currencyData } = useCurrencyInfo();
  const usdToKrw = currencyData?.value ?? 0;

  return useMemo(() => {
    const convertedToKrw = binanceBTC * usdToKrw;
    const bitDiff = convertedToKrw
      ? ((upbitBTC - convertedToKrw) / convertedToKrw) * 100
      : 0;
    const usdtToKrw = usdToKrw * (1 + bitDiff / 100);

    const isLoading = !upbitBTC || !usdToKrw;

    return {
      upbitBTC,
      binanceBTC: convertedToKrw,
      usdToKrw,
      usdtToKrw,
      bitDiff,
      isLoading,
    };
  }, [upbitBTC, binanceBTC, usdToKrw]);
};
