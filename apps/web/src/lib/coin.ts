import { getUpbitCoinsV2, getBinanceCoinsV2 } from '@/api';
import type { Coin, UpbitCoin } from '@/types/Coin';

type Currency = 'KRW' | 'BTC' | 'USDT';

export const getCoinSymbolImage = (symbol: string) =>
  `https://static.upbit.com/logos/${symbol}.png`;

export const getCoinsV2 = async (type: Currency) => {
  try {
    // upbit coin data
    const upbitData = await getUpbitCoinsV2();
    const upbitKrwCoins: UpbitCoin[] = upbitData.filter((coin: UpbitCoin) =>
      coin.market.includes('KRW-'),
    );
    const upbitBtcCoins: UpbitCoin[] = upbitData
      .filter((coin: UpbitCoin) => coin.market.includes('BTC-'))
      .filter((coin: UpbitCoin) => {
        const symbol = coin.market.replace(/BTC-/, '');
        return !upbitKrwCoins.some((coin: UpbitCoin) =>
          coin.market.includes(symbol),
        );
      });

    // binance coin data
    const binanceData = await getBinanceCoinsV2();
    const binanceBtcCoins = binanceData?.symbols
      ?.filter(
        (data: any) => data.symbol.endsWith('BTC') && data.status === 'TRADING',
      )
      .map((data: any) => data.symbol.slice(0, data.symbol.length - 3));
    const binanceUsdtCoins = binanceData?.symbols
      ?.filter(
        (data: any) =>
          data.symbol.endsWith('USDT') && data.status === 'TRADING',
      )
      .map((data: any) => data.symbol.slice(0, data.symbol.length - 4))
      .slice(1);

    // filtered data
    const dataWithUSDT: Coin[] = binanceUsdtCoins
      .filter(
        (symbol: string) =>
          upbitKrwCoins.findIndex(
            ({ market }: any) => market === `KRW-${symbol}`,
          ) !== -1,
      )
      .map((symbol: string) => {
        const data = {
          name: symbol,
          USDT:
            upbitKrwCoins.findIndex(
              ({ market }: any) => market === `KRW-${symbol}`,
            ) !== -1,
        };
        return data;
      })
      .sort((data1: Coin, data2: Coin) => (data1.name > data2.name ? 1 : -1));

    const dataWithBTC: Coin[] = binanceBtcCoins
      .filter(
        (symbol: string) =>
          upbitKrwCoins.findIndex(
            ({ market }: any) => market === `KRW-${symbol}`,
          ) !== -1 ||
          upbitBtcCoins.findIndex(
            ({ market }: any) => market === `BTC-${symbol}`,
          ) !== -1,
      )
      .map((symbol: string) => {
        const data = {
          name: symbol,
          KRW:
            upbitKrwCoins.findIndex(
              ({ market }: any) => market === `KRW-${symbol}`,
            ) !== -1,
          BTC:
            upbitBtcCoins.findIndex(
              ({ market }: any) => market === `BTC-${symbol}`,
            ) !== -1,
        };
        return data;
      })
      .sort((data1: Coin, data2: Coin) => (data1.name > data2.name ? 1 : -1));

    return type === 'USDT'
      ? dataWithUSDT.filter((data: Coin) => data.USDT)
      : dataWithBTC.filter((data: Coin) => data[type as Currency]);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getCoins = async (type: Currency) => {
  try {
    // upbit coin data
    const upbitData = await getUpbitCoinsV2();
    const upbitKrwCoins: UpbitCoin[] = upbitData.filter((coin: UpbitCoin) =>
      coin.market.includes('KRW-'),
    );
    const upbitBtcCoins: UpbitCoin[] = upbitData.filter((coin: UpbitCoin) =>
      coin.market.includes('BTC-'),
    );

    // binance coin data
    const binanceData = await getBinanceCoinsV2();
    const binanceBtcCoins = binanceData.symbols
      .filter(
        (data: any) => data.symbol.endsWith('BTC') && data.status === 'TRADING',
      )
      .map((data: any) => data.symbol.slice(0, data.symbol.length - 3));
    const binanceUsdtCoins = binanceData?.symbols
      ?.filter(
        (data: any) =>
          data.symbol.endsWith('USDT') && data.status === 'TRADING',
      )
      .map((data: any) => data.symbol.slice(0, data.symbol.length - 4))
      .slice(1);

    // filtered data
    const dataWithUSDT: Coin[] = binanceUsdtCoins
      .filter(
        (symbol: string) =>
          upbitKrwCoins.findIndex(
            ({ market }: any) => market === `KRW-${symbol}`,
          ) !== -1,
      )
      .map((symbol: string) => {
        const data = {
          name: symbol,
          USDT:
            upbitKrwCoins.findIndex(
              ({ market }: any) => market === `KRW-${symbol}`,
            ) !== -1,
        };
        return data;
      })
      .sort((data1: Coin, data2: Coin) => (data1.name > data2.name ? 1 : -1));

    const dataWithBTC: Coin[] = binanceBtcCoins
      .filter(
        (symbol: string) =>
          upbitKrwCoins.findIndex(
            ({ market }: any) => market === `KRW-${symbol}`,
          ) !== -1 ||
          upbitBtcCoins.findIndex(
            ({ market }: any) => market === `BTC-${symbol}`,
          ) !== -1,
      )
      .map((symbol: string) => {
        const data = {
          name: symbol,
          KRW:
            upbitKrwCoins.findIndex(
              ({ market }: any) => market === `KRW-${symbol}`,
            ) !== -1,
          BTC:
            upbitBtcCoins.findIndex(
              ({ market }: any) => market === `BTC-${symbol}`,
            ) !== -1,
        };
        return data;
      })
      .sort((data1: Coin, data2: Coin) => (data1.name > data2.name ? 1 : -1));

    return type === 'USDT'
      ? dataWithUSDT.filter((data: Coin) => data.USDT)
      : dataWithBTC.filter((data: Coin) => data[type as Currency]);
  } catch (err) {
    console.error(err);
    return [];
  }
};
