import { create } from 'zustand';
import { getPercent } from '@/lib/utils';
import { Coin } from '@/types/Coin';
import { Exchange } from '@/types/Ticker';

// zustand
export type CombinedTickers = {
  symbol: string;
  last: number;
  blast: number;
  convertedBlast?: number;
  per?: number;
  upbitWarning: boolean;
  binanceWarning: boolean;
};

type State = {
  tickers: Exchange | null;
  btcKrw: Record<'upbit' | 'binance', number>;
};

type Action = {
  setSocketState: (data: State) => void;
  combineTickers: (coinList: Coin[], type: string) => CombinedTickers[];
};

export const useCryptoSocketStore = create<State & Action>((set, get) => ({
  tickers: null,
  btcKrw: {
    upbit: 0,
    binance: 0,
  },
  setSocketState: (data: State) => {
    set(() => ({
      ...data,
    }));
  },
  combineTickers: (coinList: Coin[], type: string) => {
    const { tickers, btcKrw } = get();

    if (!tickers || !btcKrw) return [];

    const usdtKRW =
      tickers.upbit.krw['USDT'] == undefined
        ? 0
        : tickers.upbit.krw['USDT'].tradePrice;

    const result: CombinedTickers[] = [{ name: 'BTC' }, ...coinList].map(
      ({ name }) => {
        if (type === 'KRW' || name === 'BTC') {
          const btcConvertedBlast =
            tickers.binance.btc[name] == undefined
              ? 0
              : tickers.binance.btc[name].tradePrice * btcKrw.upbit;

          return {
            symbol: name,
            last:
              tickers.upbit.krw[name] == undefined
                ? 0
                : tickers.upbit.krw[name].tradePrice,
            blast:
              tickers.binance.btc[name] == undefined
                ? 0
                : tickers.binance.btc[name].tradePrice,
            convertedBlast: parseFloat(
              btcConvertedBlast.toFixed(btcConvertedBlast < 1 ? 7 : 2),
            ),
            per:
              tickers.upbit.krw[name] == undefined ||
              tickers.binance.btc[name] == undefined
                ? 0
                : getPercent(
                    tickers.upbit.krw[name].tradePrice,
                    tickers.binance.btc[name].tradePrice * btcKrw.upbit,
                  ),
            upbitChangePrice: tickers.upbit.krw[name]?.changePrice,
            upbitChangeRate: tickers.upbit.krw[name]?.changeRate,
            binanceChangePrice: tickers.binance.btc[name]?.changePrice,
            binanceChangeRate: tickers.binance.btc[name]?.changeRate,
            upbitWarning: tickers.upbit.krw[name]?.marketWarning === 'CAUTION',
            binanceWarning:
              tickers.binance.btc[name]?.marketWarning === 'CAUTION',
          };
        }

        if (type === 'USDT') {
          const usdtConvertedBlast =
            tickers.binance.usdt[name]?.tradePrice == undefined
              ? 0
              : tickers.binance.usdt[name].tradePrice * usdtKRW;

          return {
            symbol: name,
            last:
              tickers.upbit.usdt[name] == undefined
                ? 0
                : tickers.upbit.usdt[name].tradePrice,
            blast:
              tickers.binance.usdt[name]?.tradePrice == undefined
                ? 0
                : parseFloat(tickers.binance.usdt[name].tradePrice.toFixed(7)),
            convertedBlast: parseFloat(
              usdtConvertedBlast.toFixed(usdtConvertedBlast < 1 ? 7 : 2),
            ),
            per:
              tickers.upbit.usdt[name] == undefined ||
              tickers.binance.usdt[name] == undefined
                ? 0
                : getPercent(
                    tickers.upbit.krw[name].tradePrice,
                    parseFloat(
                      (tickers.binance.usdt[name].tradePrice * usdtKRW).toFixed(
                        4,
                      ),
                    ),
                  ),
            upbitChangePrice: tickers.upbit.usdt[name]?.changePrice,
            upbitChangeRate: tickers.upbit.usdt[name]?.changeRate,
            binanceChangePrice: tickers.binance.usdt[name]?.changePrice,
            binanceChangeRate: tickers.binance.usdt[name]?.changeRate,
            upbitWarning: tickers.upbit.btc[name]?.marketWarning === 'CAUTION',
            binanceWarning:
              tickers.binance.btc[name]?.marketWarning === 'CAUTION',
          };
        }

        return {
          symbol: name,
          last:
            tickers.upbit.btc[name] == undefined
              ? 0
              : tickers.upbit.btc[name].tradePrice,
          blast:
            tickers.binance.btc[name]?.tradePrice == undefined
              ? 0
              : tickers.binance.btc[name].tradePrice,
          convertedBlast: undefined,
          per:
            tickers.upbit.btc[name] == undefined ||
            tickers.binance.btc[name] == undefined
              ? 0
              : getPercent(
                  tickers.upbit.btc[name].tradePrice,
                  tickers.binance.btc[name].tradePrice,
                ),
          upbitChangePrice: tickers.upbit.btc[name]?.changePrice,
          upbitChangeRate: tickers.upbit.btc[name]?.changeRate,
          binanceChangePrice: tickers.binance.btc[name]?.changePrice,
          binanceChangeRate: tickers.binance.btc[name]?.changeRate,
          upbitWarning: tickers.upbit.btc[name]?.marketWarning === 'CAUTION',
          binanceWarning:
            tickers.binance.btc[name]?.marketWarning === 'CAUTION',
        };
      },
    );

    return result;
  },
}));
