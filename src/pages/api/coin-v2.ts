import createHandler from '@/server/middleware';
import { UpbitCoin } from 'types/Coin';

type Coin = {
  KRW: boolean;
  BTC: boolean;
  name: string;
};

type Currency = 'KRW' | 'BTC';

const app = createHandler();

app.get(async (req, res) => {
  try {
    const { type = 'KRW' } = req.query;

    // upbit coin data
    const upbitResponse = await (
      await fetch('https://api.upbit.com/v1/market/all')
    ).json();
    const upbitKrwCoins = upbitResponse.filter((coin: UpbitCoin) =>
      coin.market.includes('KRW-'),
    );
    const upbitBtcCoins = upbitResponse.filter((coin: UpbitCoin) =>
      coin.market.includes('BTC-'),
    );

    // binance coin data
    const binanceResponse = await (
      await fetch('https://api.binance.com/api/v3/exchangeInfo')
    ).json();
    const binanceBtcCoins = binanceResponse.symbols
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

    return res
      .status(200)
      .json(data.filter((data: Coin) => data[type as Currency]));
  } catch (err) {
    console.error(err);
  }
});

export default app;
