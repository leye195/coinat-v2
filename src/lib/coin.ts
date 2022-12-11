import { getBinanceCoins, getUpbitCoins } from 'api';
import { Coin, UpbitCoin } from 'types/Coin';

type Currency = 'KRW' | 'BTC';

export const getCoins = async (type: Currency) => {
  try {
    // upbit coin data
    const { data: upbitData } = await getUpbitCoins();
    const upbitKrwCoins = upbitData.filter((coin: UpbitCoin) =>
      coin.market.includes('KRW-'),
    );
    const upbitBtcCoins = upbitData.filter((coin: UpbitCoin) =>
      coin.market.includes('BTC-'),
    );

    // binance coin data
    const { data: binanceData } = await getBinanceCoins();
    const binanceBtcCoins = binanceData.symbols
      .filter(
        (data: any) => data.symbol.endsWith('BTC') && data.status === 'TRADING',
      )
      .map((data: any) => data.symbol.slice(0, data.symbol.length - 3));

    // filtered data
    const data: Coin[] = binanceBtcCoins
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

    return data.filter((data: Coin) => data[type as Currency]);
  } catch (err) {
    console.error(err);
    return [];
  }
};
